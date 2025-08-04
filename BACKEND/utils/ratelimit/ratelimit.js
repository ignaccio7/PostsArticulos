import { rateLimit } from 'express-rate-limit'
import CustomRateLimiter from './custom-rate-limiter.js'

import config from '../../config.js'
const { rate_limit_general, rate_limit_read, rate_limit_write } = config

// console.log({ rate_limit_general, rate_limit_read, rate_limit_write })

// =============================================================================
// 1. CREAR INSTANCIAS DE TU STORE PERSONALIZADO
// =============================================================================
// ¿Por qué separar? Para tener contadores independientes por tipo de operación
const generalStore = new CustomRateLimiter()
const readStore = new CustomRateLimiter()
const writeStore = new CustomRateLimiter()

// =============================================================================
// 2. FUNCIÓN GENERADORA DE KEYS PERSONALIZADA
// =============================================================================
// Combina: IP + User-Agent + tipo de operación
// Ejemplo: "192.168.1.1_Chrome_read" vs "192.168.1.1_Chrome_write"
function generateKey(req, type = 'general') {
  // ¿Por qué personalizada? Para distinguir entre diferentes tipos de límites
  const baseKey = `${req.ip}-${req.get('User-Agent') || 'unknown'}`
  return `${type}_${baseKey}`
}

// =============================================================================
// 3. MIDDLEWARE PARA VERIFICAR BANEOS GLOBALES
// =============================================================================
// Se ejecuta ANTES que cualquier rate limiter
function checkBanned(req, res, next) {
  const method = req.method.toUpperCase()
  const generalKey = generateKey(req, 'general')

  // const writeKey = generateKey(req, 'write')
  // const readKey = generateKey(req, 'read')

  if (generalStore.isBanned(generalKey)) {
    const banInfo = generalStore.banned.get(generalKey)
    const remainingTime = new Date(banInfo.until).toLocaleTimeString()

    return res.status(429).json({
      statusCode: 429,
      message: `Tu esta baneado hasta: ${remainingTime}`,
      details: {
        resetTime: remainingTime,
        banType: 'rate_limit',
      },
    })
  }

  if (method === 'GET') {
    // const readKey = generateKey(req, 'read')
    // if (readStore.isBanned(readKey)) {
    //   const banInfo = readStore.banned.get(readKey)
    //   const remainingTime = Math.ceil((banInfo.until - Date.now()) / 1000)

    //   return res.status(429).json({
    //     statusCode: 429,
    //     message: `You are banned for ${remainingTime}`,
    //     details: {
    //       banType: 'read',
    //       bannedUntil: new Date(banInfo.until).toLocaleTimeString(),
    //     },
    //   })
    // }
    return next()
  }
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return next()
  }

  return next() // No está baneado, continuar
}

// ┌─────────────────────────────────────────────────────────────────────────┐
// │                        LIMITADOR GENERAL                                │
// │  Se aplica a TODAS las rutas como primera línea de defensa             │
// └─────────────────────────────────────────────────────────────────────────┘
const generalLimiter = rateLimit({
  // ═══════════════════════ CONFIGURACIONES BÁSICAS ═══════════════════════
  windowMs: 5 * 60 * 1000, // 5 * 60 * 1000 <-> 5 minutos | 15 * 60 * 1000 <-> 15 minutos - ventana de tiempo
  limit: rate_limit_general, // 100 peticiones máximo por ventana Number(rate_limit_general)

  // ═══════════════════════ STORE PERSONALIZADO ═══════════════════════════
  store: generalStore, // Usa tu clase CustomRateLimiter

  // ═══════════════════════ GENERADOR DE KEYS ═══════════════════════════
  // MOMENTO 1: keyGenerator se ejecuta ANTES de verificar el límite
  keyGenerator: (req) => generateKey(req, 'general'),

  // ═══════════════════════ HEADERS DE RESPUESTA ═══════════════════════════
  standardHeaders: true, // Incluye headers estándar: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
  legacyHeaders: false, // NO incluye headers antiguos: X-RateLimit-*

  // ═══════════════════════ COMPORTAMIENTO ═══════════════════════════════
  skipSuccessfulRequests: false, // false = cuenta TODAS las peticiones (éxito y error)
  skipFailedRequests: false, // false = cuenta errores 4xx/5xx también

  // ═══════════════════════ MENSAJE PERSONALIZADO ═══════════════════════════
  // message: { -> ESTO NO SE USA PORQUE TENEMOS UN HANDLER
  //   error: 'Demasiadas peticiones desde tu IP',
  //   type: 'general_rate_limit',
  //   retryAfter: 'Espera 15 minutos antes de intentar de nuevo',
  // },

  // ═══════════════════════ HANDLER PERSONALIZADO ═══════════════════════════
  // MOMENTO 2: handler se ejecuta DESPUÉS de que se excedió el límite - por eso volvemos a generar la misma key para banearla
  handler: (req, res) => {
    const key = generateKey(req, 'general')
    const writeKey = generateKey(req, 'write')
    const readKey = generateKey(req, 'read')

    // Si excede significativamente, banear por 30 minutos
    // if (req.rateLimit.totalHits > rate_limit_general + 10) {
    // console.log('generalLimiter', JSON.stringify(req.rateLimit))

    if (req.rateLimit.used > rate_limit_general + 3) {
      const isBannedInReadKey = readStore.isBanned(readKey)
      const isBannedInWriteKey = writeStore.isBanned(writeKey)
      const banTime =
        isBannedInReadKey && isBannedInWriteKey
          ? 2 * 60 * 60 * 1000
          : isBannedInReadKey || isBannedInWriteKey
            ? 1 * 60 * 60 * 1000
            : 30 * 60 * 1000

      const banDuration = Date.now() + banTime + 30 * 60 * 1000
      generalStore.banUser(key, banDuration) // 30 min ban por defecto + tiempo adicional

      return res.status(429).json({
        statusCode: 429,
        message: 'Excediste el limite de peticiones estas baneado',
        details: {
          resetTime: `${new Date(banDuration).toLocaleTimeString()}`,
          banType: 'general',
        },
      })
    }

    // Respuesta normal de límite excedido
    res.status(429).json({
      statusCode: 429,
      message: 'Estas realizando demasiadas peticiones.',
      details: {
        // limit: req.rateLimit.limit,
        // current: req.rateLimit.used,
        resetTime: new Date(req.rateLimit.resetTime).toLocaleTimeString(),
        type: 'general_limit',
      },
    })
  },
})

