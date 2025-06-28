import multer from 'multer'

export const upload = multer({
  dest: 'images/',
  //fileFilter: (req, file, cb) => {
  fileFilter: (_, file, cb) => {
    const validMIMEType = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif']
    if (validMIMEType.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('InvalidTypeMulter'))
    }
  },
})
