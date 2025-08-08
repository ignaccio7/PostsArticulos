import { getFilters } from '../utils/utils.js'
import { connection } from './connection.js'

export default class NoteModel {
  static async getAll({ filters, fechaPost, page = 0, perPage = 5 }) {
    const { sql, values, nextParamIndex } = getFilters({ filters, fechaPost })
    const p = Number.parseInt(page)
    const selectedPage = p === 1 || p === 0 ? 0 : (p - 1) * perPage
    try {
      const query = `SELECT n.id_nota, n.titulo, n.descripcion, n.fechaPost, u.usuario, get_url_image(n.id_nota) as image_url FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario and n.id_nota not in (select notas_id_nota from notas_publicadas np)${sql} ORDER BY n.id_nota DESC, n.fechaPost DESC LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1};`
      const result = await connection.query(query, [...values, +perPage, +selectedPage])
      console.log(result)

      return result.rows
    } catch (error) {
      console.log('error in model notes')
      console.log(error)
      throw new Error('Fallo al solicitar datos al servidor')
    }
  }

  // obtener totalPages de notas
  static async getTotalPages({ filters, fechaPost }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    const { sql, values } = getFilters({ filters, fechaPost })
    try {
      const query = `select count(*) as total_notas FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario and n.id_nota not in (select notas_id_nota from notas_publicadas np)${sql};`
      const result = await connection.query(query, [...values])
      return result.rowCount
    } catch (error) {
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  // obtener totalPages de notas por usuario
  static async getTotalPagesByUser({ filters, fechaPost, idUser }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    const { sql, values } = getFilters({ filters, fechaPost, startIndex: 2 })
    try {
      const query = `SELECT count(*) as total_notas FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario AND n.usuario_id_usuario = $1${sql}`
      const result = await connection.query(query, [idUser, ...values])

      return result.rows
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
  static async getById({ id }) {
    try {
      const query =
        'SELECT n.jsonData, u.usuario FROM notas n, usuario u WHERE n.usuario_id_usuario = u.id_usuario AND id_nota = $1'
      const result = await connection.query(query, [id])
      return result.rows
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${id}`)
    }
  }

  // Automatizar para que solo enviando un parametro te de el nombre e imagen del usuario sin tener que crear otro metodo como lo haremos
  static async getNoteForRead({ idNote, idUser = 0 }) {
    try {
      const query = `SELECT n.jsonData, n.fechaPost ,u.usuario, p.avatar, get_full_name(p.ci) as fullname
      FROM notas n, usuario u, persona p WHERE n.usuario_id_usuario = u.id_usuario and u.persona_ci  = p.ci  AND id_nota = $1;`

      console.log('Llego aqui 0')
      const queryPopularity = 'CALL get_popularity_byNote($1, $2,NULL,NULL,NULL,NULL);'
      const popularity = await connection.query(queryPopularity, [idNote, idUser])

      console.log('Llego aqui 1')

      const note = await connection.query(query, [idNote])
      console.log('Llego aqui 2')
      // const popularity = await connection.query(
      //   'SELECT @likes AS likes, @comments AS comments, @isLike AS islike, @xisPublished AS isPublished;'
      // )
      console.log('Llego aqui 3')
      return {
        note: note.rows,
        popularity: popularity.rows,
      }
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${idNote}`)
    }
  }

  static async createNote({ note }) {
    console.log('La nota es ', note)
    const { usuario_id_usuario: idUsuario, T1: titulo, P1: descripcion, jsonData } = note
    try {
      const query =
        'INSERT INTO notas (usuario_id_usuario,titulo,descripcion,fechaPost,jsonData) VALUES ($1, $2, $3, $4, $5)'
      await connection.query(query, [idUsuario, titulo, descripcion, new Date(), jsonData])
      // return note
      return {
        titulo,
        descripcion,
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear la nota')
    }
  }

  static async deleteNote({ id }) {
    try {
      const query = 'DELETE FROM notas WHERE id_nota = $1'
      console.log('El id ees:', id)
      const deleteNote = await connection.query(query, [id])
      console.log('El id ees:', id)
      if (deleteNote.rowCount === 0) {
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

  static async updateNote({ id, partialNote }) {
    try {
      const columns = []
      const values = []
      let paramIndex = 1
      Object.entries(partialNote).forEach(([column, value]) => {
        columns.push(`${column}=$${paramIndex}`)
        values.push(value)
        paramIndex++
      })
      const query = `UPDATE notas SET ${columns.join(',')} WHERE id_nota = $${paramIndex}`
      const result = await connection.query(query, [...values, id])
      console.log(result)

      if (result.rowCount === 0) {
        return false
      }
      const updatedNote = await connection.query('SELECT * FROM notas WHERE id_nota = ?', [id])
      return updatedNote.rows
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar la nota')
    }
  }

  // Para buscar el id_image de una nota <- para el avatar servia cuando solo existia una imagen pero ahora las guardamos como un json
  static async searchIdImage({ idNota }) {
    try {
      const query = 'SELECT imagen_id FROM notas WHERE id_nota = $1'
      const note = await connection.query(query, [idNota])
      return note.rows
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

  static async searchIdsImages({ idNota }) {
    try {
      const query = `
        SELECT 
          jsonb_extract_path_text(elem.value, 'content', 'imageId') as image_id,
          jsonb_extract_path_text(elem.value, 'content', 'image') as image_url
        FROM notas n, 
             jsonb_array_elements(n.jsonData) as elem(value)
        WHERE elem.value ->> 'tag' = 'image' 
        AND n.id_nota = $1
      `
      const jsonData = await connection.query(query, [idNota])
      return jsonData.rows
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar la nota con id ${idNota}`)
    }
  }

  static async getNotesByUser({ filters, fechaPost, page = 0, idUser, perPage = 5 }) {
    const { sql, values, nextParamIndex = 2 } = getFilters({ filters, fechaPost, startIndex: 2 })
    const p = Number.parseInt(page)
    const selectedPage = p === 1 || p === 0 ? 0 : (p - 1) * perPage
    try {
      const query = `SELECT n.*, get_url_image(n.id_nota) as image_url FROM notas n WHERE n.usuario_id_usuario = $1${sql} ORDER BY n.id_nota DESC, n.fechaPost DESC LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1}`
      console.log(query)
      console.log(idUser)
      console.log(values)
      console.log(perPage)
      console.log(selectedPage)
      console.log(JSON.stringify(sql))
      console.log([idUser, ...values, +perPage, +selectedPage])

      const notes = await connection.query(query, [idUser, ...values, +perPage, +selectedPage])
      console.log(notes)

      return notes.rows
    } catch (error) {
      console.log('error in model notes')
      console.log(error)
      throw new Error('Fallo al solicitar datos al servidor')
    }
  }

  static async verifyUserPermissionForNote({ idNote, idUser }) {
    try {
      const query = 'SELECT * from notas n where n.id_nota = $1 and n.usuario_id_usuario = $2;'
      const note = await connection.query(query, [idNote, idUser])
      return note.rows
    } catch (error) {
      throw new Error('Error al comunicarse con la base de datos:', error.message)
    }
  }
}