// ┌─────────────────────────────────────────────────────────────────────────┐
// │                     LIMITADOR PARA LECTURAS (GET)                      │
// │  Más permisivo porque leer datos es menos costoso                      │
// └─────────────────────────────────────────────────────────────────────────┘
const readLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 5 minutos - ventana más corta
  limit: rate_limit_read, // 15 GETs por minuto (bastante generoso) Number(rate_limit_read)

  store: readStore,
  keyGenerator: (req) => generateKey(req, 'read'),

  standardHeaders: true,
  legacyHeaders: false,

  // ═══════════════════════ CONFIGURACIONES ESPECIALES PARA LECTURA ═══════════════════════
  skipSuccessfulRequests: false, // Contamos todas las lecturas
  skipFailedRequests: false, // NO contamos errores 4xx/5xx en lecturas

  // message: {
  //   error: 'Demasiadas peticiones de lectura',
  //   type: 'read_rate_limit',
  //   suggestion: 'Las operaciones de lectura están limitadas a 15 por minuto',
  // },

  handler: (req, res) => {
    const key = generateKey(req, 'read')

    // Ban más suave para lecturas (solo si REALMENTE abusa)
    // if (req.rateLimit.totalHits > Number(rate_limit_read) + 10) {
    // console.log('readLimiter', JSON.stringify(req.rateLimit))

    if (req.rateLimit.used > rate_limit_read + 3) {
      readStore.banUser(key, 5 * 60 * 1000) // 5 min ban
      const banInfo = readStore.banned.get(key)

      return res.status(429).json({
        statusCode: 429,
        message: 'Has sido baneado por exceso de lecturas',
        // error: 'Temporalmente bloqueado por exceso de lecturas',
        details: {
          resetTime: `${new Date(banInfo.until).toLocaleTimeString()}`,
          type: 'read_ban',
        },
      })
    }

    res.status(429).json({
      // error: 'Demasiadas peticiones de lectura',
      // limit: req.rateLimit.limit,
      statusCode: 429,
      message: 'Estas realizando demasiadas peticiones de lectura.',
      details: {
        resetTime: new Date(req.rateLimit.resetTime).toLocaleTimeString(),
        type: 'read_limit',
      },
    })
  },
})

// // ┌─────────────────────────────────────────────────────────────────────────┐
// // │                   LIMITADOR PARA ESCRITURAS (POST/PUT/DELETE)          │
// // │  Más restrictivo porque modificar datos es más costoso                 │
// // └─────────────────────────────────────────────────────────────────────────┘
const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 1 minuto
  limit: rate_limit_write, // Solo 3 operaciones de escritura por minuto Number(rate_limit_write)

  store: writeStore,
  keyGenerator: (req) => generateKey(req, 'write'),

  standardHeaders: true,
  legacyHeaders: false,

  // ═══════════════════════ CONFIGURACIONES ESPECIALES PARA ESCRITURA ═══════════════════════
  skipSuccessfulRequests: false, // Contamos TODAS las escrituras
  skipFailedRequests: false, // También contamos errores (para prevenir spam)

  // message: {
  //   error: 'Límite de operaciones de escritura excedido',
  //   type: 'write_rate_limit',
  //   explanation: `POST/PUT/DELETE están limitados a ${rate_limit_write} por minuto para proteger la base de datos`,
  // },

  handler: (req, res) => {
    const key = generateKey(req, 'write')

    // Ban MÁS estricto para escrituras
    // if (req.rateLimit.totalHits > rate_limit_write + 2) {
    if (req.rateLimit.used > rate_limit_write + 2) {
      writeStore.banUser(key, 10 * 60 * 1000) // 10 min ban
      const banInfo = writeStore.banned.get(key)

      return res.status(429).json({
        // error: 'Temporalmente bloqueado por exceso de escrituras',
        statusCode: 429,
        message: 'Has sido baneado por exceso de escrituras.',
        details: {
          resetTime: `${new Date(banInfo.until).toLocaleTimeString()}`,
          type: 'write_ban',
        },
      })
    }

    res.status(429).json({
      // error: 'Demasiadas peticiones de escritura',
      // limit: req.rateLimit.limit,
      // remaining: new Date(req.rateLimit.remaining).toLocaleTimeString(),
      statusCode: 429,
      message: 'Estas realizando demasiadas peticiones de escritura.',
      details: {
        resetTime: new Date(req.rateLimit.resetTime).toLocaleTimeString(),
        type: 'write_limit',
      },
    })
  },
})

function verifyLimiterForMethod(req, res, next) {
  // - GET (leer): Operación barata, puede ser más permisiva
  // - POST/PUT/DELETE (escribir): Operación costosa, debe ser restrictiva
  if (req.method === 'GET') {
    readLimiter(req, res, next)
  } else if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    writeLimiter(req, res, next)
  } else {
    // Métodos no comunes (OPTIONS, HEAD, etc.) pasan sin límite adicional
    next()
  }
}

export { checkBanned, generalLimiter, verifyLimiterForMethod }
