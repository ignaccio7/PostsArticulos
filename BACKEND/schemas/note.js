import z from 'zod'

// eslint-disable-next-line prefer-regex-literals
const typeImage = new RegExp(/image\/(jpeg|jpg|png|webp)$/)
const ImageSchema = z.object({
  mimetype: z.string().regex(typeImage, 'Invalid type').optional()
}).array()

const baseNoteSchema = z.object({
  // usuario_id_usuario: z.number({ required_error: 'Ci is required' }).int().positive().min(1).max(99999999999),
  T1: z.string().trim().min(10, { message: 'Title must be 10 or more characters long' }).max(50, { message: 'Title must be 50 characters long or fewer' }),
  // tema: z.string().trim().min(10, { message: 'Theme must be 10 or more characters long' }).max(30, { message: 'Theme must be 30 characters long or fewer' }),
  P1: z.string().min(10, { message: 'Description must be 10 or more characters long' }).max(100, { message: 'Description must be 100 characters long or fewer' }),
  order: z.string().min(1, { message: 'Debe agregar por lo menos un campo' })
})

// Extiende baseNoteSchema con campos opcionales y dinámicos
const notesSchema = baseNoteSchema.passthrough().extend({
  imagenes: ImageSchema.optional()
})

function validateNote ({ note }) {
  return notesSchema.safeParse(note)
}

function validatePartialNote ({ note }) {
  return notesSchema.partial().safeParse(note)
}

export {
  validateNote,
  validatePartialNote
}
