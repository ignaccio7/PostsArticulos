
import './App.css'

function App() {

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    formData.append('paterno', 'paterno')
    formData.append('materno', 'materno')
    formData.append('telefono', '75209039')
    formData.append('correo', 'correo@gmail.com')
    // const { ci, nombres, avatar } = Object.fromEntries(formData)
    // const formData = new FormData()
    // console.log(formData);
    // formData.append('ci', event.target.ci.value )
    // console.log(formData);
    fetch('http://localhost:1234/person', {
      method: 'post',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        /** RESPONSE WITH MULTER
         *  {
    message: 'abc',
    body: {
      ci: '13123132',
      nombres: 'asdasda asdad',
      paterno: 'paterno',
      materno: 'materno',
      telefono: 'telefono',
      correo: 'correo@gmail.com'
    },
    file: {
      fieldname: 'avatar',
      originalname: 'luffy.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'images/',
      filename: '86d94d8cd2d2f919f74fe0c3e1368262',
      path: 'images\86d94d8cd2d2f919f74fe0c3e1368262',
      size: 135808
    }
  }
         */
      })
  }
  /** -> PERSON
   * "ci" : 10918761,
  "nombres" : "Nestor",
  "paterno" : "Rojas",
  "materno" : "Guarachi",
  "telefono" : "75209039",
  "correo" : "nr@gmail.com",
  "avatar" : "avatarnr"
   */
  /** -> USER
  {
    "person":{
      "ci" : 10918764,
      "nombres" : "Nestor",
      "paterno" : "Rojas",
      "materno" : "Guarachi",
      "telefono" : "75209039",
      "correo" : "nr@gmail.com",
      "avatar" : "avatarnr"
    },
    "user":{
      "usuario":"ignaccio7",
      "pass":"260298nesigABC+-*",
      "rol":"admin"
    }
  }
  */

  const handleSubmitUser = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    formData.append('paterno', 'paterno')
    formData.append('materno', 'materno')
    formData.append('telefono', '75209039')
    formData.append('correo', 'correo@gmail.com')

    formData.append('pass', '260298nesigABC+-*')
    formData.append('rol', 'user')
    // const { ci, nombres, avatar } = Object.fromEntries(formData)
    // const formData = new FormData()
    // console.log(formData);
    // formData.append('ci', event.target.ci.value )
    // console.log(formData);
    fetch('http://localhost:1234/user', {
      method: 'post',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        /** RESPONSE WITH MULTER */
      })
  }

  const handleUpdatePerson = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    // const { ci, nombres, avatar } = Object.fromEntries(formData)
    // const formData = new FormData()
    // console.log(formData);
    // formData.append('ci', event.target.ci.value )
    // console.log(formData);
    fetch('http://localhost:1234/person/'+event.target.ci.value, {
      method: 'PATCH',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }

  return (
    <main>
      <h1>Person</h1>
      <h2>Register Person</h2>
      <form onSubmit={handleSubmit} method='post' encType="multipart/form-data">
        <input type="text" name='ci' placeholder='ci' /> <br />
        <input type="text" name='nombres' placeholder='nombres' /> <br />
        <input type="file" name='avatar' /> <br />
        <button>Enviar</button>
      </form>
      <h2>Register User</h2>
      <form onSubmit={handleSubmitUser} method='post' encType="multipart/form-data">
        <input type="text" name='ci' placeholder='ci' /> <br />
        <input type="text" name='nombres' placeholder='nombres' /> <br />
        <input type="text" name='usuario' placeholder='user' /> <br />
        <input type="file" name='avatar' /> <br />
        <button>Enviar</button>
      </form>
      <h2>Update Person</h2>
      <form onSubmit={handleUpdatePerson} method='post' encType="multipart/form-data">
        <input type="text" name='ci' placeholder='ci' /> <br />
        <input type="text" name='nombres' placeholder='nombres' /> <br />
        <input type="file" name='avatar' /> <br />
        <button>Enviar</button>
      </form>
    </main>
  )
}

export default App
