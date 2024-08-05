import RequestService from '../helpers/request'
// import { sleep } from '../utils/utils'
// import { notas } from '../mocks/results.json'

export default class Article {
  static async getAll () {
    // const articles = [...notas]
    // await sleep(3)
    let articles = []
    try {
      // Forzar un error aquí
      // throw new Error('Forced error for testing purposes')
      const res = await RequestService.getRequest('article')
      articles = res.data
    } catch (error) {
      throw {
        status: error.status,
        message: error.message || 'An error occurred'
      }
    }

    const mappedArticles = articles.map(article => ({
      id: article.id_nota,
      title: article.titulo,
      description: article.descripcion,
      image: article.imagenes,
      link: article.imagen_id
    }))

    return mappedArticles
  }
}
