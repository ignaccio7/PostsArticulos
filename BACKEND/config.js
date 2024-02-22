import { config } from 'dotenv'

config()

export default {
  port: process.env.PORT || 3007,
  host: process.env.HOST || 'localhost',
  db_host: process.env.DB_HOST || 'localhost',
  db_name: process.env.DB_NAME || 'posts_db',
  db_user: process.env.DB_USER || 'root',
  db_password: process.env.DB_PASSWORD || '',
  db_port: process.env.DB_PORT || '3306',
  SECRET: 'postsRGIgna'
}
