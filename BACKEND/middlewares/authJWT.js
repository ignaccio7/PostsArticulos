import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import TokenModel from '../models/token.js'
import UserModel from '../models/user.js'

const { access_token_expiration, refresh_token_expiration, secretKey } = config
console.log('---------------------------------')
console.log({ access_token_expiration, refresh_token_expiration, secretKey })

export async function generateAccessToken({ user }) {
  // console.log('user-access-token', user)

  // const accessToken = jwt.sign({ user }, secretKey, { expiresIn: '2m' })
  const accessToken = jwt.sign({ user }, secretKey, { expiresIn: access_token_expiration })
  // console.log({
  //   accessToken,
  // })

  // const accessToken = jwt.sign({ user }, secretKey, { expiresIn: Date.now() + 60 * 15 })
  return accessToken
}

export async function generateRefreshToken({ user }) {
  console.log('user-refresh-token', user)
  const jti = crypto.randomUUID()
  // const expiresAt = Date.now() + 60 * 60 * 24 * 7
  // const refreshToken = jwt.sign(
  //   {
  //     user,
  //     jti,
  //   },
  //   secretKey,
  //   { expiresIn: expiresAt }
  // )
  // console.log('1')

  const refreshToken = jwt.sign({ user, jti }, secretKey, {
    // expiresIn: '1h',
    expiresIn: refresh_token_expiration,
    // expiresIn: '7d',
  })
  // console.log('2')

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
  // const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  // const expiresAt = new Date(Date.now() + 1000 * 60 * 5)
  const expiresAt = new Date(Date.now() + Number.parseInt(refresh_token_expiration))
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')

  // console.log('3')
  await TokenModel.saveRefreshToken({
    userId: user,
    tokenId: jti,
    tokenHash,
    expiresAt,
  })
  console.log('4')
  return refreshToken
}

// esta validacion sera para la ruta de articles donde puede o no tener un UserId
const SKIP_VERIFICATION = Symbol('skipVerification') // TODO eliminar el symbol for y trabajar solo con la referencia SKIP_VERIFICATION

// export async function checkToken(request, response, next) {
export async function checkToken(request, _, next) {
  const authorization = request.get('authorization')

  console.log('1')

  // if (!authorization || !authorization.toLowerCase().startsWith('bearer')) {
  if (
    !authorization ||
    !authorization.toLowerCase().startsWith('bearer') ||
    !authorization.split(' ')[1]
  ) {
    console.log('2')

    request[SKIP_VERIFICATION] = true // Establece una bandera con Symbol para saltar verificación

    return next()
  }

  next()
}

// middleware
export async function verifyToken(request, response, next) {
  console.log('3')

  // verificamos esta parte por la ruta de articles
  if (request[SKIP_VERIFICATION]) {
    // console.log('salto')

    return next()
  }
  // verificamos esta parte por la ruta de articles

  const authorization = request.get('authorization')
  console.log('autorization', authorization)

  if (!authorization || !authorization.toLowerCase().startsWith('bearer')) {
    return response.status(401).json({ statusCode: 401, message: 'Token no encontrado' })
  }
  const token = request.headers.authorization?.split(' ')[1]
  try {
    console.log('1')
    const decodedToken = jwt.verify(token, secretKey)
    console.log('2')
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

export async function verifyRefreshToken(request, response, next) {
  const cookies = request.cookies
  const { refreshToken } = cookies
  console.log('refreshTOken', refreshToken)

  if (!refreshToken)
    return response.status(412).json({
      statusCode: 412,
      message: 'Sesion no iniciada.',
      // message: 'Refresh token no encontrado',
    })

  try {
    console.log('111111111')

    const decodedToken = jwt.verify(refreshToken, secretKey)
    console.log('22222')
    console.log('decodedToken', decodedToken)

    const [storedToken] = await TokenModel.findRefreshToken({ jti: decodedToken.jti })
    console.log('storedToken', storedToken)

    const receivedHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    console.log('receivedHash', receivedHash)

    if (receivedHash !== storedToken.token_hash) {
      return response.status(412).json({
        statusCode: 412,
        message: 'Token invalido',
      })
    }
    request.idUser = decodedToken.user
    request.jti = decodedToken.jti
    next()
  } catch (error) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    console.log(error)
    response.status(412).json({
      statusCode: 412,
      message: error.message || 'Incapaz de validar la sesion',
    })
  }
}
