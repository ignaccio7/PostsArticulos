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

  static async getAll ({ filters, fechaPost, page = 0, idUser = 0, perPage }) {
    const { sql, values } = getFilters({ filters, fechaPost })
    const p = parseInt(page)
    const selectedPage = p === 1 || p === 0 ? 0 : (p - 1) * perPage
    try {
      const query = `SELECT np.id_publicacion, n.id_nota, n.titulo, n.descripcion, n.imagenes, n.fechaPost, np.fechaPub, u.usuario,(SELECT COUNT(*) FROM popularidad p WHERE p.id_publicacion = np.id_publicacion) AS likes,(select count(*) from popularidad p where p.id_publicacion = np.id_publicacion and p.id_usuario = ${idUser}) as islike
      FROM notas_publicadas np, notas n, usuario u
      WHERE np.notas_id_nota  = n.id_nota AND  np.usuario_id_usuario  = u.id_usuario${sql} LIMIT ?,${perPage};`
      const [notes] = await connection.query(query, [...values, selectedPage])
      // console.log(notes)
      return notes
    } catch (error) {
      console.log('error in model published notes')
      console.log(error)
      throw new Error('Fallo al solicitar datos al servidor')
    }
  }

  // obtener totalPages de articles
  static async getTotalPages ({ filters, fechaPost }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    const { sql, values } = getFilters({ filters, fechaPost })
    try {
      const query = `select count(*) as total_notas FROM notas_publicadas np, usuario u, notas n WHERE np.notas_id_nota = n.id_nota and np.usuario_id_usuario = u.id_usuario${sql};`
      const [result] = await connection.query(query, [...values])
      return result[0]
    } catch (error) {
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  static async getById ({ id, idUser = 0 }) {
    try {
      const query = ` SELECT np.id_publicacion, n.id_nota, n.titulo, n.descripcion, n.imagenes, n.fechaPost, np.fechaPub, u.usuario,
      (SELECT COUNT(*) FROM popularidad p WHERE p.id_publicacion = np.id_publicacion) AS likes,
      (select count(*) from popularidad p where p.id_publicacion = np.id_publicacion and p.id_usuario = ${idUser}) as islike
      FROM notas_publicadas np, notas n, usuario u
      WHERE np.notas_id_nota  = n.id_nota AND np.usuario_id_usuario  = u.id_usuario and np.id_publicacion  = ${id};`
      const [note] = await connection.query(query, [id])
      return note
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${id}`)
    }
  }

  static async toggleLike ({ idPub, idUser }) {
    try {
      const query = 'call togglelike(?, ?);'
      await connection.query(query, [idPub, idUser])
      return true
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al likear: ${error}`)
    }
  }

  // Para agregar un comentario
  static async addComment ({ idPub, idUser, comment }) {
    try {
      const query = 'insert into comentarios(id_publicacion, id_usuario, comment) values(?,?,?);'
      const result = connection.query(query, [idPub, idUser, comment])
      console.log(result)
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al likear: ${error}`)
    }
  }

  // Para eliminar un comentario
  static async canIDelete ({ id, idUser = 0 }) {
    try {
      const query = 'select if(c.id_usuario=?,1,0) as can_i_delete from comentarios c where c.id_comentario = ?;'
      const [result] = await connection.query(query, [idUser, id])
      return result
    } catch (error) {
      console.log(error)
      throw new Error(`Fallo al obtener la nota con id: ${id}`)
    }
  }

  static async deleteComment ({ idComment }) {
    try {
      const query = 'delete from comentarios where id_comentario = ?'
      const [result] = await connection.query(query, idComment)
      if (result.affectedRows === 0) {
        return false
      }
      return true
    } catch (error) {
      console.log(error)
      throw new Error(`Error: ${error}`)
    }
  }

  // Para obtener todos los comentarios
  static async getComments ({ idUser = 0, idPub }) {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    try {
      const query = 'SELECT c.*, IF(c.id_usuario = ?, 1, 0) as isMyComment FROM comentarios c WHERE c.id_publicacion = ?;'
      const [comments] = await connection.query(query, [idUser, idPub])
      return comments
    } catch (error) {
      console.log('error in model')
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  // Para aprobar una nota a publicacion
  static async approveNote ({ idNote, idUser }) {
    try {
      const query = 'insert into notas_publicadas (notas_id_nota, usuario_id_usuario, fechaPub) values(?,?,CURDATE());'
      await connection.query(query, [idNote, idUser])
      return true
    } catch (error) {
      console.error(error)
      throw new Error('Error al aprobar la nota')
    }
  }

  // Para aprobar multiples notas a publicacion
  static async approveMultipleNotes ({ idNotes, idUser }) {
    try {
      console.log(idNotes)
      await connection.beginTransaction()
      const query = 'insert into notas_publicadas (notas_id_nota, usuario_id_usuario, fechaPub) values(?,?,CURDATE());'
      const promises = idNotes.map(idNote => {
        return connection.query(query, [idNote, idUser])
      })
      await Promise.all(promises)
      await connection.commit()
      return true
    } catch (error) {
      await connection.rollback()
      console.error(error)
      const objError = { status: 500, message: 'Error al crear la persona' }
      if (error.code === 'ER_DUP_ENTRY') {
        objError.status = 409
        objError.message = 'Las notas ya fueron aprobadas.'
      }
      throw objError
    }
  }
}
