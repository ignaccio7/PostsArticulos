import { getFilters } from '../utils/utils.js'
import { connection } from './connection.js'

export default class ArticleModel {
  // ESTE FUNCIONA BIEN y abajo le añadimos filtros para la paginacion perPage, totalPage, currentPage
  // static async getAll ({ filters, fechaPost, page = 0, idUser = 0 }) {
  //   const { sql, values } = getFilters({ filters, fechaPost })
  //   const perPage = 4
  //   const p = parseInt(page)
  //   const selectedPage = p === 1 || p === 0 ? 0 : (p - 1) * perPage
  //   try {
  //     const query = `SELECT np.id_publicacion, n.id_nota, n.titulo, n.descripcion, n.imagenes, n.fechaPost, np.fechaPub, u.usuario,(SELECT COUNT(*) FROM popularidad p WHERE p.id_publicacion = np.id_publicacion) AS likes,(select count(*) from popularidad p where p.id_publicacion = np.id_publicacion and p.id_usuario = ${idUser}) as islike
  //     FROM notas_publicadas np, notas n, usuario u
  //     WHERE np.notas_id_nota  = n.id_nota AND  np.usuario_id_usuario  = u.id_usuario${sql} LIMIT ?,${perPage};`
  //     console.log(query)
  //     const [notes] = await connection.query(query, [...values, selectedPage])
  //     return notes
  //   } catch (error) {
  //     console.log('error in model published notes')
  //     console.log(error)
  //     throw new Error('Fallo al solicitar datos al servidor')
  //   }
  // }

  static async getAll({ filters, fechaPost, page = 0, idUser = 0, perPage = 11 }) {
    const { sql, values, nextParamIndex } = getFilters({ filters, fechaPost, startIndex: 2 })
    const paramIndex = nextParamIndex
    const p = Number.parseInt(page)
    const selectedPage = p === 1 || p === 0 ? 0 : (p - 1) * perPage
    try {
      const query = `SELECT np.id_publicacion, n.id_nota, n.titulo, n.descripcion,get_url_image(np.notas_id_nota) as url_image, np.fechaPub, u.usuario,
(SELECT COUNT(*) FROM popularidad p WHERE p.id_publicacion = np.id_publicacion) AS likes,
(SELECT count(*) from popularidad p where p.id_publicacion = np.id_publicacion and p.id_usuario = $1) as islike,
(SELECT COUNT(*) FROM comentarios c WHERE c.id_publicacion = np.id_publicacion) AS comments
FROM notas_publicadas np, notas n, usuario u
WHERE np.notas_id_nota  = n.id_nota AND  np.usuario_id_usuario  = u.id_usuario${sql} ORDER BY  (SELECT COUNT(*) FROM popularidad p WHERE p.id_publicacion = np.id_publicacion) DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`
      console.log('query')
      console.log(query)
      // console.log('sql')
      // console.log(sql)
      // console.log('perPage')
      // console.log(perPage)
      // console.log('selectedPage')
      // console.log(selectedPage)

      const result = await connection.query(query, [idUser, ...values, +perPage, +selectedPage])
      // console.log(notes)
      return result.rows
    } catch (error) {
      console.log('error in model published notes')
      console.log(error)
      throw new Error('Fallo al solicitar datos al servidor')
    }
  }

