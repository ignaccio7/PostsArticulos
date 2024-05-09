import { Router } from 'express'
import { verifyIsAdmin } from '../middlewares/verifyUser.js'
import NoteController from '../controllers/note.js'
import { verifyToken } from '../middlewares/authJWT.js'

const routerNote = Router()

routerNote.use(verifyToken)
// routerNote.use(verifyIsAdmin)

routerNote.get('/', NoteController.getAll)
routerNote.get('/:id', NoteController.getById)
routerNote.post('/', verifyIsAdmin, NoteController.create)
routerNote.patch('/:id', verifyIsAdmin, NoteController.update)
routerNote.delete('/:id', verifyIsAdmin, NoteController.delete)

export { routerNote }
