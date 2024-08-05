import { BASE_URL } from '../utils/config'

class RequestService {
  static async getRequest (url = '', requestOptions = '') {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'GET',
        requestOptions
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error('Error al solicitar datos al servidor')
    }
  }

  static async postRequestJSON ({ url = '', requestOptions = '', body }) {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        headers: requestOptions,
        body: JSON.stringify(body)
      })
      const data = await response.json()
      return data
    } catch (error) {
      // console.log(error)
      throw new Error('Error al enviar datos al servidor')
    }
  }

  static async postRequestFormData ({ url = '', requestOptions = '', body }) {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        headers: requestOptions,
        body: JSON.stringify(body)
      })
      const data = await response.json()
      return data
    } catch (error) {
      // console.log(error)
      throw new Error('Error al enviar datos al servidor')
    }
  }
}

export default RequestService
