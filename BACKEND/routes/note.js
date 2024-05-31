import multer from 'multer'
import { Router } from 'express'
import { verifyIsAdmin } from '../middlewares/verifyUser.js'
import NoteController from '../controllers/note.js'
import { verifyToken } from '../middlewares/authJWT.js'

const upload = multer({ dest: 'images/' })

const routerNote = Router()

routerNote.use(verifyToken)
routerNote.use(verifyIsAdmin)

routerNote.get('/', NoteController.getAll)
routerNote.get('/:id', NoteController.getById)
// routerNote.post('/', verifyIsAdmin, upload.single('imagenes'), NoteController.create)
// routerNote.patch('/:id', verifyIsAdmin, upload.single('imagenes'), NoteController.update)
// routerNote.delete('/:id', verifyIsAdmin, NoteController.delete)
routerNote.post('/', upload.single('imagenes'), NoteController.create)
routerNote.patch('/:id', upload.single('imagenes'), NoteController.update)
routerNote.delete('/:id', NoteController.delete)

export { routerNote }
