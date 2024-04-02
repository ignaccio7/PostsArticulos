import z from 'zod'

const notesSchema = z.object({
  usuario: z.number({ required_error: 'Ci is required' }).int().positive().min(5).max(99999999999),
  titulo: z.string().trim().min(10, { message: 'Title must be 10 or more characters long' }).max(30, { message: 'Title must be 30 characters long or fewer' }),
  tema: z.string().trim().min(10, { message: 'Theme must be 10 or more characters long' }).max(30, { message: 'Theme must be 30 characters long or fewer' }),
  descripcion: z.string().min(10, { message: 'Description must be 10 or more characters long' }),
  imagenes: z.string()
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
