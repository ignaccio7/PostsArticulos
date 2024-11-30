import PersonModel from '../models/person.js'
import { validatePartialPerson, validatePerson } from '../schemas/person.js'
import { deleteImage, uploadImage } from '../utils/utils.js'

export default class PersonController {
  // Para obtener todos los resultados
  static async getAll (request, response) {
    try {
      const results = await PersonModel.getAll()
      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: results
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al solicitar datos en el gestor de Base de datos'
      })
    }
  }

  // Para obtener un resultado determinado por el ci
  static async getById (request, response) {
    try {
      const { ci } = request.params
      const result = await PersonModel.getById({ ci })

      if (result.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: `No se encontro a la persona con el ci ${ci}`
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: result
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al obtener la persona'
      })
    }
  }

  // Para obtener un resultado determinado por el ci
  static async getByUsername (request, response) {
    try {
      const { user } = request.params
      const result = await PersonModel.getByUsername({ username: user })

      if (result.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: `No se encontro a la persona con el user ${user}`
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: result
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al obtener la persona'
      })
    }
  }

  // Para crear una nueva persona
  /* static async create (request, response) {
    const body = request.body
    const result = validatePerson({ person: body })

    if (result.error) {
      return response.status(422).json({
        statusCode: 422,
        message: result
      })
    }

    try {
      const newPerson = await PersonModel.createPerson({ person: result.data })
      response.status(201).json({
        statusCode: 201,
        message: 'Persona creada',
        data: newPerson
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al crear la persona'
      })
    }
  } */

  // Para crear una nueva persona - CON FORMDATA
  static async create (request, response) {
    const body = request.body
    const file = request.file
    const person = { ...body, ci: Number(body?.ci) }
    if (file) {
      person.avatar = file
    }

    const result = validatePerson({ person })

    if (result.error) {
      return response.status(422).json({
        statusCode: 422,
        message: result
      })
    }

    try {
      if (file) {
        const { avatar, avatarId } = await uploadImage({ file })
        result.data.avatar = avatar || ''
        result.data.avatarId = avatarId || ''
      } else {
        result.data.avatar = ''
        result.data.avatarId = ''
      }

      const newPerson = await PersonModel.createPerson({ person: result.data })
      response.status(201).json({
        statusCode: 201,
        message: 'Persona creada',
        data: newPerson
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        error: error.message,
        message: 'Fallo al crear la persona'
      })
    }
  }

  // Para eliminar una persona
  static async delete (request, response) {
    try {
      const { ci } = request.params
      const result = await PersonModel.deletePerson({ ci })
      if (result === false) {
        response.json({
          statusCode: 404,
          message: 'Nose ha encontrado a la persona'
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Persona eliminada'
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al eliminar la persona'
      })
    }
  }

  // Para modificar una persona
  /* static async update (request, response) {
    try {
      const partialPerson = request.body
      console.log(partialPerson)
      const result = validatePartialPerson({ person: partialPerson })
      console.log(result)
      if (result.error) {
        return response.status(422).json({
          statusCode: 422,
          message: result
        })
      }
      const { ci } = request.params
      console.log('el ci...................................' + ci)
      const newPerson = await PersonModel.updatePerson({ ci, partialPerson })
      console.log(newPerson)

      if (newPerson === false) {
        return response.json({
          statusCode: 404,
          message: 'Nose ha encontrado a la persona'
        })
      }

      response.json({
        statusCode: 200,
        message: 'Persona modificada',
        data: newPerson[0]
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al modificar la persona'
      })
    }
  }
  */

  // Para modificar una persona - CON FORMDATA
  static async update (request, response) {
    try {
      const body = request.body
      const file = request.file
      const partialPerson = { ...body }
      console.log(file)
      if (file) {
        partialPerson.avatar = file
      }
      if (body?.ci) {
        partialPerson.ci = Number(body.ci)
      }

      console.log(partialPerson)

      const result = validatePartialPerson({ person: partialPerson })
      if (result.error) {
        return response.status(422).json({
          statusCode: 422,
          message: result
        })
      }

      console.log(result)

      const { ci } = request.params

      // para eliminar la imagen si modificara
      const searchIdAvatar = await PersonModel.searchIdAvatar({ ci })
      if (searchIdAvatar.length !== 0 && searchIdAvatar[0]?.avatar_id && file) {
        // console.log('El file es:' + file)
        // console.log('public id:' + searchIdAvatar[0].avatar_id)
        await deleteImage({ publicId: searchIdAvatar[0].avatar_id })
      }

      // para subir la imagen nueva si existiera
      console.log(file)
      if (file) {
        const { avatar, avatarId } = await uploadImage({ file })
        result.data.avatar = avatar || ''
        result.data.avatar_id = avatarId || ''
      }

      console.log(result)
      const newPerson = await PersonModel.updatePerson({ ci, partialPerson: result.data })

      if (newPerson === false) {
        return response.json({
          statusCode: 404,
          message: 'Nose ha encontrado a la persona'
        })
      }

      if (newPerson[0]?.avatar_id) {
        delete newPerson[0].avatar_id
      }

      response.json({
        statusCode: 200,
        message: 'Persona modificada',
        data: newPerson[0]
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al modificar la persona'
      })
    }
  }

  static async deleteImageProfile (request, response) {
    try {
      console.log('esta eliminando la imagen')

      const { ci } = request.params
      const searchIdAvatar = await PersonModel.searchIdAvatar({ ci })

      let data = false

      if (searchIdAvatar.length !== 0 && searchIdAvatar[0]?.avatar_id) {
        data = await deleteImage({ publicId: searchIdAvatar[0].avatar_id })
      }

      if (data) {
        await PersonModel.updatePerson({ ci, partialPerson: { avatar: '', avatar_id: '' } })

        response.status(200).json({
          statusCode: 200,
          message: 'Imagen eliminada correctamente'
        })
      } else {
        response.status(404).json({
          statusCode: 404,
          message: 'No se ha encontrado la imagen'
        })
      }
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al eliminar la imagen'
      })
    }
  }

  /* Solo era una prueba para verificar la eliminacion de la imagen
  static async searchIdImage (request, response) {
    try {
      const { ci } = request.params
      const result = await PersonModel.searchIdAvatar({ ci })
      console.log(result)
      console.log(result.avatar_id)
      if (result.length === 0 || !result[0]?.avatar_id) {
        response.status(404).json({
          statusCode: 404,
          message: `No sea encontro al idimage de la persona con el ci ${ci}`
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: result
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al obtener la persona'
      })
    }
  } */
}