  // obtener totalPages de articles
  static async getTotalPages({ filters, fechaPost }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    const { sql, values } = getFilters({ filters, fechaPost })
    try {
      const query = `select count(*) as total_notas FROM notas_publicadas np, usuario u, notas n WHERE np.notas_id_nota = n.id_nota and np.usuario_id_usuario = u.id_usuario${sql};`
      const result = await connection.query(query, [...values])
      console.log('//////////////////////////')
      console.log(result)

      return result.rows
    } catch (error) {
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  static async getById({ id, idUser = 0 }) {
    try {
      const query = ` SELECT np.id_publicacion, n.id_nota, n.titulo, n.descripcion, n.jsonData, n.fechaPost, np.fechaPub, u.usuario,
      (SELECT COUNT(*) FROM popularidad p WHERE p.id_publicacion = np.id_publicacion) AS likes,
      (SELECT count(*) FROM popularidad p where p.id_publicacion = np.id_publicacion and p.id_usuario = $1) as islike
      FROM notas_publicadas np, notas n, usuario u
      WHERE np.notas_id_nota  = n.id_nota AND np.usuario_id_usuario  = u.id_usuario and np.id_publicacion  = $2;`
      const result = await connection.query(query, [idUser, id])
      return result.rows
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${id}`)
    }
  }

  static async toggleLike({ idPub, idUser }) {
    try {
      const query = 'call togglelike($1, $2);'
      await connection.query(query, [idPub, idUser])
      return true
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al likear: ${error}`)
    }
  }

  // Para agregar un comentario
  static async addComment({ idPub, idUser, comment }) {
    try {
      const query = 'insert into comentarios(id_publicacion, id_usuario, comment) values($1,$2,$3);'
      const result = connection.query(query, [idPub, idUser, comment])
      console.log(result)
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al likear: ${error}`)
    }
  }

  // Para eliminar un comentario
  static async canIDelete({ id, idUser = 0 }) {
    try {
      const query =
        'SELECT CASE WHEN c.id_usuario=$1 THEN 1 ELSE 0 END as can_i_delete from comentarios c where c.id_comentario = $2;'
      const result = await connection.query(query, [idUser, id])
      return result.rows
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${id}`)
    }
  }

  static async deleteComment({ idComment }) {
    try {
      const query = 'DELETE FROM comentarios WHERE id_comentario = $1'
      const result = await connection.query(query, [idComment])
      if (result.rowCount === 0) {
        return false
      }
      return true
    } catch (error) {
      console.log(error)
      throw new Error(`Error: ${error}`)
    }
  }

  // Para obtener todos los comentarios
  static async getComments({ idUser = 0, idPub }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    try {
      // const query = 'SELECT c.*, IF(c.id_usuario = ?, 1, 0) as isMyComment FROM comentarios c WHERE c.id_publicacion = ? ORDER BY c.id_comentario DESC;'
      const query = `SELECT c.id_comentario, c.comment, c.fechaPub, CASE WHEN c.id_usuario = $1 THEN 1 ELSE 0 END as isMyComment, u.usuario, p.avatar  
      FROM comentarios c 
      right join usuario u on u.id_usuario = c.id_usuario
      right join persona p on u.persona_ci = p.ci
      WHERE c.id_publicacion = $2 
      ORDER BY c.id_comentario DESC;`
      const [comments] = await connection.query(query, [idUser, idPub])
      return comments
    } catch (error) {
      console.log('error in model')
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  // Para aprobar una nota a publicacion
  static async approveNote({ idNote, idUser }) {
    try {
      const query =
        'insert into notas_publicadas (notas_id_nota, usuario_id_usuario, fechaPub) values($1,$2,CURRENT_DATE);'
      await connection.query(query, [idNote, idUser])
      return true
    } catch (error) {
      console.error(error)
      throw new Error('Error al aprobar la nota')
    }
  }

  // Para desaprobar notas que se hayan publicado
  static async disapproveMultipleNotes({ idNotes }) {
    const conn = await connection.getConnection()
    try {
      await conn.beginTransaction()
      const query = 'delete from notas_publicadas where id_publicacion = $1;'
      const promises = idNotes.map((idNote) => {
        return conn.query(query, [idNote])
      })
      await Promise.all(promises)
      await conn.commit()
      return true
    } catch (error) {
      await conn.rollback()
      console.log(error)
      const objError = { status: 500, message: 'Error al desaprobar las notas' }
      throw objError
    } finally {
      conn.release()
    }
  }

  // Para aprobar multiples notas a publicacion
  static async approveMultipleNotes({ idNotes, idUser }) {
    const conn = await connection.connect()
    try {
      console.log(idNotes)
      await conn.query('BEGIN')
      const query =
        'insert into notas_publicadas (notas_id_nota, usuario_id_usuario, fechaPub) values($1,$2,CURRENT_DATE);'
      const promises = idNotes.map((idNote) => {
        return conn.query(query, [idNote, idUser])
      })
      await Promise.all(promises)
      await conn.query('COMMIT')
      return true
    } catch (error) {
      await conn.query('ROLLBACK')
      console.error(error)
      const objError = { status: 500, message: 'Error al aprobar las notas' }
      if (error.code === '23505') {
        objError.status = 409
        objError.message = 'Las notas ya fueron aprobadas.'
      }
      throw objError
    } finally {
      conn.release()
    }
  }
}
