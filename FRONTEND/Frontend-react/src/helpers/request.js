import { BASE_URL } from '../utils/config'

class RequestService {
  static async getRequest (url = '', requestOptions = {}) {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'GET',
        headers: {
          ...requestOptions
        }
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw errorMessage
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.log('errro')

      console.log(error)
      throw error
      // throw new Error('Error al comunicarse con el servidor')
    }
  }

  static async postRequestJSON ({ url = '', requestOptions = {}, body }) {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw errorMessage
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw error
      // throw new Error('Error al comunicarse con el servidor')
    }
  }

  static async postRequestFormData ({ url = '', requestOptions = {}, body }) {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'POST',
        headers: {
          ...requestOptions
        },
        body
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw errorMessage
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw error
      // throw new Error('Error al comunicarse con el servidor')
    }
  }

  static async patchRequestFormData ({ url = '', requestOptions = {}, body }) {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'PATCH',
        headers: {
          ...requestOptions
        },
        body
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(errorMessage?.message || 'Error al enviar datos al servidor')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw error
      // throw new Error('Error al comunicarse con el servidor')
    }
  }

  static async deleteRequest ({ url = '', requestOptions = {} }) {
    try {
      console.log('a')

      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'DELETE',
        headers: {
          ...requestOptions
        }
      })
      console.log('b')

      if (!response.ok) {
        console.log('c')
        const errorMessage = await response.json()
        throw errorMessage
      }
      console.log('d')

      const data = await response.json()
      console.log(data)

      return data
    } catch (error) {
      console.log(error)
      throw error
      // throw new Error('Error al comunicarse con el servidor')
    }
  }
}

export default RequestService
