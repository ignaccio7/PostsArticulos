const PathsPublic = {
  HOME: {
    path: '/',
    name: 'Inicio'
  },
  LOGIN: {
    path: '/login',
    name: 'Acceder'
  }
}

const PathsProtected = {
  NOTE: {
    name: 'Notas',
    path: '/dropdown',
    routes: {
      NOTES: {
        path: '/notes',
        name: 'Mis Notas'
      },
      CREATE_NOTE: {
        path: '/create',
        name: 'Crear Nota'
      }
    }
  },
  // ARTICLES: {
  //   name: 'Articulos',
  //   path: '/dropdown',
  //   routes: {
  //     ARTICLE: {
  //       path: '/articles',
  //       name: 'Mis Articulos'
  //     },
  //     CREATE_NOTE: {
  //       path: '/create',
  //       name: 'Crear Articulo'
  //     }
  //   }
  // },
  // ARTICLES: {
  //   path: '/articles',
  //   name: 'Articulos'
  // },
  PROFILE: {
    path: '/profile',
    name: 'Perfil'
  }
}

export {
  PathsPublic,
  PathsProtected
}
