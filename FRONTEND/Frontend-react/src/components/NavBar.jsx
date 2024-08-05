import InputSearch from './ui/InputSearch'
import NavLink from './ui/NavLink'
import { PathsProtected, PathsPublic } from '../routes/pathConstants'
import { useAuth } from '../hooks/useAuth'

export default function NavBar () {
  const { auth } = useAuth()
  const pathsProtected = auth ? Object.values(PathsProtected) : []

  return (
    <div className="nav hidden peer-checked:flex absolute top-28 flex-col gap-4 px-4 inset-x-0 mx-8 bg-primary py-4 rounded-md h-auto shadow-xl shadow-black
    sm:h-full sm:pl-0 sm:static sm:flex sm:flex-row sm:justify-between sm:flex-1 sm:ml-0 sm:mr-0 sm:bg-transparent sm:items-center sm:py-0 z-10 sm:shadow-none
    ">
      <nav className="navigation flex-1 flex flex-col items-center h-full
      sm:flex-row">
        {/* Public Routes  */}
        {
          Object.values(PathsPublic).map(route => (<NavLink key={route.path} to={route.path}>{route.name}</NavLink>))
        }
        {/* Protected Routes  */}
        {
          pathsProtected.map(route => (<NavLink key={route.path} to={route.path}>{route.name}</NavLink>))
        }
      </nav>

      <div className="search w-full sm:w-72">
        <InputSearch />
      </div>
    </div>
  )
}
