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
  NOTES: {
    path: '/notes',
    name: 'Notas'
  },
  CREATE_NOTE: {
    path: '/create',
    name: 'Crear nota'
  },
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
