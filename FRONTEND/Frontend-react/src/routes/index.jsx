/* eslint-disable react-refresh/only-export-components */
// https://semaphoreci.com/blog/routing-layer-react articulo de enrutamiento en react
import { lazy } from 'react'

import { PathsPublic, PathsProtected } from './pathConstants'
import Home from '../pages/Home'
// import Notes from '../pages/note/Notes'
const Notes = lazy(() => import('../pages/note/Notes')) // con lazy load tenemos la posibilidad de mandar parametros en las rutas para que ser carguen al enviar la URL

const Login = lazy(() => import('../pages/Login'))
// const Articles = lazy(() => import('../pages/Articles'))
const Profile = lazy(() => import('../pages/Profile'))
// const CreateNote = lazy(() => import('../pages/CreateNotes'))
const CreateNote = lazy(() => import('../pages/note/CreateNotes'))
const UpdateNote = lazy(() => import('../pages/note/UpdateNote'))
const Articles = lazy(() => import('../pages/articles/Articles'))
const ApproveNotes = lazy(() => import('../pages/articles/AprobeNote'))
const ReadNote = lazy(() => import('../pages/note/ReadNote'))

// ************************* PUBLIC ROUTES
const publicRoutes = [
  {
    path: PathsPublic.HOME.path,
    element: <Home />
  },
  {
    // path: PathsPublic.LOGIN.path,
    path: '/login',
    element: <Login />
  },
  {
    path: '/note/:id/:title',
    element: <ReadNote />
  }
]

// ************************* PROTECTED ROUTES
const protectedRoutes = [
  {
    path: PathsProtected.NOTE.routes.NOTES.path,
    element: <Notes />
  },
  {
    path: PathsProtected.NOTE.routes.CREATE_NOTE.path,
    element: <CreateNote />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  // Lo colocamos aqui para que no se muestre en el menu
  {
    path: '/update/:id',
    element: <UpdateNote />
  },
  {
    path: PathsProtected.ARTICLES.routes.ARTICLE.path,
    element: <Articles />
  },
  {
    path: PathsProtected.ARTICLES.routes.APPROVE_NOTE.path,
    element: <ApproveNotes />
  }

]

export {
  publicRoutes,
  protectedRoutes
}

/* const About = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import('../pages/About'))
    }, 1000)
  })
}) */
