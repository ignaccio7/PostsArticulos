import { connection } from './connection.js'

export default class NoteModel {
  static async getAll () {
    try {
      const query = 'SELECT n.*, u.usuario FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario'
      const [notes] = await connection.query(query)
      return notes
    } catch (error) {
      console.log('error in model notes')
      console.log(error)
      throw new Error('Fallo al solicitar datos al servidor')
    }
  }

  static async getById ({ id }) {
    try {
      const query = 'SELECT * FROM notas WHERE id_nota = ?'
      const [note] = await connection.query(query, [id])
      return note
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${id}`)
    }
  }

  static async createNote ({ note }) {
    const {
      idUsuario,
      titulo,
      tema,
      descripcion,
      imagenes
    } = note
    try {
      const query = 'INSERT INTO notas (usuario_id_usuario,titulo,tema,descripcion,imagenes,fechaPost) VALUES (?,?,?,?,?)'
      await connection.query(query, [idUsuario, titulo, tema, descripcion, imagenes, new Date()])
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear la nota')
    }
  }

  static async deleteNote ({ id }) {
    try {
      const query = 'DELETE FROM notas WHERE id_nota = ?'
      const [deleteNote] = connection.query(query, [id])
      if (deleteNote.affectedRows === 0) {
        return false
      }
      return true
    } catch (error) {
      console.log(error)
      throw new Error('Error al eliminar la nota')
    }
  }

  static async updateNote ({ id, partialNote }) {
    try {
      const columns = []; const values = []
      Object.entries(partialNote).forEach(([column, value]) => {
        columns.push(`${column}=?`)
        values.push(value)
      })
      const query = `UPDATE notas SET ${columns.join(',')} WHERE id_nota = ?`
      const [result] = await connection.query(query, [...values, id])
      console.log(result)

      if (result.affectedRows === 0) {
        return false
      }
      const [updatedNote] = await connection.query('SELECT * FROM notas WHERE id_nota = ?', [id])
      return updatedNote
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar la nota')
    }
  }
}
