import NoteModel from '../models/note.js'
import { validateNote, validatePartialNote } from '../schemas/note.js'
import { deleteImages, uploadImages } from '../utils/utils.js'

import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

export default class NoteController {
  // Para obtener todos los resultados
  static async getAll(request, response) {
    try {
      const { titulo, tema, init, end, page, perPage = 5 } = request.query
      const results = await NoteModel.getAll({
        filters: { titulo, tema },
        fechaPost: { init, end },
        page,
        perPage,
      })

      const resultTotalPages = await NoteModel.getTotalPages({
        filters: { titulo, tema },
        fechaPost: { init, end },
      })
      const totalPages = Math.ceil(resultTotalPages.total_notas / perPage)

      if (results.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: 'No existen registros',
        })
        return
      }

      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: results,
        perPage,
        totalPages,
        page: page || '1',
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al solicitar datos en el gestor de Base de datos',
      })
    }
  }

  // Para obtener un resultado determinado por el id
  // static async getById (request, response) {
  //   try {
  //     const { id } = request.params
  //     const result = await NoteModel.getById({ id })

  //     if (result.length === 0) {
  //       response.status(404).json({
  //         statusCode: 404,
  //         message: 'No se encontro la nota'
  //       })
  //       return
  //     }
  //     response.json({
  //       statusCode: 200,
  //       message: 'Solicitud exitosa',
  //       data: result
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     response.json({
  //       statusCode: 500,
  //       message: 'Fallo al obtener la persona'
  //     })
  //   }
  // }
  static async getById(request, response) {
    try {
      const { id } = request.params
      const result = await NoteModel.getById({ id })

      if (result.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: 'No se encontro la nota',
        })
        return
      }

      console.log(result[0].jsonData)

      result[0].jsonData.forEach((element) => {
        if (element.tag === 'image') {
          delete element.content.imageId
        }
      })

      response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: result[0],
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        statusCode: 500,
        message: 'Fallo al obtener la nota',
      })
    }
  }

  // Automatizar para que solo enviando un parametro te de el nombre e imagen del usuario sin tener que crear otro metodo como lo haremos
  static async getNoteForRead(request, response) {
    try {
      const { id } = request.params
      const { idUser } = request
      console.log('El id es ', id)

      const result = await NoteModel.getNoteForRead({ idNote: id, idUser })
      console.log('La nota es : ', result)

      if (result.note.length === 0) {
        response.status(404).json({
          statusCode: 404,
          message: 'No se encontro la nota',
        })
        return
      }

      console.log(result.note[0].jsonData)

      result.note[0].jsonData.forEach((element) => {
        if (element.tag === 'image') {
          delete element.content.imageId
        }
      })

      response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: result,
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        statusCode: 500,
        message: 'Fallo al obtener la nota123',
      })
    }
  }

  // Para crear una nueva nota
  /* static async create (request, response) {
    const body = request.body
    const result = validateNote({ note: body })

    if (result.error) {
      return response.status(422).json({
        statusCode: 422,
        message: result
      })
    }

    try {
      const newNote = await NoteModel.createNote({ note: result.data })
      response.status(201).json({
        statusCode: 201,
        message: 'Nota creada',
        data: newNote
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al crear la nota'
      })
    }
  } */

  // Para crear una nueva nota - CON FORMDATA
  static async create(request, response) {
    const body = request.body
    const files = request.files
    console.log({ body })
    console.log({ files })

    // return response.json({
    //   ok: true
    // })

    // Para sanitizar el contenido recibido
    const window = new JSDOM('').window
    const DOMPurify = createDOMPurify(window)

    const { idUser } = request
    const note = { ...body }

    if (files?.length > 0) {
      note.imagenes = files
    }

    const result = validateNote({ note })

    if (result.error) {
      // sacando el 1er error
      const zodError = result?.error?.issues?.map((e) => e.message)[0] || 'Invalid fields'
      return response.status(422).json({
        statusCode: 422,
        message: zodError,
      })
    }

    if (files?.length > 0) {
      const resImages = await uploadImages({ files })
      console.log(resImages)
      // cambiar esta manera de recibir los parametros ya que podran subir multiples imagenes sera otro metodo
      // devuelve un array de objetos {image:url, imageId:cloudinary}
      result.data.imagenes = resImages
    } else {
      result.data.imagenes = []
    }

    // // <- este DESCOMENTAR TODO
    result.data.usuario_id_usuario = Number(idUser)
    // result.data.usuario_id_usuario = Number(1)

    // console.log('============RESULT DATA===========')
    // console.log(result.data)

    // parseamos los datos para almacenarlos en la db
    let numImage = 0
    const jsonDB = JSON.parse(result.data.order)
    jsonDB.forEach((element) => {
      if (element.tag === 'image') {
        element.content = result.data.imagenes[numImage]
        numImage++
      } else {
        if (element.tag === 'paragraph') {
          element.content = DOMPurify.sanitize(result.data[element.id])
        } else {
          element.content = result.data[element.id]
        }
      }
    })

    // console.log('================== el jsonDB es:')
    // console.log(jsonDB)
    result.data.jsonData = JSON.stringify(jsonDB)

    try {
      const newNote = await NoteModel.createNote({ note: result.data })
      response.status(201).json({
        statusCode: 201,
        message: 'Nota creada',
        data: newNote,
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        statusCode: 500,
        message: 'Fallo al crear la nota',
      })
    }
  }

  // Para eliminar una nota
  static async delete(request, response) {
    try {
      const { id } = request.params

      /** Estamos aumentando esta parte */
      console.log('1')

      const searchImages = await NoteModel.searchIdsImages({ idNota: id })
      console.log('2')

      if (searchImages.length > 0) {
        const idsImages = searchImages.flatMap((i) => i.image_id)
        await deleteImages({ publicImagesIds: idsImages })
      }
      console.log('3')

      /** Estamos aumentando esta parte */

      const result = await NoteModel.deleteNote({ id })
      if (result === false) {
        response.json({
          statusCode: 404,
          message: 'Nose ha encontrado la nota',
        })
        return
      }
      response.json({
        statusCode: 200,
        message: 'Nota eliminada',
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        statusCode: 500,
        message: error.message,
      })
    }
  }

  // Para modificar una nota
  /* static async update (request, response) {
    try {
      const partialNote = request.body
      console.log(partialNote)
      const result = validatePartialNote({ note: partialNote })
      console.log(result)
      if (result.error) {
        return response.status(422).json({
          statusCode: 422,
          message: result
        })
      }
      const { id } = request.params
      console.log('el id...................................' + id)
      const newNote = await NoteModel.updateNote({ id, partialNote })
      console.log(newNote)

      if (newNote === false) {
        return response.json({
          statusCode: 404,
          message: 'Nose ha encontrado la nota'
        })
      }

      response.json({
        statusCode: 200,
        message: 'Nota modificada',
        data: newNote[0]
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al modificar la nota'
      })
    }
  } */

  // Para modificar una nota - CON FORMDATA
  static async update(request, response) {
    try {
      const body = request.body
      const files = request.files
      const { idUser } = request

      const partialNote = { ...body }

      console.log('partial Note UPDATE')

      const window = new JSDOM('').window
      const DOMPurify = createDOMPurify(window)

      console.log({ files })
      console.log({ partialNote })
      console.log({ idUser })

      if (files?.length > 0) {
        partialNote.imagenes = files
      } else {
        // revisar si esta bien eliminar esas imagenes
        partialNote.imagenes = []
      }
      // if (body?.usuario_id_usuario) {
      //   partialNote.usuario_id_usuario = Number(body.usuario_id_usuario)
      // }

      console.log(partialNote)
      const result = validatePartialNote({ note: partialNote })
      if (result.error) {
        const zodError = result?.error?.issues?.map((e) => e.message)[0] || 'Invalid fields'
        return response.status(422).json({
          statusCode: 422,
          message: zodError,
        })
      }
      const { id } = request.params

      console.log({
        id,
        idUser,
        result,
      })

      // result.data.usuario_id_usuario = Number(idUser) VER PARA BORRAR ESTA LINEA

      // para eliminar las imagenes si modificaramos
      const imagesDB = await NoteModel.searchIdsImages({ idNota: id })
      console.log('el JSONDATA????????????? BASE DE DATOS')

      console.log(imagesDB)

      if (files?.length > 0) {
        const resImages = await uploadImages({ files })
        // cambiar esta manera de recibir los parametros ya que podran subir multiples imagenes sera otro metodo
        // devuelve un array de objetos {image:url, imageId:cloudinary}
        result.data.imagenes = resImages
      } else {
        result.data.imagenes = []
      }

      // parseamos los datos para almacenarlos en la db
      const imagesForDelete = []
      const imagesForSafe = []
      let numImage = 0
      const jsonDB = JSON.parse(result.data.order)
      jsonDB.forEach((element) => {
        if (element.tag === 'image') {
          // Si enviamos una nueva imagen no tendra el atributo content ya que llegara en files y lo almacenaremos de result.data.imagenes que mas arriba ya subimos al servidor de cloudinary
          if (element.content) {
            const searchImage = imagesDB.find((e) => e.image_url === element.content.image)
            element.content = { image: searchImage.image_url, imageId: searchImage.image_id }
            imagesForSafe.push(element.content)
          } else {
            element.content = result.data.imagenes[numImage]
            numImage++
          }
        } else {
          /*
          Como del frontend nos llega campos como ser :
            T1: 'como poner estilos usera',
            P1: 'primero debemos poner un',
            imagenes: 'https://res.cloudinary.com/dvwzkgnwj/image/upload/v1729042026/jdas6zuhkfosm6yvstbv.webp',
            ST1: 'como segundo paso',
            de esta manera almacenaremos el jsonData en la base de datos mediante el id en result.data
            Nota: el order -> jsonDB que llega es de la forma:  {"id":"T1","tag":"title","prevElement":null,"content":"<img src=x onerror=alert('yo te maldigo') />"} ....
            El atributo content al actualizar si tiene valor pero al crear es vacio por eso iteramos sobre este para almacenar lo que nos llega del frontend
          */
          if (element.tag === 'paragraph') {
            element.content = DOMPurify.sanitize(result.data[element.id])
          } else {
            element.content = result.data[element.id]
          }
        }
      })
      console.log(jsonDB)

      result.data.jsonData = JSON.stringify(jsonDB)

      console.log('======================IMAGE FOR SAFE')
      console.log(imagesForSafe)
      const sinUsar = 0

      // VEMOS SI DEBERIAMOS ELIMINAR ALGUNA IMAGEN DE CLOUDINARY -> filtramos las imagenes que no estan en el json recibido y las que no las almacenaremos para eliminar
      imagesDB.forEach((image) => {
        const isSafe = imagesForSafe.find((el) => el.image === image.image_url)
        if (!isSafe) imagesForDelete.push({ image: image.image_url, imageId: image.image_id })
      })
      const idsForDelete = imagesForDelete.flatMap((image) => image.imageId)
      // eliminamos las imagenes
      console.log('=====================IMAGE FOR DELETE')
      console.log(imagesForDelete)
      console.log(idsForDelete)

      if (idsForDelete.length > 0) await deleteImages({ publicImagesIds: idsForDelete })

      console.log('=====================RESULT DATA')
      console.log(result.data)

      const newNote = await NoteModel.updateNote({
        id,
        partialNote: {
          titulo: result.data.T1,
          descripcion: result.data.P1,
          jsonData: result.data.jsonData,
        },
      })
      console.log(newNote)

      // Sinitizamos la respuesta al cliente sin el imageID
      newNote[0].jsonData.forEach((element) => {
        if (element.tag === 'image') {
          delete element.content.imageId
        }
      })

      if (newNote === false) {
        return response.json({
          statusCode: 404,
          message: 'Nose ha encontrado la nota',
        })
      }

      response.json({
        statusCode: 200,
        message: 'Nota modificada',
        data: newNote[0],
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al modificar la nota',
      })
    }
  }

  static async getNotesByUser(request, response) {
    try {
      const { idUser } = request
      const { titulo, tema, init, end, page, perPage = 5 } = request.query
      const results = await NoteModel.getNotesByUser({
        filters: { titulo, tema },
        fechaPost: { init, end },
        page,
        idUser,
        perPage,
      })

      const resultTotalPages = await NoteModel.getTotalPagesByUser({
        filters: { titulo, tema },
        fechaPost: { init, end },
        idUser,
      })
      const totalPages = Math.ceil(resultTotalPages.total_notas / perPage)

      console.log({ resultTotalPages })
      console.log({ totalPages })

      console.log(results)

      return response.json({
        statusCode: 200,
        message: 'Solicitud exitosa',
        data: results,
        perPage,
        totalPages,
        page: page || '1',
      })
    } catch (error) {
      console.log(error)
      response.json({
        statusCode: 500,
        message: 'Fallo al solicitar datos en el gestor de Base de datos',
      })
    }
  }
}
