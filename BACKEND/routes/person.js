import { Router } from 'express'
import PersonController from '../controllers/person.js'

const routerPerson = Router()

routerPerson.get('/', PersonController.getAll)
routerPerson.get('/:ci', PersonController.getById)
routerPerson.post('/', PersonController.create)
routerPerson.delete('/:ci', PersonController.delete)
routerPerson.patch('/:ci', PersonController.update)

export { routerPerson }
