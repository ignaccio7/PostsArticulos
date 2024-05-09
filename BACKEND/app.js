import { readJSON } from './utils/utils.js'
import logger from 'morgan'
import express, { json } from 'express'
import config from './config.js'
import { routerPerson } from './routes/person.js'
import { routerUser } from './routes/user.js'
// import { corsMiddleware, handleErrorCors } from './middlewares/cors.js'
import { corsMiddleware } from './middlewares/cors.js'
import { handleErrors } from './middlewares/handleErrors.js'
import { routerNote } from './routes/note.js'
const pkg = readJSON('./package.json')

const app = express()

app.use(json())

app.use(logger('dev'))

app.use(corsMiddleware())

app.set('pkg', pkg)
app.set('port', config.port)
app.set('host', config.host)

app.get('/', (request, response) => {
  response.status(200).json({
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version,
    name: app.get('pkg').name
  })
})

// Para la persona
app.use('/person', routerPerson)
// Para el usuario
app.use('/user', routerUser)
// Para la nota
app.use('/note', routerNote)

app.use('/', (request, response) => {
  response.send('<h1>404</h1>')
})

// Manejo de errores
app.use(handleErrors)

app.listen(app.get('port'), () => {
  console.log(`Server listening on port: http://${app.get('host')}:${app.get('port')}`)
})
