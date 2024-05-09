import jwt from 'jsonwebtoken'
import config from '../config.js'
import UserModel from '../models/user.js'

const secretKey = config.SECRET

export function generateToken ({ user }) {
  return jwt.sign({ user }, secretKey, {
    expiresIn: '1h' // 1 min
    // expiresIn: 60 * 60 * 24 // 1 dia
  })
}

// middleware
export async function verifyToken (request, response, next) {
  const authorization = request.get('authorization')

  if (!authorization || !authorization.toLowerCase().startsWith('bearer')) {
    return response.status(401).json({ statusCode: 401, message: 'Token no encontrado' })
  }
  const token = request.headers.authorization?.split(' ')[1]
  try {
    const decodedToken = jwt.verify(token, secretKey)
    const { user } = decodedToken
    const result = await UserModel.searchByUsername({ username: user })
    const { rol } = result[0]
    request.typeUser = rol
    // console.log(decodedToken)
    next()
  } catch (error) {
    // console.log('error in token')
    // console.log(error)
    next(error)
  }
}
