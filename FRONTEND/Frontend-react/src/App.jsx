// import reactLogo from './assets/react.svg'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Layout from './Layouts/Layout'
import NotFound from './pages/404'
import { routes, protectedRoutes } from './routes'
import ProtectedRoute from './Layouts/ProtectedRoute'

function App () {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFound/>,
      children: [...routes,
        {
          element: <ProtectedRoute />,
          errorElement: <NotFound/>,
          children: protectedRoutes
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
