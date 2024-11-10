import { connection } from './connection.js'

export default class PersonModel {
  // Para obtener todos los resultados
  static async getAll () {
    // const [results, fields] = await connection.query(query) -> results es el vector de resultados - fields los campos de la base de datos
    try {
      const query = 'SELECT * FROM persona'
      const [people] = await connection.query(query)
      return people
    } catch (error) {
      console.log('error in model')
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  // Para obtener un resultado determinado por el ci
  static async getById ({ ci }) {
    try {
      const query = 'SELECT * FROM persona WHERE ci = ?'
      const [person] = await connection.query(query, [ci])
      return person
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar la persona con ci ${ci}`)
    }
  }

  // Para obtener un resultado determinado por el nombre de usuario
  static async getByUsername ({ username }) {
    try {
      const query = 'select p.ci, p.nombres, p.paterno, p.materno, p.telefono, p.correo, p.avatar from persona p , usuario u where u.persona_ci = p.ci and u.usuario = ?;'
      const [person] = await connection.query(query, [username])
      return person
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar la persona con ci ${username}`)
    }
  }

  // Para crear una nueva persona
  static async createPerson ({ person }) {
    const {
      ci,
      nombres,
      paterno,
      materno,
      telefono,
      correo,
      avatar
    } = person

    try {
      const query = 'INSERT INTO persona (ci,nombres,paterno,materno,telefono,correo,avatar) VALUES (?,?,?,?,?,?,?) '
      await connection.query(query, [ci, nombres, paterno, materno, telefono, correo, avatar])
      return person
    } catch (error) {
      console.error(error)
      throw new Error('Error al crear la persona')
    }
  }

  // Para eliminar a una persona
  static async deletePerson ({ ci }) {
    try {
      const query = 'DELETE FROM persona WHERE ci = ?'
      const [deletePerson] = await connection.query(query, ci)
      if (deletePerson.affectedRows === 0) {
        return false
      }
      return true
    } catch (error) {
      console.log(error)
      throw new Error('Error al eliminar la persona')
    }
  }

  // Para actualizar a una persona
  static async updatePerson ({ ci, partialPerson }) {
    try {
      const columns = []; const values = []
      Object.entries(partialPerson).forEach(([column, value]) => {
        columns.push(`${column}=?`)
        values.push(value)
      })
      const query = `UPDATE persona SET ${columns.join(',')} WHERE ci = ?`
      const [result] = await connection.query(query, [...values, ci])
      console.log(result)

      if (result.affectedRows === 0) {
        return false
      }
      const [updatePerson] = await connection.query('SELECT * FROM persona WHERE ci = ?', [ci])
      return updatePerson
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar la persona')
    }
  }

  // Para buscar el id_avatar de una persona
  static async searchIdAvatar ({ ci }) {
    try {
      const query = 'SELECT avatar_id FROM persona WHERE ci = ?'
      const [person] = await connection.query(query, [ci])
      return person
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar la persona con ci ${ci}`)
    }
  }
}
