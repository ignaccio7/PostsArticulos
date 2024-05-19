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
import { routerArticle } from './routes/article.js'
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
// Para los articulos
app.use('/article', routerArticle)

app.use('/', (request, response) => {
  response.send(`
  <h1>Not Found</h1>
  <hr/>
  <p>HTTP Error 404. The request resource is not found.</p>
  <img src="https://midu.dev/images/this-is-fine-404.gif" alt="Image of this is fine"/>
`)
})

// Manejo de errores
app.use(handleErrors)

app.listen(app.get('port'), () => {
  console.log(`Server listening on port: http://${app.get('host')}:${app.get('port')}`)
})
