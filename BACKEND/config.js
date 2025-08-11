import { config } from 'dotenv'

config()

export default {
  port: process.env.PORT || 3007,
  host: process.env.HOST || 'localhost',
  db_host: process.env.DB_HOST || 'localhost',
  db_name: process.env.DB_NAME || 'posts_db',
  db_user: process.env.DB_USER || 'postgres',
  db_password: process.env.DB_PASSWORD || '260298',
  db_port: process.env.DB_PORT || '5432',
  cd_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  cd_api_key: process.env.CLOUDINARY_API_KEY || '',
  cd_api_secret: process.env.CLOUDINARY_API_SECRET || '',
  rate_limit_general: Number.parseInt(process.env.LIMIT_GENERAL_PER_MINUTE) || 30,
  rate_limit_read: Number.parseInt(process.env.LIMIT_READ_PER_MINUTE) || 20,
  rate_limit_write: Number.parseInt(process.env.LIMIT_WRITE_PER_MINUTE) || 3,
  access_token_expiration: process.env.ACCESS_TOKEN_EXPIRES_IN || '900000',
  refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRES_IN || '3600000',
  environment: process.env.NODE_ENV || 'development',
  admin_user: process.env.ADMIN_USER || 'admin',
  admin_password: process.env.ADMIN_PASSWORD || 'aA*123456',
  admin_email: process.env.ADMIN_EMAIL || 'admin@google.com',
  secretKey: 'postsRGIgna',
}
