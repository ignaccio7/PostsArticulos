import config from '../config.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: config.cd_name,
  api_key: config.cd_api_key,
  api_secret: config.cd_api_secret
})

export default cloudinary
