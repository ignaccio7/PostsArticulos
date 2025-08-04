// Store personalizado para manejar rate limiting
class CustomRateLimiter {
  constructor() {
    // HITS: Mapa que guarda cuántas peticiones ha hecho cada usuario
    // Ejemplo: hits.set("192.168.1.1_Chrome", 5) = esta IP con Chrome ha hecho 5 peticiones
    this.hits = new Map()

    // BANNED: Mapa que guarda usuarios baneados temporalmente
    // Ejemplo: banned.set("192.168.1.1_Chrome", {until: 1640995200000, bannedAt: 1640908800000})
    this.banned = new Map()

    // RESETTIME: Mapa que guarda cuándo se reinicia el contador de cada usuario
    // Ejemplo: resetTime.set("192.168.1.1_Chrome", 1640995200000) = se reinicia en esa fecha
    this.resetTime = new Map()

    // WINDOWMS: Tiempo de espera para que un usuario no pueda exceder el limite de peticiones que se le permite
    this.windowMs = 60000 // Por defecto 1 minuto pero sera sobreescrito por init()
  }

  // METODO REQUERIDO: init() - Recibe las opciones del limitador
  init(options) {
    this.windowMs = options.windowMs
  }

  // Verifica si un usuario está baneado
  isBanned(key) {
    const banInfo = this.banned.get(key) // Busca si este usuario está en la lista de baneados
    if (!banInfo) return false // Si no está baneado, devuelve false

    // Verifica si el ban aún está vigente
    if (Date.now() < banInfo.until) {
      return true // Sí está baneado todavía
    }
    // El ban expiró, lo removemos automáticamente
    this.banned.delete(key)
    return false // Ya no está baneado
  }

  // Banea un usuario por tiempo específico
  banUser(key, durationMs) {
    this.banned.set(key, {
      until: Date.now() + durationMs, // Hasta cuándo está baneado (timestamp)
      bannedAt: Date.now(), // Cuándo fue baneado (para logs/debugging)
    })
    // Limpiamos sus datos actuales porque está baneado
    this.hits.delete(key)
    this.resetTime.delete(key)
  }

  // FUNCIÓN MÁS IMPORTANTE: Esta función es requerida por express-rate-limit
  // Se ejecuta cada vez que alguien hace una petición
  async increment(key, windowMs) {
    // PASO 1: Verificar si está baneado
    // ESTE NOSE EJECUTARA YA QUE ESTAMOS VERIFICANDO MEDIANTES UN MIDDLEWARE EN EL APP ANTES
    if (this.isBanned(key)) {
      const banInfo = this.banned.get(key)

      // Math.ceil() redondea hacia arriba: 2.1 → 3, 2.9 → 3
      // (banInfo.until - Date.now()) = milisegundos restantes del ban
      // / 1000 = convertir a segundos
      // Math.ceil() = redondear segundos hacia arriba
      // const remainingTime = Math.ceil((banInfo.until - Date.now()) / 1000)

      // console.log(`   ❌ USER IS BANNED - returning:`, banInfo.until)

      return {
        totalHits: 999, // Número arbitrario alto para indicar "baneado"
        resetTime: new Date(banInfo.until), // Cuándo termina el ban
      }
    }

    const now = Date.now() // Timestamp actual en milisegundos
    const resetTime = this.resetTime.get(key) // ¿Cuándo se reinicia el contador de este usuario?

    // console.log(`   Current time: ${now}`)
    // console.log(`   Reset time: ${resetTime}`)
    // console.log(`   Window expired: ${!resetTime || now > resetTime}`)

    // PASO 2: Si no existe contador o la ventana de tiempo expiró
    if (!resetTime || now > resetTime) {
      // Empezar nueva ventana de tiempo
      this.hits.set(key, 1) // Primera petición = 1 hit
      this.resetTime.set(key, now + this.windowMs) // La ventana expira en now + windowMs

      // console.log(`   ✅ NEW WINDOW - returning:`, {
      //   totalHits: 1,
      //   resetTime: new Date(now + windowMs),
      // })

      return {
        totalHits: 1, // Primera petición
        resetTime: new Date(now + windowMs), // Cuándo se reinicia
      }
    }

    // PASO 3: La ventana de tiempo aún está activa, incrementar contador
    const currentHits = (this.hits.get(key) || 0) + 1 // Hits actuales + 1
    this.hits.set(key, currentHits) // Guardar nuevo total

    // console.log(`   📈 INCREMENT - hits: ${currentHits}, returning:`, {
    //   totalHits: currentHits,
    //   resetTime: new Date(resetTime),
    // })

    return {
      totalHits: currentHits, // Total de hits en esta ventana
      resetTime: new Date(resetTime), // Cuándo se reinicia (no cambia)
    }
  }

  // Función para decrementar (usada cuando skipSuccessfulRequests = true)
  async decrement(key) {
    const currentHits = this.hits.get(key)
    if (currentHits && currentHits > 0) {
      this.hits.set(key, currentHits - 1) // Restar 1 hit
    }
  }

  // Función para resetear completamente un usuario
  async resetKey(key) {
    this.hits.delete(key) // Borrar hits
    this.resetTime.delete(key) // Borrar tiempo de reset
    this.banned.delete(key) // Borrar ban si existe
  }
}

export default CustomRateLimiter
