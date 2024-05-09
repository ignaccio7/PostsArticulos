// Manejo de errores
export const handleErrors = (err, req, res, next) => {
  // console.log('El error es', err.message)
  if (err && err.message === 'jwt expired') {
    return res.status(401).json({ statusCode: 401, message: 'Token expirado' })
  }
  if (err && err.message === 'invalid signature') {
    return res.status(401).json({ statusCode: 401, message: 'Token invalido' })
  }
  // si es un error de permiso de usuario
  if (err && err.message === 'Not permission allowed') {
    return res.status(401).json({ statusCode: 401, message: 'Acceso denegado: el usuario no es administrador' })
  }
  // si es un error de CORS
  if (err && err.message === 'Not allowed by CORSa') {
    return res.status(403).json({ statusCode: 403, message: 'Acceso prohibido por CORS' })
  }
  if (err) {
    return res.status(400).json({ statusCode: 403, message: err.message })
  }
  // Continuar al siguiente middleware si no es un error
  return next()
}
