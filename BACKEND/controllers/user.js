import bcrypt from 'bcrypt'
import config from '../config.js'
import { generateAccessToken, generateRefreshToken } from '../middlewares/authJWT.js'
import TokenModel from '../models/token.js'
import UserModel from '../models/user.js'
import { validatePerson } from '../schemas/person.js'
import { validatePartialUser, validateUser } from '../schemas/user.js'
import { deleteLocalImage, uploadImage } from '../utils/utils.js'

const { refresh_token_expiration } = config

// TODO en esta tabla falta añadir el rol al momento de registrar y/o modificar

export default class UserController {
  // static async getAll(request, response) {
  static async getAll(_, response) {
    try {
      const results = await UserModel.getAll()
      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: results,
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        statusCode: 500,
        message: 'Fallo al solicitar datos a la tabla user',
      })
    }
  }

  /*
  * Register user whitout image
  static async signup (request, response) {
    const body = request.body
    console.log(body)
    const { person, user } = body
    const resultPerson = validatePerson({ person })
    const resultUser = validateUser({ user })

    if (resultUser.error || resultPerson.error) {
      return response.status(422).json({
        statusCode: 422,
        message: {
          User: resultUser.error,
          Person: resultPerson.error
        }
      })
    }
    try {
      const newUser = await UserModel.createUserPerson({ person, user })

      // aqui generaremos el token
      const token = generateToken({ user: user.usuario })

      response.status(201).json({
        statusCode: 201,
        message: 'Usuario creada',
        data: newUser,
        token
      })
      // response.status(201).json({
      //   statusCode: 201,
      //   message: 'Usuario creada',
      //   data: newUser
      // })
    } catch (error) {
      console.log('errorController', error)
      // response.json({
      //   statusCode: 500,
      //   message: 'Fallo al crear la persona y usuario'
      // })
      response.json({
        statusCode: error.status,
        message: error.message
      })
    }

    // console.log(body)
    // await UserModel.createUserPerson({})
    // response.send('abc')
  }
  */
  // Register user with Image
  static async signup(request, response) {
    // const { ci, nombres, paterno, materno, telefono, correo, usuario, pass, rol } = request.body
    const body = request.body
    const file = request.file
    console.log(body)

    const user = { usuario: body.usuario, pass: body.password }
    const person = { ...body, ci: Number(body?.ci), avatar: { ...file } }

    console.log({ person })
    console.log({ user })

    const resultPerson = validatePerson({ person })
    const resultUser = validateUser({ user })

    // console.log({ resultPerson })
    // console.log({ resultUser })

    if (resultUser.error || resultPerson.error) {
      let errorMessage = resultUser?.error?.issues[0]?.message ?? null
      errorMessage =
        errorMessage ?? resultPerson?.error?.issues[0]?.message ?? 'Error en los campos ingresados'

      console.log({ errorMessage })

      return response.status(422).json({
        statusCode: 422,
        message: errorMessage,
        // {User: resultUser.error,
        // Person: resultPerson.error}
      })
    }
    // TODO: Verificar que si existe errores al subir imagenes nose guarden en LOCAL esto con desarrollo o en produccion veriamos la falla en el peor de los casos XD
    // Probar que el ssitema nose rompa ya que el frontend cambia ya que le estamos enviando el rol del usuario

    const isUserExist = await UserModel.isExistUser({
      ci: resultPerson.data.ci,
      username: resultUser.data.usuario,
    })
    if (isUserExist.length !== 0) {
      if (file) await deleteLocalImage({ file })
      return response.status(409).json({
        statusCode: 409,
        message:
          'Usted ya cuenta con un usuario registrado o El nombre de usuario ya esta ocupado.',
      })
    }

    try {
      if (file) {
        const { avatar, avatarId } = await uploadImage({ file })
        resultPerson.data.avatar = avatar || ''
        resultPerson.data.avatarId = avatarId || ''
      } else {
        resultPerson.data.avatar = ''
        resultPerson.data.avatarId = ''
      }

      const hash = await bcrypt.hash(resultUser.data.pass, 10)
      resultUser.data.pass = hash

      const newUser = await UserModel.createUserPerson({
        person: resultPerson.data,
        user: resultUser.data,
      })
      delete newUser?.person?.avatarId

      // aqui generaremos el token
      // const token = await generateToken({ user: user.usuario })
      const accessToken = await generateAccessToken({ user: user.usuario })
      const refreshToken = await generateRefreshToken({ user: user.usuario })
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: refresh_token_expiration,
        path: '/',
        // maxAge: 24 * 60 * 60 * 1000,
      })

      response.status(201).json({
        statusCode: 201,
        message: 'Usuario creada',
        data: {
          newUser,
          rol: 'user',
        },
        token: accessToken,
      })
    } catch (error) {
      console.log('errorController', error)
      const errorStatus = error.status ? error.status : 500
      response.status(errorStatus).json({
        statusCode: errorStatus,
        message: error.message,
      })
    }
  }

  static async signin(request, response) {
    const user = request.body

    const resultUser = validateUser({ user })

    if (resultUser.error) {
      const zodError = resultUser?.error?.issues?.map((e) => e.message)[0] || 'Invalid fields'
      return response.status(422).json({
        statusCode: 422,
        // message: resultUser.error
        message: zodError,
      })
    }
    const { usuario, pass } = user

    console.log('user')
    console.log({ usuario, pass })

    try {
      const validUser = await UserModel.getPassUser({ username: usuario })
      if (validUser.length === 0) {
        return response.status(404).json({
          statusCode: 404,
          message: 'Usuario no encontrado',
        })
      }
      const { pass: passDB, rol, avatar } = validUser[0]
      const isValidPassword = await bcrypt.compare(pass, passDB)
      // const isValidPassword = passDB === pass

      if (!isValidPassword) {
        return response.status(404).json({
          statusCode: 401,
          message: 'Password incorrecto',
        })
      }

      /* Este metodo ya no se necesitaria al validar arriba cada uno por el hash
      const result = await UserModel.verifyUser({ user: usuario, pass })
      if (result.length === 0) {
        return response.status(404).json({
          statusCode: 404,
          message: 'Usuario no encontrado'
          // message: 'Usuario o contrasenia incorrectos'
        })
      } */
      // aqui generaremos el token
      // estamos guardando en la tabla de refresh token el userid como el username pero quiza se podria hacer una consulta para obtener el id_usuario pero por el momento no
      const accessToken = await generateAccessToken({ user: user.usuario })
      const refreshToken = await generateRefreshToken({ user: user.usuario })

      console.log({ accessToken, refreshToken })

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: refresh_token_expiration,
        path: '/',
        domain: 'localhost',
        sameSite: 'none',
        // maxAge: 24 * 60 * 60 * 1000,
      })

      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: {
          usuario,
          rol,
          avatar,
        },
        token: accessToken,
      })
    } catch (error) {
      console.log(error)
      return response.json({
        statusCode: 500,
        message: 'Fallo al intentar logearse',
      })
    }
  }

  static async signout(request, response) {
    try {
      const { idUser, jti } = request
      const result = await TokenModel.deleteRefreshToken({ jti, userId: idUser })
      if (result === false) {
        return response.status(404).json({
          statusCode: 404,
          message: 'No se encontro el token para el usuario',
        })
      }

      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })

      response.status(200).json({
        statusCode: 200,
        message: 'Sesion cerrada',
      })
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: error.message,
      })
    }
  }

  static async search(request, response) {
    try {
      const { ci } = request.params
      const result = await UserModel.search({ ci })

      if (result.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: `No se encontro al usuario con el ci ${ci}`,
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: result,
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al obtener al usuario',
      })
    }
  }

  // TODO: modificar este endpoint solo el usuario con su mismo id puede modificar su misma contraseña
  static async update(request, response) {
    try {
      const user = request.body

      const resultUser = validatePartialUser({ user })

      if (resultUser.error) {
        const zodError = resultUser?.error?.issues?.map((e) => e.message)[0] || 'Invalid fields'
        return response.status(422).json({
          statusCode: 422,
          message: zodError,
        })
      }
      const { usuario, pass } = user
      const { ci } = request.params

      const [newUser] = await UserModel.update({ ci, usuario, pass })

      if (newUser === false) {
        return response.json({
          statusCode: 404,
          message: 'Nose ha encontrado al usuario',
        })
      }

      response.json({
        statusCode: 200,
        message: 'Usuario modificada',
        data: newUser,
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al intentar modificar el usuario',
      })
    }
  }

  // refresh token
  static async refresh(request, response) {
    console.log('VINO AL REFERSH')
    const { refreshToken } = request.cookies
    const { idUser } = request
    try {
      console.log(refreshToken)
      const accessToken = await generateAccessToken({ user: idUser })
      console.log('new AccessToken', accessToken)
      return response.status(200).json({
        statusCode: 200,
        message: 'Token actualizado',
        data: accessToken,
      })
    } catch (error) {
      console.log('Error en el refresh token controller')
      console.log(error)
    }
  }
}
