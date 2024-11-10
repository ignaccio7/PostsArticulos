import RequestService from '../helpers/request'

class User {
  static async signin ({ user, pass }) {
    const payload = {
      usuario: user,
      pass
    }

    try {
      const res = await RequestService.postRequestJSON({
        url: 'user/login',
        body: payload
      })

      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar iniciar sesión',
        success: false
      }
    }
  }

  static async registerUser ({ payload }) {
    try {
      // console.log(payload)

      const res = await RequestService.postRequestFormData({
        url: 'user',
        body: payload
      })

      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar registrar',
        success: false
      }
    }
  }
}

export default User
