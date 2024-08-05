// import reactLogo from './assets/react.svg'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Layout from './Layouts/Layout'
import NotFound from './pages/404'
import { publicRoutes, protectedRoutes } from './routes'
import ProtectedRoute from './Layouts/ProtectedRoute'

function App () {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFound />,
      children: [...publicRoutes,
        {
          element: <ProtectedRoute />,
          errorElement: <NotFound />,
          children: protectedRoutes
        }
      ]
    }
  ])

  return (
    <>
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      <RouterProvider router={router} />
    </>
  )
}

export default App
