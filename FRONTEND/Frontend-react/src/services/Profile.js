import RequestService from '../helpers/request'

class ProfileService {
  static async getProfileByUsername ({ username, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const res = await RequestService.getRequest(`person/search/${username}`, requestOptions)
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar obtener perfil',
        success: false
      }
    }
  }

  static async updateProfile ({ ci, formData, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const res = await RequestService.patchRequestFormData({ url: `person/${ci}`, requestOptions, body: formData })
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar obtener perfil',
        success: false
      }
    }
  }

  static async deleteImageProfile ({ ci, accessToken }) {
    const requestOptions = {
      Authorization: `Bearer ${accessToken}`
    }
    try {
      const res = await RequestService.deleteRequest(`person/image/${ci}`, requestOptions)
      return res
    } catch (error) {
      throw {
        status: error.status ?? 500,
        message: error.message || 'Ocurrio un error al intentar eliminar foto',
        success: false
      }
    }
  }
}

export default ProfileService