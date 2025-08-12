import { Router } from 'express'
// import { validateUser } from '../schemas/user.js'
import UserController from '../controllers/user.js'
import { verifyRefreshToken, verifyToken } from '../middlewares/authJWT.js'
// import { upload } from '../middlewares/uploadImage.js'
import { verifyIsAdmin } from '../middlewares/verifyUser.js'

const routerUser = Router()

routerUser.get('/', verifyToken, verifyIsAdmin, UserController.getAll)
// routerUser.post('/', UserController.signup)
routerUser.patch('/:ci', verifyToken, UserController.update)

// routerUser.post('/', upload.single('avatar'), UserController.signup) TODO: activamos esto cuando tengamos el backend modificado con restricciones por usuario
routerUser.get('/refresh', verifyRefreshToken, UserController.refresh)
routerUser.get('/logout', verifyRefreshToken, UserController.signout)
routerUser.get('/:ci', UserController.search)
routerUser.post('/login', UserController.signin)
// routerUser.post('/', (request, response) => {
//   const body = request.body
//   const result = validateUser({ user: body })
//   console.log(body)
//   response.json(result)
// })

export { routerUser }
