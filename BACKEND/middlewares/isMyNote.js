import NoteModel from '../models/note.js'

export async function verifyUserPermissionForNote (request, response, next) {
  try {
    const idUser = request.idUser
    const params = request.params

    const result = await NoteModel.verifyUserPermissionForNote({ idNote: params.id, idUser })

    if (result.length === 0) throw new Error('Not permission allowed')

    next()
  } catch (error) {
    next(error)
  }
}
