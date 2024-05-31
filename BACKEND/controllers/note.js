import NoteModel from '../models/note.js'
import { validateNote, validatePartialNote } from '../schemas/note.js'
import { deleteImage, uploadImage } from '../utils/utils.js'

export default class NoteController {
  // Para obtener todos los resultados
  static async getAll (request, response) {
    try {
      const { titulo, tema, init, end, page, perPage = 4 } = request.query
      const results = await NoteModel.getAll({ filters: { titulo, tema }, fechaPost: { init, end }, page })

      const resultTotalPages = await NoteModel.getTotalPages({ filters: { titulo, tema }, fechaPost: { init, end } })
      const totalPages = Math.ceil(resultTotalPages.total_notas / perPage)

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
        data: results,
        perPage,
        totalPages,
        page: page || '1'
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
  /* static async create (request, response) {
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
  } */

  // Para crear una nueva nota - CON FORMDATA
  static async create (request, response) {
    const body = request.body
    const file = request.file
    const { idUser } = request

    console.log(body)
    console.log(file)

    const note = { ...body }
    if (file) {
      note.imagenes = file
    }

    const result = validateNote({ note })

    if (result.error) {
      return response.status(422).json({
        statusCode: 422,
        message: result
      })
    }

    if (file) {
      const resImage = await uploadImage({ file })
      console.log(resImage)
      // cambiar esta manera de recibir los parametros ya que podran subir multiples imagenes sera otro metodo
      const { avatar, avatarId } = resImage
      result.data.imagenes = avatar || ''
      result.data.imageId = avatarId || ''
    } else {
      result.data.imagenes = ''
      result.data.imageId = ''
    }

    result.data.usuario_id_usuario = Number(idUser)

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
  /* static async update (request, response) {
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
  } */

  // Para modificar una nota - CON FORMDATA
  static async update (request, response) {
    try {
      const body = request.body
      const file = request.file
      const { idUser } = request

      const partialNote = { ...body }
      if (file) {
        partialNote.imagenes = file
      }
      if (body?.usuario_id_usuario) {
        partialNote.usuario_id_usuario = Number(body.usuario_id_usuario)
      }

      console.log(partialNote)
      const result = validatePartialNote({ note: partialNote })
      if (result.error) {
        return response.status(422).json({
          statusCode: 422,
          message: result
        })
      }
      const { id } = request.params
      result.data.usuario_id_usuario = Number(idUser)

      // para eliminar la imagen si modificara
      const searchIdImage = await NoteModel.searchIdImage({ idNota: id })
      if (searchIdImage.length !== 0 && searchIdImage[0]?.imagen_id && file) {
        await deleteImage({ publicId: searchIdImage[0].imagen_id })
      }

      // para subir la imagen nueva si existiera
      if (file) {
        const { avatar, avatarId } = await uploadImage({ file })
        result.data.imagenes = avatar || ''
        result.data.imagen_id = avatarId || ''
      }

      const newNote = await NoteModel.updateNote({ id, partialNote: result.data })
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
