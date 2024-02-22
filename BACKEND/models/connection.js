import config from '../config.js'
import mysql from 'mysql2/promise'

const conf = {
  host: config.db_host,
  user: config.db_user,
  port: config.db_port,
  password: config.db_password,
  database: config.db_name
}

const connection = await mysql.createConnection(conf)

export { connection }
