import { connection } from './connection.js'

export default class UserModel {
  static async getAll () {
    try {
      const query = 'SELECT u.*, p.avatar FROM usuario u, persona p WHERE u.persona_ci = p.ci'
      const [users] = await connection.query(query)
      return users
    } catch (error) {
      console.log(error)
      throw new Error('fallo al solicitar datos')
    }
  }

  static async createUserPerson ({ person, user }) {
    const {
      ci,
      nombres,
      paterno,
      materno,
      telefono,
      correo,
      avatar,
      avatarId
    } = person
    const {
      usuario,
      pass,
      rol
    } = user

    try {
      await connection.beginTransaction()

      const queryPerson = 'INSERT INTO persona (ci,nombres,paterno,materno,telefono,correo,avatar,avatar_id) VALUES (?,?,?,?,?,?,?,?)'
      const queryUser = 'INSERT INTO usuario(persona_ci,usuario,pass) VALUES(?,?,?)'
      const promisePerson = connection.query(queryPerson, [ci, nombres, paterno, materno, telefono, correo, avatar, avatarId])
      const promiseUser = connection.query(queryUser, [ci, usuario, pass, rol])
      // const promisePerson = connection.query('SELECT * FROM persona')
      // const promiseUser = connection.query('SELECT * FROM usuario')
      const [resultPerson, resultUser] = await Promise.all([promisePerson, promiseUser])
      console.log(resultPerson)
      console.log(resultUser)
      await connection.commit()
      return {
        person,
        user
      }
    } catch (error) {
      await connection.rollback()
      // throw new Error('Error al crear la persona')
      console.error('errorModel', error)
      const objError = { status: 500, message: 'Error al crear la persona' }
      // TODO arreglar el error para cuando el username ya esta ocupado
      if (error.code === 'ER_DUP_ENTRY') {
        objError.status = 409
        objError.message = 'Usted ya cuenta con un usuario registrado o El nombre de usuario ya esta ocupado.'
      }
      throw objError
    }
  }

  /* Este metodo ya no se necesitaria al validar arriba cada uno por el hash
  static async verifyUser ({ user, pass }) {
    const query = 'SELECT * FROM usuario WHERE usuario=? AND pass=?'
    try {
      const [result] = await connection.query(query, [user, pass])
      return result
    } catch (error) {
      console.error(error)
      throw new Error('Error al intentar logearse')
    }
  } */

  static async search ({ ci }) {
    const query = 'SELECT persona_ci,usuario,rol FROM usuario WHERE persona_ci = ?'
    try {
      const [user] = await connection.query(query, [ci])
      return user
    } catch (error) {
      console.error(error)
      throw new Error(`Fallo el buscar el usuario con ci ${ci}`)
    }
  }

  static async update ({ ci, usuario, pass }) {
    try {
      const query = 'UPDATE usuario SET usuario=?, pass=? WHERE persona_ci = ?'
      const [result] = await connection.query(query, [usuario, pass, ci])
      console.log(result)

      if (result.affectedRows === 0) {
        return false
      }

      const [updatedUser] = await connection.query('SELECT * FROM usuario WHERE persona_ci = ?', [ci])
      return updatedUser
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar el usuario')
    }
  }

  // metodo para el middleware de token
  static async searchByUsername ({ username }) {
    const query = 'SELECT rol, id_usuario FROM usuario WHERE usuario = ?'
    try {
      const [result] = await connection.query(query, [username])
      return result
    } catch (error) {
      console.log(error)
      throw new Error('Fallo en la base de datos al buscar el usuario')
    }
  }

  // metodo para obtener el password del usuario
  static async getPassUser ({ username }) {
    const query = 'SELECT pass FROM usuario WHERE usuario = ?'
    try {
      const [result] = await connection.query(query, [username])
      return result
    } catch (error) {
      console.log(error)
      throw new Error('Fallo en la base de datos al buscar el usuario')
    }
  }
}
