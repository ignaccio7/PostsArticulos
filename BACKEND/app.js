import { readJSON } from './utils/utils.js'
import logger from 'morgan'
import express, { json } from 'express'
import config from './config.js'
import { routerPerson } from './routes/person.js'
const pkg = readJSON('./package.json')

const app = express()

app.use(json())

app.use(logger('dev'))

app.set('pkg', pkg)
app.set('port', config.port)
app.set('host', config.host)

app.get('/', (request, response) => {
  response.json({
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version,
    name: app.get('pkg').name
  })
})

// Para la persona
app.use('/person', routerPerson)

app.use('/', (request, response) => {
  response.send('<h1>404</h1>')
})

app.listen(app.get('port'), () => {
  console.log(`Server listening on port: http://${app.get('host')}:${app.get('port')}`)
})
