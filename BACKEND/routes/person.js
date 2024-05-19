import multer from 'multer'
import { Router } from 'express'
import PersonController from '../controllers/person.js'
// import { verifyToken } from '../middlewares/authJWT.js'

const upload = multer({ dest: 'images/' })

const routerPerson = Router()

// routerPerson.use(verifyToken)

// routerPerson.get('/', verifyToken, PersonController.getAll)
routerPerson.get('/', PersonController.getAll)
routerPerson.get('/:ci', PersonController.getById)
// routerPerson.post('/', PersonController.create)
routerPerson.post('/', upload.single('avatar'), PersonController.create)
routerPerson.delete('/:ci', PersonController.delete)
// routerPerson.patch('/:ci', PersonController.update)
routerPerson.patch('/:ci', upload.single('avatar'), PersonController.update)
// routerPerson.get('/search/:ci', PersonController.searchIdImage)

export { routerPerson }
