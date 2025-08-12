import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:1234',
  'http://localhost:3000',
  'http://localhost:4321',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://midominio.com',
  'https://midominio.com',
  'https://techtricks-blogpost.netlify.app/',
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      // console.log('El origen es', origin)
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        // este es en caso de que solicitemos del mismo dominio ya que envia undefined
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORSa'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
}
