import app from './app.js'
import { closeDatabase, testConnection } from './models/connection.js'

const PORT = app.get('port')
const HOST = app.get('host')

async function startServer() {
  try {
    const dbConnection = await testConnection()
    if (!dbConnection) {
      console.error('❌ No se pudo conectar a la base de datos')
      process.exit(1)
    }

    const server = app.listen(app.get('port'), () => {
      console.log(`🚀 Server listening on: http://${HOST}:${PORT}`)
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    const gracefulShutdown = async (signal) => {
      console.log(`\n📡 ${signal} recibido, cerrando servidor...`)
      server.close(async () => {
        console.log('🛑 Servidor HTTP cerrado')
        await closeDatabase()
        console.log('✅ Aplicación cerrada correctamente')
        process.exit(0)
      })

      setTimeout(() => {
        console.error('❌ Forzando cierre de aplicación')
        process.exit(1)
      }, 5000)
    }

    // ✅ Escuchar señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // ✅ Manejar errores no capturados
    process.on('unhandledRejection', (err) => {
      console.error('❌ Error no capturado:', err)
      gracefulShutdown('UNHANDLED_REJECTION')
    })
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error)
    process.exit(1)
  }
}

startServer()
