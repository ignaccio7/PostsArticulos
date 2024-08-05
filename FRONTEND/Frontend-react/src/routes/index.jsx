/* eslint-disable react-refresh/only-export-components */
// https://semaphoreci.com/blog/routing-layer-react articulo de enrutamiento en react
import { lazy } from 'react'

import { PathsPublic, PathsProtected } from './pathConstants'
import Home from '../pages/Home'
import Notes from '../pages/Notes'

const Login = lazy(() => import('../pages/Login'))
// const Articles = lazy(() => import('../pages/Articles'))
const Profile = lazy(() => import('../pages/Profile'))
// const CreateNote = lazy(() => import('../pages/CreateNotes'))
const CreateNote = lazy(() => import('../pages/CreateNotes'))

// ************************* PUBLIC ROUTES
const publicRoutes = [
  {
    path: PathsPublic.HOME.path,
    element: <Home />
  },
  {
    path: PathsPublic.LOGIN.path,
    element: <Login />
  }
]

// ************************* PROTECTED ROUTES
const protectedRoutes = [
  {
    path: PathsProtected.NOTES.path,
    element: <Notes />
  },
  // {
  //   path: PathsProtected.ARTICLES.path,
  //   element: <Articles />
  // },
  {
    path: PathsProtected.CREATE_NOTE.path,
    element: <CreateNote />
  },
  {
    path: PathsProtected.PROFILE.path,
    element: <Profile />
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
