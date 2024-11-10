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
      const res = await RequestService.getRequest(`note/me?${query}`, requestOptions)
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar obtener notas',
        success: false
      }
    }
  }

  static async getNoteByUser ({ idNote, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const res = await RequestService.getRequest(`note/${idNote}`, requestOptions)
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
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
      const res = await RequestService.postRequestFormData({ url: 'note', requestOptions, body: formData })
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
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
      const res = await RequestService.patchRequestFormData({ url: `note/${idNote}`, requestOptions, body: formData })
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar actualizar nota',
        success: false
      }
    }
  }

  static async deleteNote ({ idNote, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }

    try {
      const res = await RequestService.deleteRequest({ url: `note/${idNote}`, requestOptions })
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar eliminar nota',
        success: false
      }
    }
  }
}
