import { Router } from 'express'
// import { verifyIsAdmin } from '../middlewares/verifyUser.js'
import NoteController from '../controllers/note.js'
import { verifyToken } from '../middlewares/authJWT.js'
import { upload } from '../middlewares/uploadImage.js'

const routerNote = Router()

routerNote.use(verifyToken)
// routerNote.use(verifyIsAdmin)

routerNote.get('/', NoteController.getAll)
routerNote.get('/me', NoteController.getNotesByUser)
routerNote.get('/:id', NoteController.getById)
// routerNote.post('/', verifyIsAdmin, upload.single('imagenes'), NoteController.create)
// routerNote.patch('/:id', verifyIsAdmin, upload.single('imagenes'), NoteController.update)
// routerNote.delete('/:id', verifyIsAdmin, NoteController.delete)
routerNote.post('/', upload.array('imagenes', 5), NoteController.create)
routerNote.patch('/:id', upload.array('imagenes', 5), NoteController.update)
routerNote.delete('/:id', NoteController.delete)

export { routerNote }
