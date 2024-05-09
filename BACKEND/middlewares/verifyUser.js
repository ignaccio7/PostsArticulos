// Para verificar el tipo de usuario
export function verifyIsAdmin (request, _, next) {
  try {
    const { typeUser } = request
    if (typeUser !== 'admin') {
      throw new Error('Not permission allowed')
    }
    next()
  } catch (error) {
    next(error)
  }
}
