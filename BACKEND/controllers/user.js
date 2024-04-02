import { generateToken } from '../middlewares/authJWT.js'
import UserModel from '../models/user.js'
import { validatePerson } from '../schemas/person.js'
import { validateUser } from '../schemas/user.js'

export default class UserController {
  static async getAll (request, response) {
    try {
      const results = await UserModel.getAll()
      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: results
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        statusCode: 500,
        message: 'Fallo al solicitar datos a la tabla user'
      })
    }
  }

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

  static async signin (request, response) {
    const user = request.body

    const resultUser = validateUser({ user })

    if (resultUser.error) {
      return response.status(422).json({
        statusCode: 422,
        message: resultUser.error
      })
    }
    const { usuario, pass } = user
    try {
      const result = await UserModel.verifyUser({ user: usuario, pass })
      if (result.length === 0) {
        return response.status(404).json({
          statusCode: 404,
          message: 'Usuario o contrasenia incorrectos'
        })
      }
      // aqui generaremos el token
      const token = generateToken({ user: usuario })
      response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: result,
        token
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al intentar logearse'
      })
    }
  }
}
