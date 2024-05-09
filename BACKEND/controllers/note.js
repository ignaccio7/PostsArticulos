import NoteModel from '../models/note.js'
import { validateNote, validatePartialNote } from '../schemas/note.js'

export default class NoteController {
  // Para obtener todos los resultados
  static async getAll (request, response) {
    try {
      const { titulo, tema, init, end, page } = request.query
      const results = await NoteModel.getAll({ filters: { titulo, tema }, fechaPost: { init, end }, page })

      if (results.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: 'No existen registros'
        })
        return
      }

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

  // Para crear una nueva nota
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
      const newNote = await NoteModel.createNote({ note: result.data })
      response.status(201).json({
        statusCode: 201,
        message: 'Nota creada',
        data: newNote
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al crear la nota'
      })
    }
  }

  // Para eliminar una nota
  static async delete (request, response) {
    try {
      const { id } = request.params
      const result = await NoteModel.deleteNote({ id })
      if (result === false) {
        response.json({
          statusCode: 404,
          message: 'Nose ha encontrado la nota'
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Nota eliminada'
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al eliminar la nota'
      })
    }
  }

  // Para modificar una nota
  static async update (request, response) {
    try {
      const partialNote = request.body
      console.log(partialNote)
      const result = validatePartialNote({ note: partialNote })
      console.log(result)
      if (result.error) {
        return response.status(422).json({
          statusCode: 422,
          message: result
        })
      }
      const { id } = request.params
      console.log('el id...................................' + id)
      const newNote = await NoteModel.updateNote({ id, partialNote })
      console.log(newNote)

      if (newNote === false) {
        return response.json({
          statusCode: 404,
          message: 'Nose ha encontrado la nota'
        })
      }

      response.json({
        statusCode: 200,
        message: 'Nota modificada',
        data: newNote[0]
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al modificar la nota'
      })
    }
  }
}
