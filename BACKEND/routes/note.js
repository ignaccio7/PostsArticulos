import { Router } from 'express'
import { verifyIsAdmin } from '../middlewares/verifyUser.js'
import NoteController from '../controllers/note.js'
import { checkToken, verifyToken } from '../middlewares/authJWT.js'
import { upload } from '../middlewares/uploadImage.js'
import { verifyUserPermissionForNote } from '../middlewares/isMyNote.js'

const routerNote = Router()

// routerNote.use(verifyToken)
// routerNote.use(verifyIsAdmin)

routerNote.get('/', verifyToken, verifyIsAdmin, NoteController.getAll)
routerNote.get('/me', verifyToken, NoteController.getNotesByUser)
routerNote.get('/:id', verifyToken, verifyUserPermissionForNote, NoteController.getById)
routerNote.get('/read/:id', checkToken, verifyToken, NoteController.getNoteForRead)
// routerNote.post('/', verifyIsAdmin, upload.single('imagenes'), NoteController.create)
// routerNote.patch('/:id', verifyIsAdmin, upload.single('imagenes'), NoteController.update)
// routerNote.delete('/:id', verifyIsAdmin, NoteController.delete)
routerNote.post('/', verifyToken, upload.array('imagenes', 5), NoteController.create)
routerNote.patch('/:id', verifyToken, verifyUserPermissionForNote, upload.array('imagenes', 5), NoteController.update)
routerNote.delete('/:id', verifyToken, verifyUserPermissionForNote, NoteController.delete)

export { routerNote }
