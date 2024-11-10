import InputSearch from './ui/InputSearch'
import NavLink from './ui/NavLink'
import { PathsProtected, PathsPublic } from '../routes/pathConstants'
import { useAuth } from '../hooks/useAuth'
import Dropdown from './ui/Dropdown'
import { useNavigate } from 'react-router-dom'

export default function NavBar () {
  const { auth, logout } = useAuth()
  const pathsProtected = auth ? Object.values(PathsProtected) : []
  const navigate = useNavigate()

  return (
    <div className="nav hidden peer-checked:flex absolute top-28 flex-col gap-4 px-4 inset-x-0 mx-8 bg-primary py-4 rounded-md h-auto shadow-xl shadow-black
    sm:h-full sm:pl-0 sm:static sm:flex sm:flex-row sm:justify-between sm:flex-1 sm:ml-0 sm:mr-0 sm:bg-transparent sm:items-center sm:py-0 z-10 sm:shadow-none
    ">
      <nav className="navigation flex-1 flex flex-col items-center h-full
      sm:flex-row">
        {/* Public Routes  */}
        {
          Object.values(PathsPublic).map(route => {
            if (route.path === '/login' && auth) {
              return <button key='logout' onClick={() => {
                logout()
                navigate('/')
              }} className='text-step1 hover:bg-secondary p-4 rounded-md sm:w-auto h-full w-full text-left order-4'>Salir</button>
            }
            return (<NavLink key={route.path} to={route.path}>{route.name}</NavLink>)
          })
        }
        {/* Protected Routes  */}
        {
          // pathsProtected.map(route => (<NavLink key={route.path} to={route.path}>{route.name}</NavLink>))
          pathsProtected.map(route => {
            if (route.path === '/dropdown') {
              return (
                <Dropdown key={`${route.path}-${route.name}`} path={route.path} name={route.name} routes={route.routes} />
              )
            }
            return (<NavLink key={route.path} to={route.path}>{route.name}</NavLink>)
          })
        }

        {/* Dropdown Menu */}
        {/* <label
          htmlFor='dropdownButton'
          className='dropdownMenu text-step1 cursor-pointer hover:bg-secondary h-full w-full text-left
          sm:w-auto sm:flex sm:relative'
        >
          <input type="checkbox" id='dropdownButton' className='peer hidden' />
          <span className='flex items-center w-full sm:w-auto peer-checked:bg-secondary p-4'>Notas</span>
          <div className="dropdownSubMenu hidden peer-checked:flex flex-col text-left
          sm:absolute sm:top-28 sm:left-0 sm:bg-secondary sm:z-40
          sm:shadow-lg sm:shadow-black
          sm:peer-checked:border-b ">
            <NavLink className='sm:w-[120px]' to='/notes2'>Crear Nota</NavLink>
            <NavLink className='sm:w-[120px]' to='/notes2'>Mis Notas</NavLink>
          </div>
        </label> */}
      </nav>

      <div className="search w-full sm:w-72">
        <InputSearch />
      </div>
    </div>
  )
}
