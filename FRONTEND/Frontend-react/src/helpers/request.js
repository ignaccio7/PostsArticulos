import { AuthManager } from '../store/auth'
import { SessionManager } from '../store/session'
import { BASE_URL } from '../utils/config'

class RequestService {
  static async refreshAccessToken() {
    const data = await this.handleRequest({
      url: 'user/refresh',
      options: {
        method: 'GET',
      },
    })
    console.log(data)
    SessionManager.setAccessToken(data.data)
  }

  static async handleRequest({ url, options, retry = true, body }) {
    const method = options.method ?? 'GET'
    const methodsWithBody = ['POST', 'PATCH', 'PUT']

    const optionsFetch = {
        ...options,
        credentials: 'include',
    }

    if (methodsWithBody.includes(method) && body) optionsFetch.body = body

    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        ...optionsFetch
      })
      const data = await response.json()

      // Manejamos los errores de respuesta
      if (response.status === 401 && retry) {
        console.log('Token expirado intentando nuevamente')
        await this.refreshAccessToken()

        const newAccessToken = SessionManager.getAccessToken()
        const newHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }
      
        return await this.handleRequest({
            url,
            options: { ...options, headers: newHeaders },
            retry: false,
            body
          })
      }

      if (response.status === 400) {
        throw {
          statusCode: data?.statusCode ?? 500,
          message: data?.message || 'No se encontraron resultados para la consulta'
        }
      } 

      if (response.status === 404) {
        throw {
          statusCode: data?.statusCode ?? 500,
          message: data?.message || 'No se encontró el recurso solicitado'
        }
      } 

      if (response.status === 412) {
        SessionManager.logoutUser()
        AuthManager.logoutAuth()
        throw {
          statusCode: data?.statusCode ?? 500,
          message: data?.message || 'Error al tratar de refrescar la sesión',
        }
      }

      if (!response.ok) {
        throw {
          statusCode: data?.statusCode ?? 500,
          message: data?.message || 'Error al comunicarse con el servidor',
        }
      }

      return data
    } catch (error) {
      throw {
        statusCode: error?.statusCode ?? 500,
        message: error?.message || 'Error al comunicarse con el servidor',
      }
    }
  }

  static async getRequest(url = '', requestOptions = {}) {
    console.log('La request llega de', url)

    const data = await this.handleRequest({
      url,
      options: {
        method: 'GET',
        headers: {
          ...requestOptions,
        },
      },
    })
    console.log('la data es:')
    console.log(data)
    return data
    
  }

  static async postRequestJSON({ url = '', requestOptions = {}, body }) {
    const data = await this.handleRequest({
      url,
      options: {
        method: 'POST',
        headers: {
          ...requestOptions,
          'Content-Type': 'application/json'
        }
      },
      body: JSON.stringify(body)
    })
    return data
    // try {
    //   console.log(body)
      
    //   const response = await fetch(`${BASE_URL}/${url}`, {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       ...requestOptions,
    //     },
    //     body: JSON.stringify(body),
    //   })

    //   if (!response.ok) {
    //     const errorMessage = await response.json()
    //     throw errorMessage
    //   }

    //   const data = await response.json()
    //   return data
    // } catch (error) {
    //   console.log(error)
    //   throw error
    //   // throw new Error('Error al comunicarse con el servidor')
    // }
  }

  static async postRequestFormData({ url = '', requestOptions = {}, body }) {
    for (const [key, value] of body.entries()) {
  console.log(key, value)
}
    const data = await this.handleRequest({
      url,
      options: {
        method: 'POST',
        headers: {
          ...requestOptions,
        }
      },
      body
    })
    return data
    // try {
    //   const response = await fetch(`${BASE_URL}/${url}`, {
    //     method: 'POST',
    //     headers: {
    //       ...requestOptions,
    //     },
    //     body,
    //   })

    //   if (!response.ok) {
    //     const errorMessage = await response.json()
    //     throw errorMessage
    //   }
    //   const data = await response.json()
    //   return data
    // } catch (error) {
    //   console.log(error)
    //   throw error
    //   // throw new Error('Error al comunicarse con el servidor')
    // }
  }

  static async patchRequestFormData({ url = '', requestOptions = {}, body }) {
    try {
      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'PATCH',
        headers: {
          ...requestOptions,
        },
        body,
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(
          errorMessage?.message || 'Error al enviar datos al servidor'
        )
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw error
      // throw new Error('Error al comunicarse con el servidor')
    }
  }

  static async deleteRequest({ url = '', requestOptions = {} }) {
    try {
      console.log('a')

      const response = await fetch(`${BASE_URL}/${url}`, {
        method: 'DELETE',
        headers: {
          ...requestOptions,
        },
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
