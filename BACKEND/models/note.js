import { getFilters } from '../utils/utils.js'
import { connection } from './connection.js'

export default class NoteModel {
  static async getAll ({ filters, fechaPost, page = 0, perPage = 5 }) {
    const { sql, values } = getFilters({ filters, fechaPost })
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

  // obtener totalPages de notas
  static async getTotalPages ({ filters, fechaPost }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    const { sql, values } = getFilters({ filters, fechaPost })
    try {
      const query = `select count(*) as total_notas FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario${sql};`
      const [result] = await connection.query(query, [...values])
      return result[0]
    } catch (error) {
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  // obtener totalPages de notas por usuario
  static async getTotalPagesByUser ({ filters, fechaPost, idUser }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    const { sql, values } = getFilters({ filters, fechaPost })
    try {
      const query = `select count(*) as total_notas FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario AND n.usuario_id_usuario = ?${sql};`
      const [result] = await connection.query(query, [idUser, ...values])
      return result[0]
    } catch (error) {
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  // static async getById ({ id }) {
  //   try {
  //     const query = 'SELECT n.*, u.usuario FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario AND id_nota = ?'
  //     const [note] = await connection.query(query, [id])
  //     return note
  //   } catch (error) {
  //     console.log(error)
  //     throw new Error(`Fallo al obtener la nota con id: ${id}`)
  //   }
  // }
  static async getById ({ id }) {
    try {
      const query = 'SELECT n.jsonData, u.usuario FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario AND id_nota = ?'
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
      T1: titulo,
      P1: descripcion,
      jsonData
    } = note
    try {
      const query = 'INSERT INTO notas (usuario_id_usuario,titulo,descripcion,fechaPost,jsonData) VALUES (?,?,?,?,?)'
      await connection.query(query, [idUsuario, titulo, descripcion, new Date(), jsonData])
      // return note
      return {
        titulo,
        descripcion
      }
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
      console.info('Nota eliminada')
      return true
    } catch (error) {
      console.log(error)
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('No puedes eliminar esta nota porque esta publicada')
      }
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

  // Para buscar el id_image de una nota <- para el avatar servia cuando solo existia una imagen pero ahora las guardamos como un json
  static async searchIdImage ({ idNota }) {
    try {
      const query = 'SELECT imagen_id FROM notas WHERE id_nota = ?'
      const [note] = await connection.query(query, [idNota])
      return note
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar la nota con id ${idNota}`)
    }
  }

  // static async searchIdsImages ({ idNota }) {
  //   try {
  //     const query = 'SELECT jsonData FROM notas WHERE id_nota = ?'
  //     // const query = `SELECT jt.element ->> '$.content.imageId' AS image_url FROM notas n, JSON_TABLE(n.jsonData , '$[*]'
  //     // COLUMNS (element JSON PATH '$')) AS jt
  //     // WHERE jt.element ->> '$.tag' = 'image' and n.id_nota = ?;`
  //     const [jsonData] = await connection.query(query, [idNota])
  //     return jsonData[0]
  //   } catch (error) {
  //     console.error(error)
  //     throw new Error(`Fallo el buscar la nota con id ${idNota}`)
  //   }
  // }

  static async searchIdsImages ({ idNota }) {
    try {
      const query = `SELECT jt.element ->> '$.content.imageId' AS image_id, jt.element ->> '$.content.image' AS image_url  FROM notas n, JSON_TABLE(n.jsonData , '$[*]' 
      COLUMNS (element JSON PATH '$')) AS jt
      WHERE jt.element ->> '$.tag' = 'image' and n.id_nota = ?;`
      const [jsonData] = await connection.query(query, [idNota])
      return jsonData
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar la nota con id ${idNota}`)
    }
  }

  static async getNotesByUser ({ filters, fechaPost, page = 0, idUser, perPage = 5 }) {
    const { sql, values } = getFilters({ filters, fechaPost })
    const p = parseInt(page)
    const selectedPage = p === 1 || p === 0 ? 0 : (p - 1) * perPage
    try {
      const query = `SELECT n.*, get_url_image(n.id_nota) as image_url FROM notas n WHERE n.usuario_id_usuario = ?${sql} ORDER BY n.id_nota ASC, n.fechaPost ASC LIMIT ?,${perPage}`
      console.log(query)
      const [notes] = await connection.query(query, [idUser, ...values, selectedPage])
      return notes
    } catch (error) {
      console.log('error in model notes')
      console.log(error)
      throw new Error('Fallo al solicitar datos al servidor')
    }
  }
}
