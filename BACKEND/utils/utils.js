import path from 'node:path'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import cloudinary from '../libs/cloudinary.js'
const require = createRequire(import.meta.url)
export const readJSON = (p) => require(path.join(process.cwd(), p))

export function getFilters ({ filters, fechaPost }) {
  let sql = ''; const values = []

  Object.entries(filters).forEach(([a, b]) => {
    if (b) {
      sql += ` AND n.${a} LIKE ?`
      values.push(`%${b}%`)
    }
  })

  if (fechaPost.init && fechaPost.end) {
    sql += ' AND fechaPost BETWEEN ? AND ?'
    values.push(fechaPost.init)
    values.push(fechaPost.end)
  }

  return { sql, values }
}
/** ********************************** CLOUDINARY SERVICE  */

// upload avatar
export async function uploadImage ({ file }) {
  /**
 * Information for file
  file: {
      fieldname: 'avatar',
      originalname: 'luffy.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'images/',
      filename: '86d94d8cd2d2f919f74fe0c3e1368262',
      path: 'images\86d94d8cd2d2f919f74fe0c3e1368262',
      size: 135808
    }
    * Information response success upload image to cloudinary
    {
      asset_id: '591147f397930b29df8589586c485e5d',
      public_id: 'sxebfrywjeoodhtkqxjs',
      version: 1715476976,
      version_id: '130e0d797edc88c46c7f83dbf900743b',
      signature: '21c79913609248c7b798641dcafb6fd27bd2a293',
      width: 736,
      height: 974,
      format: 'jpg',
      resource_type: 'image',
      created_at: '2024-05-12T01:22:56Z',
      tags: [],
      bytes: 135808,
      type: 'upload',
      etag: '75aef47f4ee8a4523270beda89f7fc0d',
      placeholder: false,
      url: 'http://res.cloudinary.com/dvwzkgnwj/image/upload/v1715476976/sxebfrywjeoodhtkqxjs.jpg',
      secure_url: 'https://res.cloudinary.com/dvwzkgnwj/image/upload/v1715476976/sxebfrywjeoodhtkqxjs.jpg',
      folder: '',
      original_filename: 'f34f95decea3d5ba0c46a819cf856868',
      api_key: '528674611683955'
    }
 */
  let filePath
  try {
    filePath = path.join(process.cwd(), file.destination, file.filename)
    const resCloud = await cloudinary.uploader.upload(filePath)
    return { avatar: resCloud.secure_url, avatarId: resCloud.public_id }
  } catch (error) {
    console.log(error)
    throw new Error('Error al subir la imagen')
  } finally {
    if (filePath) await fs.unlink(filePath)
  }
}

export async function deleteImage ({ publicId }) {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.log(error)
    throw new Error('Error al eliminar la la imagen')
  }
}

// upload notes
export async function uploadImages ({ files }) {
  /**
 * Information for file
  file: {
      fieldname: 'avatar',
      originalname: 'luffy.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'images/',
      filename: '86d94d8cd2d2f919f74fe0c3e1368262',
      path: 'images\86d94d8cd2d2f919f74fe0c3e1368262',
      size: 135808
    }
    * Information response success upload image to cloudinary
    {
      asset_id: '591147f397930b29df8589586c485e5d',
      public_id: 'sxebfrywjeoodhtkqxjs',
      version: 1715476976,
      version_id: '130e0d797edc88c46c7f83dbf900743b',
      signature: '21c79913609248c7b798641dcafb6fd27bd2a293',
      width: 736,
      height: 974,
      format: 'jpg',
      resource_type: 'image',
      created_at: '2024-05-12T01:22:56Z',
      tags: [],
      bytes: 135808,
      type: 'upload',
      etag: '75aef47f4ee8a4523270beda89f7fc0d',
      placeholder: false,
      url: 'http://res.cloudinary.com/dvwzkgnwj/image/upload/v1715476976/sxebfrywjeoodhtkqxjs.jpg',
      secure_url: 'https://res.cloudinary.com/dvwzkgnwj/image/upload/v1715476976/sxebfrywjeoodhtkqxjs.jpg',
      folder: '',
      original_filename: 'f34f95decea3d5ba0c46a819cf856868',
      api_key: '528674611683955'
    }
 */
  // console.log({ files })
  let filePath
  const filesPaths = []
  try {
    const promisesImages = files.map(async (file) => {
      filePath = path.join(process.cwd(), file.destination, file.filename)
      filesPaths.push(filePath)
      const resCloud = await cloudinary.uploader.upload(filePath)
      return { image: resCloud.secure_url, imageId: resCloud.public_id }
    })
    const responseImages = await Promise.all(promisesImages)
    return responseImages
  } catch (error) {
    console.log(error)
    throw new Error('Error al subir las imagenes')
  } finally {
    // if (filePath) await fs.unlink(filePath)
    if (filesPaths.length > 0) filesPaths.forEach(async (f) => await fs.unlink(f))
  }
}

export async function deleteImages ({ publicImagesIds = [] }) {
  try {
    console.log(publicImagesIds)

    const promisesImages = publicImagesIds.map(async (publicId) => {
      await cloudinary.uploader.destroy(publicId)
    })
    await Promise.all(promisesImages)
    return true
  } catch (error) {
    console.log(error)
    throw new Error('Error al eliminar las imagenes')
  }
}
