import mysql from 'mysql2/promise'
import config from '../config.js'

const conf = {
  host: config.db_host,
  user: config.db_user,
  port: config.db_port,
  password: config.db_password,
  database: config.db_name,

  waitForConnections: true,
  connectionLimit: 2,
  maxIdle: 2,
  idleTimeout: 60000,

  connectTimeout: 60000,
  charset: 'utf8mb4',
}

// const connection = await mysql.createConnection(conf)
const pool = mysql.createPool(conf)

// pool.on('connection', (connection) => {
//   console.log(`🔗 Nueva conexión establecida: ID ${connection.threadId}`)
// })

const closeDatabase = async () => {
  try {
    console.log('🔄 Cerrando conexiones de base de datos...')
    await pool.end()
    console.log('✅ Base de datos cerrada correctamente')
  } catch (error) {
    console.error('❌ Error cerrando base de datos:', error)
  }
}

const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log('✅ Conexión a DB establecida')
    return true
  } catch (error) {
    console.error('❌ Error conectando a DB:', error)
    return false
  }
}

export { pool as connection, closeDatabase, testConnection }
