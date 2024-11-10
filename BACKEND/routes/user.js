import { Router } from 'express'
// import { validateUser } from '../schemas/user.js'
import UserController from '../controllers/user.js'
import { verifyToken } from '../middlewares/authJWT.js'
import { verifyIsAdmin } from '../middlewares/verifyUser.js'
import { upload } from '../middlewares/uploadImage.js'

const routerUser = Router()

routerUser.get('/', verifyToken, verifyIsAdmin, UserController.getAll)
// routerUser.post('/', UserController.signup)
routerUser.patch('/:ci', verifyToken, UserController.update)

routerUser.post('/', upload.single('avatar'), UserController.signup)
routerUser.get('/:ci', UserController.search)
routerUser.post('/login', UserController.signin)
// routerUser.post('/', (request, response) => {
//   const body = request.body
//   const result = validateUser({ user: body })
//   console.log(body)
//   response.json(result)
// })

export { routerUser }
