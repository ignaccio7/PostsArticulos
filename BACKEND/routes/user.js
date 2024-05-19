import multer from 'multer'
import { Router } from 'express'
// import { validateUser } from '../schemas/user.js'
import UserController from '../controllers/user.js'

const upload = multer({ dest: 'images/' })

const routerUser = Router()

routerUser.get('/', UserController.getAll)
// routerUser.post('/', UserController.signup)
routerUser.post('/', upload.single('avatar'), UserController.signup)
routerUser.post('/login', UserController.signin)
routerUser.get('/:ci', UserController.search)
routerUser.patch('/:ci', UserController.update)
// routerUser.post('/', (request, response) => {
//   const body = request.body
//   const result = validateUser({ user: body })
//   console.log(body)
//   response.json(result)
// })

export { routerUser }
