// Manejo de errores
export const handleErrors = (err, req, res, next) => {
  // console.log('El error es', err.message)
  if (err && err.message === 'jwt must be provided') {
    return res.status(401).json({ statusCode: 401, message: 'Token no encontrado' })
  }
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
  // si es un error al subir un archivo que no sea una imagen
  if (err && err.message === 'InvalidTypeMulter') {
    return res.status(400).json({ statusCode: 403, message: 'Invalid file type. Only JPEG, PNG, AVIF and WEBP are allowed' })
  }
  if (err) {
    console.log('error en handleErrors')

    console.log({ err })

    return res.status(400).json({ statusCode: 400, message: err.message })
  }
  // Continuar al siguiente middleware si no es un error
  return next()
}
