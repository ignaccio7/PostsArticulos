import jwt from 'jsonwebtoken'
import config from '../config.js'

const secretKey = config.SECRET

export function generateToken ({ user }) {
  return jwt.sign({ user }, secretKey)
}

// middleware
export function verifyToken (request, response, next) {
  const token = request.headers.authorization?.split(' ')[1]
  if (!token) {
    return response.status(401).json({ statusCode: 401, message: 'Token no encontrado' })
  }

  try {
    const decodedToken = jwt.verify(token, secretKey)
    console.log(decodedToken)
    next()
  } catch (error) {
    response.status(401).json({ statusCode: 401, message: 'Token Invalido' })
  }
}
