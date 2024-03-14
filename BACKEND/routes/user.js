import { Router } from 'express'
// import { validateUser } from '../schemas/user.js'
import UserController from '../controllers/user.js'

const routerUser = Router()

routerUser.get('/', UserController.getAll)
routerUser.post('/', UserController.signup)
routerUser.post('/login', UserController.signin)
// routerUser.post('/', (request, response) => {
//   const body = request.body
//   const result = validateUser({ user: body })
//   console.log(body)
//   response.json(result)
// })

export { routerUser }
