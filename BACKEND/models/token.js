import { connection } from './connection.js'

export default class TokenModel {
  // guardar refresh token una vez que el usuario se haya autenticado
  static async saveRefreshToken({ userId, tokenId, tokenHash, expiresAt }) {
    console.log({ userId, tokenId, tokenHash, expiresAt })
    const query =
      'INSERT INTO refresh_tokens (user_id, token_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
    try {
      const result = await connection.query(query, [userId, tokenId, tokenHash, expiresAt])
      console.log(result)
      return result
    } catch (error) {
      throw new Error('Fallo al conectase a la base de datos', error.message)
    }
  }

  // borrar token una vez que el usuario cierre sesion
  static async deleteRefreshToken({ jti, userId }) {
    try {
      const [result] = await connection.query(
        'DELETE FROM refresh_tokens WHERE token_id = ? AND user_id = ?',
        [jti, userId]
      )

      if (result.affectedRows === 0) {
        return false
      }

      return true
    } catch (error) {
      throw new Error('Fallo al conectase a la base de datos', error.message)
    }
  }

  static async findRefreshToken({ jti }) {
    const query = `SELECT * FROM refresh_tokens 
    WHERE token_id = ? AND expires_at > NOW()`
    try {
      const [result] = await connection.query(query, [jti])
      return result
    } catch (error) {
      throw new Error('Fallo al autenticar el usuario', error.message)
    }
  }

  static async deleteAllTokensForUser({ userId }) {
    const query = 'DELETE FROM refresh_tokens WHERE user_id = ?'
    try {
      const [result] = await connection.query(query, [userId])
      return result
    } catch (error) {
      throw new Error('Fallo al cerrar las sessiones del usuario', error.message)
    }
  }

  static async cleanExpiredTokens() {
    const query = 'DELETE FROM refresh_tokens WHERE expires_at < NOW()'
    try {
      const [result] = await connection.query(query)
      return result
    } catch (error) {
      throw new Error('Fallo al eliminar los tokens caducados', error.message)
    }
  }
}
