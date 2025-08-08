import { request, response } from 'express'
import ArticleModel from '../models/article.js'

export default class ArticleController {
  // obtener todos los articulos ya publicados
  static async getAll(req = request, res = response) {
    try {
      const { idUser } = req
      const { titulo, init, end, page, perPage = 11 } = req.query
      const results = await ArticleModel.getAll({
        filters: { titulo },
        fechaPost: { init, end },
        page,
        idUser,
        perPage,
      })

      const resultTotalPages = await ArticleModel.getTotalPages({
        filters: { titulo },
        fechaPost: { init, end },
      })
      console.log('||||||||||||||||||||||||||')
      console.log(resultTotalPages)

      const totalPages = Math.ceil(resultTotalPages[0].total_notas / perPage)

      if (results.length === 0) {
        res.status(404).json({
          statusCode: 404,
          message: 'No existen registros',
        })
        return
      }

      return res.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: results,
        perPage,
        totalPages,
        page: page || '1',
      })
    } catch (error) {
      console.log(error)
      res.json({
        statusCode: 500,
        message: 'Fallo al solicitar datos en el gestor de Base de datos',
      })
    }
  }

  // Para obtener un resultado determinado por el id
  static async getById(request, response) {
    try {
      const { id } = request.params
      const { idUser } = request
      const result = await ArticleModel.getById({ id, idUser })

      if (result.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: 'No se encontro la publicacion',
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
        message: 'Fallo al obtener la publicacion',
      })
    }
  }

  // Para likear una publicacion
  static async toggleLike(request, response) {
    try {
      const { idPub } = request.body
      const { idUser } = request
      await ArticleModel.toggleLike({ idPub, idUser })

      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        statusCode: 500,
        message: 'Fallo al encorazonar la publicacion',
      })
    }
  }

  // Para obtener todos los comentarios de una publicacion
  static async getComments(request, response) {
    try {
      const { id: idPub } = request.params
      const { idUser } = request
      console.log(idUser)
      const results = await ArticleModel.getComments({ idUser, idPub })
      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: results,
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al solicitar datos en el gestor de Base de datos',
      })
    }
  }

  // Para agregar un comentario en una publicacion
  static async addComment(request, response) {
    try {
      const { idPub, comment } = request.body
      const { idUser } = request
      await ArticleModel.addComment({ idPub, idUser, comment })

      return response.json({
        statusCode: 200,
        message: 'Comentario añadido',
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al comentar la publicacion',
      })
    }
  }

  // Para eliminar un comentario en una publicacion
  static async deleteComment(request, response) {
    try {
      const { id } = request.params
      const { idUser } = request

      const remove = await ArticleModel.canIDelete({ id, idUser })
      console.log(remove)
      if (remove.length === 0 || remove.can_i_delete === 0) {
        return response.status(403).json({
          statusCode: 403,
          message: 'Usted no puede eliminar este comentario',
        })
      }

      const result = await ArticleModel.deleteComment({ idComment: id })
      if (result === false) {
        response.json({
          statusCode: 404,
          message: 'Nose ha encontrado al comentario',
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Comentario eliminado',
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al eliminar el Comentario',
      })
    }
  }

  // Para aprobar una nota a publicacion
  static async approveNote(request, response) {
    const { idNote } = request.body
    const { idUser } = request

    try {
      const result = await ArticleModel.approveNote({ idNote, idUser })
      response.status(201).json({
        statusCode: 201,
        message: 'Nota Aprobada',
        success: result,
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al aprobar la nota',
      })
    }
  }

  // Para aprobar multiples notas a publicacion
  static async approveMultipleNotes(request, response) {
    const { idNotes } = request.body
    const { idUser } = request
    console.log('AprobandoNotas')
    console.log(idNotes)
    console.log(request.body)

    try {
      const result = await ArticleModel.approveMultipleNotes({ idNotes, idUser })
      response.status(201).json({
        statusCode: 201,
        message: 'Notas Aprobadas',
        success: result,
      })
    } catch (error) {
      console.log('errorArticleController', error)
      response.json({
        statusCode: error.status ? error.status : 500,
        message: error.message,
      })
    }
  }

  static async disapproveMultipleNotes(request, response) {
    const { idNotes } = request.body
    try {
      const result = await ArticleModel.disapproveMultipleNotes({ idNotes })
      response.status(201).json({
        statusCode: 201,
        message: 'Notas Desaprobadas',
        success: result,
      })
    } catch (error) {
      console.log(error)
      const statusCode = error.status ? error.status : 500
      response.status(statusCode).json({
        statusCode,
        message: error.message,
      })
    }
  }
}
