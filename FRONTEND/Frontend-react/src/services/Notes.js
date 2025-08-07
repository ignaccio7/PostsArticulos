import RequestService from '../helpers/request'
import { notas } from '../mocks/results.json'

export default class Note {
  static async getPopularNotes () {
    const popularNotes = [...notas]
    const topNotes = popularNotes.splice(0, 10)
    return topNotes
  }

  static async getNotesByUser ({ accessToken, query = '' }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const res = await RequestService.getRequest(
        `note/me?${query}`,
        requestOptions
      )
      return res
    } catch (error) {
      console.log('Error en notess')
      
      throw {
        statusCode: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al intentar obtener notas',
        success: false
      }
    }
  }

  // VER COMO SANITIZAR LOS ERRORES VENIDOS POR ZOD DEL BACKEND Y VALIDAR EN EL FRONT CREATE AND UPDATE NOTE

  static async getNoteByUser ({ idNote, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const res = await RequestService.getRequest(
        `note/${idNote}`,
        requestOptions
      )
      console.log(res)

      return res
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al intentar obtener notas',
        success: false
      }
    }
  }

  static async getNoteForRead ({ idNote, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const res = await RequestService.getRequest(
        `note/read/${idNote}`,
        requestOptions
      )
      console.log(res)

      return {
        note: res.data.note[0],
        popularity: res.data.popularity[0]
      }
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al intentar obtener notas',
        success: false
      }
    }
  }

  static async createNote ({ accessToken, formData }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const res = await RequestService.postRequestFormData({
        url: 'note',
        requestOptions,
        body: formData
      })
      return res
    } catch (error) {
      console.log('Error en createNote')
      console.log(JSON.stringify(error))
      console.log(error.message)

      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al intentar crear nota',
        success: false
      }
    }
  }

  static async updateNote ({ idNote, accessToken, formData }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const res = await RequestService.patchRequestFormData({
        url: `note/${idNote}`,
        requestOptions,
        body: formData
      })
      return res
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message:
          error.message || 'Ocurrio un error al intentar actualizar nota',
        success: false
      }
    }
  }

  static async deleteNote ({ idNote, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const res = await RequestService.deleteRequest({
        url: `note/${idNote}`,
        requestOptions
      })
      console.log('Res en deleteNote')

      console.log(res)

      return res
    } catch (error) {
      throw {
        status: error.statusCode ?? 500,
        message: error.message || 'Ocurrio un error al intentar eliminar nota',
        success: false
      }
    }
  }
}
