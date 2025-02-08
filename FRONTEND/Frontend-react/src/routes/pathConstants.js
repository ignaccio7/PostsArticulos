const PathsPublic = {
  HOME: {
    path: '/',
    name: 'Inicio'
  }
  // LOGIN: {
  //   path: '/login',
  //   name: 'Acceder'
  // }
}

const PathsProtected = {
  NOTE: {
    name: 'Notas',
    path: '/dropdown',
    rol: 'user|admin',
    routes: {
      NOTES: {
        path: '/notes',
        name: 'Mis Notas'
      },
      CREATE_NOTE: {
        path: '/create',
        name: 'Crear Nota'
      }
      // TODO: terminar la vista de leer nota, crear una para leer articulo, que en aprrovenote salga cuantas notas aprobara ver como hacer eso
      // No lo colocamos aqui ya que sino se mostrara en el menu
      // Existe la ruta para actualizar una nota pero solo accederas a ella via url o desde el listado de notas
      // UPDATE_NOTE: {
      //   path: '/update/:id',
      //   name: 'Actualizar Nota'
      // }
    }
  },
  // PROFILE: {
  //   path: '/profile',
  //   name: 'Perfil',
  //   rol: 'user|admin'
  // },
  ARTICLES: {
    name: 'Articulos',
    path: '/dropdown',
    rol: 'admin',
    routes: {
      ARTICLE: {
        path: '/articles',
        name: 'Mis Articulos'
      },
      APPROVE_NOTE: {
        path: '/approve',
        name: 'Aprobar Nota'
      }
    }
  }
}

export {
  PathsPublic,
  PathsProtected
}
