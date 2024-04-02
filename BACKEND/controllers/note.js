import NoteModel from '../models/note.js'
import { validateNote, validatePartialNote } from '../schemas/note.js'

export default class NoteController {
  // Para obtener todos los resultados
  static async getAll (request, response) {
    try {
      const results = await NoteModel.getAll()
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

  // Para obtener un resultado determinado por el id
  static async getById (request, response) {
    try {
      const { id } = request.params
      const result = await NoteModel.getById({ id })

      if (result.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: 'No se encontro la nota'
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

  // Para crear una nueva nota AQUI NOS QUEDAMOS
  static async create (request, response) {
    const body = request.body
    const result = validateNote({ note: body })

    if (result.error) {
      return response.status(422).json({
        statusCode: 422,
        message: result
      })
    }

    try {
      const newPerson = await NoteModel.createPerson({ person: result.data })
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
  }

  // Para eliminar una persona
  static async delete (request, response) {
    try {
      const { ci } = request.params
      const result = await NoteModel.deletePerson({ ci })
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
  static async update (request, response) {
    try {
      const partialPerson = request.body
      console.log(partialPerson)
      const result = validatePartialNote({ person: partialPerson })
      console.log(result)
      if (result.error) {
        return response.status(422).json({
          statusCode: 422,
          message: result
        })
      }
      const { ci } = request.params
      console.log('el ci...................................' + ci)
      const [newPerson] = await NoteModel.updatePerson({ ci, partialPerson })
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
        data: newPerson
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al modificar la persona'
      })
    }
  }
}
