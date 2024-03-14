import z from 'zod'

// const passExpReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,20}$/)
// eslint-disable-next-line prefer-regex-literals
const passExpReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ])*$/)
// eslint-disable-next-line prefer-regex-literals
const userExpReg = new RegExp(/^[a-zA-Z0-9-_]+$/)
/**
 * ^ inicio de la cadena
 * + uno o mas caracteres
 * $ fin de la cadena
 */

const userSchema = z.object({
  usuario: z.string({
    required_error: 'Usuario is required',
    invalid_type_error: 'Usuario must be a string'
  }).max(15, {
    message: 'User must be 15 or fever characters to long'
  }).min(5, {
    message: 'User must be 5 or more chararcters to long'
  })
    .regex(userExpReg, {
      message: 'The usuario must be inclues: capital letter, lowercase letter, numbers and characters -_'
    }),
  pass: z.string().max(20, {
    message: 'Pass must be 20 of fewer characters long'
  }).min(8, {
    message: 'Pass must be 8 or more chararcters to long'
  }).regex(passExpReg, {
    message: 'The pass must be includes: special character, capital letter, lowercase letter and number'
  })
})

function validateUser ({ user }) {
  return userSchema.safeParse(user)
}

function validatePartialUser ({ user }) {
  return userSchema.partial().safeParse(user)
}

export {
  validateUser,
  validatePartialUser
}
