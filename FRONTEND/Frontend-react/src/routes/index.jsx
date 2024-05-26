// https://semaphoreci.com/blog/routing-layer-react articulo de enrutamiento en react
import { lazy } from 'react'

import PathConstants from './pathConstants'
import Home from '../pages/Home'
import Notes from '../pages/Notes'

const About = lazy(() => import('../pages/About'))

// ************************* PUBLIC ROUTES
const routes = [
  {
    path: PathConstants.HOME,
    element: <Home />
  },
  {
    path: PathConstants.ABOUT,
    element: <About />
  }
]

// ************************* PROTECTED ROUTES
const protectedRoutes = [
  {
    path: PathConstants.NOTES,
    element: <Notes />
  }
]

export {
  routes,
  protectedRoutes
}

/* const About = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import('../pages/About'))
    }, 1000)
  })
}) */
