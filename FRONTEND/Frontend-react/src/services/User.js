import RequestService from '../helpers/request'

class User {
  static async signin ({ user, pass }) {
    const payload = {
      usuario: user,
      pass
    }
    try {
      const requestOptions = { 'Content-Type': 'application/json' }
      const res = await RequestService.postRequestJSON({
        url: 'user/login',
        requestOptions,
        body: payload
      })
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'An error occurred',
        success: false
      }
    }
  }

  static async registerSchema ({ payload }) {
    // try {
    //   const res = await RequestService.postRequestJSON
    // } catch (error) {

    // }
  }
}

export default User
