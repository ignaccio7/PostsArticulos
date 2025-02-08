import jwt from 'jsonwebtoken'
import config from '../config.js'
import UserModel from '../models/user.js'

const secretKey = config.SECRET

export async function generateToken ({ user }) {
  return jwt.sign({ user }, secretKey, {
    // expiresIn: '1h' // 1 min
    expiresIn: 60 * 60 * 24 * 7// 1 dia
  })
}

// esta validacion sera para la ruta de articles donde puede o no tener un UserId
const SKIP_VERIFICATION = Symbol('skipVerification') // TODO eliminar el symbol for y trabajar solo con la referencia SKIP_VERIFICATION

export async function checkToken (request, response, next) {
  const authorization = request.get('authorization')

  console.log('1')

  // if (!authorization || !authorization.toLowerCase().startsWith('bearer')) {
  if (!authorization || !authorization.toLowerCase().startsWith('bearer') || !authorization.split(' ')[1]) {
    console.log('2')

    request[SKIP_VERIFICATION] = true // Establece una bandera con Symbol para saltar verificación

    return next()
  }

  next()
}

// middleware
export async function verifyToken (request, response, next) {
  console.log('3')

  // verificamos esta parte por la ruta de articles
  if (request[SKIP_VERIFICATION]) {
    console.log('salto')

    return next()
  }
  // verificamos esta parte por la ruta de articles

  const authorization = request.get('authorization')
  console.log(authorization)

  if (!authorization || !authorization.toLowerCase().startsWith('bearer')) {
    return response.status(401).json({ statusCode: 401, message: 'Token no encontrado' })
  }
  const token = request.headers.authorization?.split(' ')[1]
  try {
    const decodedToken = jwt.verify(token, secretKey)
    const { user } = decodedToken
    const result = await UserModel.searchByUsername({ username: user })
    const { rol, id_usuario: idUser } = result[0]
    console.log(rol, idUser)
    request.typeUser = rol
    request.idUser = idUser
    // console.log(decodedToken)
    next()
  } catch (error) {
    // console.log('error in token')
    // console.log(error)
    next(error)
  }
}
