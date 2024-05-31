import z from 'zod'
// Nos serviran para las validaciones

// eslint-disable-next-line prefer-regex-literals
const phoneNumber = new RegExp(/^(591)?[2-9]\d{7}$/)
// eslint-disable-next-line prefer-regex-literals
const typeImage = new RegExp(/image\/(jpeg|jpg|png|webp)$/)
const AvatarSchema = z.object({
  mimetype: z.string().regex(typeImage, 'Invalid type').optional()
})

const personSchema = z.object({
  ci: z.number({ required_error: 'Ci is required' }).int().positive().min(5).max(99999999999),
  nombres: z.string().trim().min(3, { message: 'Nombres must be 3 or more characters long' }),
  paterno: z.string().trim().min(3, { message: 'Ap. Paterno must be 3 or more characters long' }),
  materno: z.string().trim().min(3, { message: 'Ap. Materno must be 3 or more characters long' }),
  telefono: z.string().regex(phoneNumber, 'Invalid number, the number must be container 8 characters').min(8, { message: 'Telefono must be 8 or more characters long' }),
  correo: z.string().email({ message: 'Invalid email address' }),
  avatar: AvatarSchema.optional()
  // avatar: z.optional().object({
  //   mimetype: z.string().regex(typeImage, 'Invalid type')
  // })
})

// para validar la creacion de la persona POST
function validatePerson ({ person }) {
  return personSchema.safeParse(person)
}

// para validar parcialmente el esquema de persona PUT o PATCH
function validatePartialPerson ({ person }) {
  return personSchema.partial().omit({ ci: true }).safeParse(person)
}

export {
  validatePerson,
  validatePartialPerson
}
