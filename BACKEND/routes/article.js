import { Router } from 'express'
import ArticleController from '../controllers/article.js'
import { verifyToken } from '../middlewares/authJWT.js'

const routerArticle = Router()

routerArticle.get('/', ArticleController.getAll)
routerArticle.get('/:id', ArticleController.getById)
// validar por token
routerArticle.post('/like', verifyToken, ArticleController.toggleLike)
routerArticle.get('/comment/:id', verifyToken, ArticleController.getComments)
routerArticle.post('/comment', verifyToken, ArticleController.addComment)
routerArticle.delete('/comment/:id', verifyToken, ArticleController.deleteComment)
// validar por usuario admin
routerArticle.post('/', verifyToken, ArticleController.approveNote)

export { routerArticle }
