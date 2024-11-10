import { Router } from 'express'
import PersonController from '../controllers/person.js'
import { verifyToken } from '../middlewares/authJWT.js'
import { verifyIsAdmin } from '../middlewares/verifyUser.js'
import { upload } from '../middlewares/uploadImage.js'

const routerPerson = Router()

routerPerson.use(verifyToken)

// routerPerson.get('/', verifyToken, PersonController.getAll)

// cambiar esta mrd
// routerPerson.get('/', verifyIsAdmin, PersonController.getAll)
routerPerson.get('/', verifyIsAdmin, PersonController.getAll)

routerPerson.get('/:ci', verifyIsAdmin, PersonController.getById)
// routerPerson.post('/', PersonController.create)
// routerPerson.post('/', upload.single('avatar'), PersonController.create) <- el post solo se realizara al momento de registrarse el usuario
// routerPerson.delete('/:ci', PersonController.delete) <- TODO agregar esta funcionalidad en una modificacion con el usuario
// routerPerson.patch('/:ci', PersonController.update)
routerPerson.patch('/:ci', upload.single('avatar'), PersonController.update)
// routerPerson.get('/search/:ci', PersonController.searchIdImage)
routerPerson.get('/search/:user', PersonController.getByUsername)
routerPerson.delete('/image/:ci', PersonController.deleteImageProfile)

export { routerPerson }
