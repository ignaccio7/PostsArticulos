import { getFilters } from '../utils/utils.js'
import { connection } from './connection.js'

export default class NoteModel {
  static async getAll ({ filters, fechaPost, page = 0 }) {
    const { sql, values } = getFilters({ filters, fechaPost })
    const perPage = 4
    const p = parseInt(page)
    const selectedPage = p === 1 || p === 0 ? 0 : (p - 1) * perPage
    try {
      const query = `SELECT n.*, u.usuario FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario${sql} LIMIT ?,${perPage}`
      const [notes] = await connection.query(query, [...values, selectedPage])
      return notes
    } catch (error) {
      console.log('error in model notes')
      console.log(error)
      throw new Error('Fallo al solicitar datos al servidor')
    }
  }

  static async getById ({ id }) {
    try {
      const query = 'SELECT n.*, u.usuario FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario AND id_nota = ?'
      const [note] = await connection.query(query, [id])
      return note
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${id}`)
    }
  }

  static async createNote ({ note }) {
    console.log('La nota es ', note)
    const {
      usuario_id_usuario: idUsuario,
      titulo,
      tema,
      descripcion,
      imagenes,
      imageId
    } = note
    try {
      const query = 'INSERT INTO notas (usuario_id_usuario,titulo,tema,descripcion,fechaPost,imagenes, imagen_id) VALUES (?,?,?,?,?,?,?)'
      await connection.query(query, [idUsuario, titulo, tema, descripcion, new Date(), imagenes, imageId])
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear la nota')
    }
  }

  static async deleteNote ({ id }) {
    try {
      const query = 'DELETE FROM notas WHERE id_nota = ?'
      console.log('El id ees:', id)
      const [deleteNote] = await connection.query(query, id)
      console.log('El id ees:', id)
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

  // Para buscar el id_image de una nota
  static async searchIdImage ({ idNota }) {
    try {
      const query = 'SELECT image_id FROM notas WHERE id_nota = ?'
      const [note] = await connection.query(query, [idNota])
      return note
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar la nota con id ${idNota}`)
    }
  }
}
