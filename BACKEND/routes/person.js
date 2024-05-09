import { Router } from 'express'
import PersonController from '../controllers/person.js'
import { verifyToken } from '../middlewares/authJWT.js'

const routerPerson = Router()

routerPerson.use(verifyToken)

// routerPerson.get('/', verifyToken, PersonController.getAll)
routerPerson.get('/', PersonController.getAll)
routerPerson.get('/:ci', PersonController.getById)
routerPerson.post('/', PersonController.create)
routerPerson.delete('/:ci', PersonController.delete)
routerPerson.patch('/:ci', PersonController.update)

export { routerPerson }
