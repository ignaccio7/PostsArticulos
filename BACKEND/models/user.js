import { connection } from './connection.js'

export default class UserModel {
  static async getAll () {
    try {
      const query = 'SELECT * FROM usuario'
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
      avatar
    } = person
    const {
      usuario,
      pass,
      rol
    } = user

    try {
      await connection.beginTransaction()

      const queryPerson = 'INSERT INTO persona (ci,nombres,paterno,materno,telefono,correo,avatar) VALUES (?,?,?,?,?,?,?)'
      const queryUser = 'INSERT INTO usuario(persona_ci,usuario,pass,rol) VALUES(?,?,?,?)'
      const promisePerson = connection.query(queryPerson, [ci, nombres, paterno, materno, telefono, correo, avatar])
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
      if (error.code === 'ER_DUP_ENTRY') {
        objError.status = 409
        objError.message = 'Usted ya cuenta con un usuario registrado'
      }
      throw objError
    }
  }

  static async verifyUser ({ user, pass }) {
    const query = 'SELECT * FROM usuario WHERE usuario=? AND pass=?'
    try {
      const [result] = await connection.query(query, [user, pass])
      return result
    } catch (error) {
      console.error(error)
      throw new Error('Error al intentar logearse')
    }
  }

  static async searchUser ({ ci }) {
    const query = 'SELECT usuario FROM usuario WHERE persona_ci = ?'
  }
}
