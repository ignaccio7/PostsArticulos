import { Router } from 'express'
import ArticleController from '../controllers/article.js'
import { checkToken, verifyToken } from '../middlewares/authJWT.js'
import { verifyIsAdmin } from '../middlewares/verifyUser.js'

const routerArticle = Router()

routerArticle.get('/', checkToken, verifyToken, ArticleController.getAll)
routerArticle.get('/:id', checkToken, verifyToken, ArticleController.getById)
// validar por token
routerArticle.post('/like', verifyToken, ArticleController.toggleLike)
routerArticle.get('/comment/:id', verifyToken, ArticleController.getComments)
routerArticle.post('/comment', verifyToken, ArticleController.addComment)
routerArticle.delete('/comment/:id', verifyToken, ArticleController.deleteComment)
// validar por usuario admin
// routerArticle.post('/', verifyToken, verifyIsAdmin, ArticleController.approveNote)
routerArticle.post('/', verifyToken, verifyIsAdmin, ArticleController.approveMultipleNotes)

export { routerArticle }
