import RequestService from '../helpers/request'
import { sleep } from '../utils/utils'
// import { notas } from '../mocks/results.json'

export default class Article {
  static async getAll ({ accessToken = '', query = '' }) {
    // const articles = [...notas]
    // await sleep(1)
    let articles = []
    let res = {}
    try {
      // Forzar un error aquí
      // throw new Error('Forced error for testing purposes')

      const requestOptions = {
        Authorization: `Bearer ${accessToken}`
      }
      console.log('1')
      
      res = await RequestService.getRequest(`article?${query}`, requestOptions)
      console.log('2')
      // console.log('res', res)

      articles = res.data
    } catch (error) {
      throw {
        status: error.status,
        message: error.message || 'An error occurred'
      }
    }

    const mappedArticles = articles.map(article => ({
      // id: article.id_nota,
      // title: article.titulo,
      // description: article.descripcion,
      // image: article.imagenes,
      // link: article.imagen_id
      // id: article.id_publicacion,
      id: article.id_publicacion,
      title: article.titulo,
      description: article.descripcion,
      image: article.url_image,
      link: article.id_nota,
      author: article.usuario,
      likes: article.likes,
      comments: article.comments,
      islike: article.islike,
      fechapub: article.fechapub
    }))

    return {
      ...res,
      data: mappedArticles
    }
  }

  static async getNotesForApprove ({ accessToken = '', query = '' }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const notes = await RequestService.getRequest(`note?${query}`, requestOptions)
      return notes
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al intentar obtener notas',
        success: false
      }
    }
  }

  static async approveNotes ({ accessToken = '', idNotes = [] }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const result = await RequestService.postRequestJSON({ url: 'article', requestOptions, body: { idNotes } })
      return result
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al intentar aprobar las notas',
        success: false
      }
    }
  }

  static async disapproveNotes ({ accessToken = '', idNotes = [] }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const result = await RequestService.postRequestJSON({ url: 'article/disapprove', requestOptions, body: { idNotes } })
      return result
    } catch (error) {
      throw {
        staus: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al eliminar las notas',
        success: false
      }
    }
  }

  static async toggleLike ({ accessToken = '', idPub }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const result = await RequestService.postRequestJSON({ url: 'article/like', requestOptions, body: { idPub } })
      return result
    } catch (error) {
      throw {
        staus: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al eliminar las notas',
        success: false
      }
    }
  }

  static async getComments ({ accessToken = '', idNote }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const result = await RequestService.getRequest(`article/comment/${idNote}`, requestOptions)
      return result
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al obtener los comentarios',
        success: false
      }
    }
  }

  static async addComment ({ accessToken = '', idNote, comment = '' }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const result = await RequestService.postRequestJSON({ url: 'article/comment', requestOptions, body: { idPub: idNote, comment } })
      return result
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al agregar la nota',
        success: false
      }
    }
  }

  static async deleteComment ({ accessToken = '', idComment }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const result = await RequestService.deleteRequest({ url: `article/comment/${idComment}`, requestOptions })
      return result
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al agregar la nota',
        success: false
      }
    }
  }
}
