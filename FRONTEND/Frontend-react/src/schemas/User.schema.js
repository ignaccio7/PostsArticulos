import { z } from 'zod'

// eslint-disable-next-line prefer-regex-literals
const passExpReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ])*$/)
// eslint-disable-next-line prefer-regex-literals
const typeImage = new RegExp(/image\/(jpeg|jpg|png|webp)$/)

const MAX_FILE_SIZE = 2000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]
const AvatarSchema = z.any().optional()
  // eslint-disable-next-line eqeqeq
  .refine(file => file.length == 1 ? !!ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) : true, 'Invalid file. choose either JPEG or PNG image')
  // eslint-disable-next-line eqeqeq
  .refine(file => file.length == 1 ? file[0]?.size <= MAX_FILE_SIZE : true, 'Max file size allowed is 8MB.')
// eslint-disable-next-line prefer-regex-literals
const phoneNumber = new RegExp(/^[2-9]/)

const registerSchema = z.object({
  usuario: z.string({ required_error: 'Usuario requerido' })
    .max(15, { message: '15 caracteres como maximo' })
    .min(5, { message: '5 caracteres como minimo' }),
  password: z.string().max(20, {
    message: '20 caracteres como maximo'
  }).min(8, {
    message: '8 caracteres como minimo'
  }).regex(passExpReg, {
    message: 'Debe incluir: num,simb,may,min'
  }),
  ci: z.string({ required_error: 'Cedula es requerido' }).min(5, { message: '5 caracteres como maximo' }).max(11, { message: '11 caracteres como maximo' }),
  nombres: z.string({ message: 'Nombre es requerido' }).trim().min(3, { message: '3 caracteres como minimo' }).max(30, { message: '30 caracteres como maximo' }),
  paterno: z.string().trim().min(3, { message: '3 caracteres como minimo' }).max(30, { message: '30 caracteres como maximo' }),
  materno: z.string().trim().min(3, { message: '3 caracteres como minimo' }).max(30, { message: '30 caracteres como maximo' }),
  telefono: z.string().regex(phoneNumber, 'No puede iniciar con 0 o 1').length(8, { message: '8 numeros como longitud' }),
  correo: z.string().email({ message: 'Email invalido' }),
  avatar: AvatarSchema.optional({ type_error: 'Solo archivos jpeg|jpg|png|webp' })
})

const partialRegisterSchema = registerSchema.omit({
  ci: true,
  usuario: true,
  password: true
})

export {
  registerSchema,
  partialRegisterSchema
}
