import InputSearch from './ui/InputSearch'
import NavLink from './ui/NavLink'
import { PathsProtected, PathsPublic } from '../routes/pathConstants'
import { useAuth } from '../hooks/useAuth'
import Dropdown from './ui/Dropdown'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useSessionStore } from '../store/session'
import { useNotesforApprove } from '../hooks/useNotes'
import { IconLoginUser, IconUser } from './ui/Icons'
import { useRef, useState } from 'react'

export default function NavBar () {
  const { auth, logout } = useAuth()
  const logoutUser = useSessionStore(state => state.logoutUser)
  const { removeNotesForApprove } = useNotesforApprove()

  let pathsProtected = auth ? Object.values(PathsProtected) : []
  const location = useLocation()
  const navigate = useNavigate()

  const rol = useSessionStore(state => state.rol)

  pathsProtected = pathsProtected.filter(p => p.rol.includes(rol))

  const [isOpen, setIsOpen] = useState(false)
  const dropdownMenu = useRef(null)
  const dropdownUser = () => {
    setIsOpen(!isOpen)
    dropdownMenu.current.style = isOpen ? 'opacity: 0' : 'opacity: 1'
  }

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
                logoutUser()
                removeNotesForApprove()
                if (location.pathname !== '/') navigate('/')
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
      </nav>

      <div className="search w-full sm:w-72">
        <InputSearch />
      </div>
      <div className="user w-full sm:w-fit h-auto sm:h-20 relative">
        <div className='w-full h-full flex flex-row gap-3 items-center text-step1 sm:hidden'>
          {!auth
            ? <Link to={'/login'} className='flex flex-row gap-2 items-center px-2 py-3 w-full'> <IconLoginUser /> <span className='block sm:hidden'>Inicia sesion</span> </Link>
            : <div className='flex flex-col w-full'><button key='logout' onClick={() => {
              logout()
              logoutUser()
              removeNotesForApprove()
              if (location.pathname !== '/') navigate('/')
            }} className='hover:bg-secondary w-full text-left flex flex-row gap-2 items-center px-2 py-3 rounded-sm'>
              <IconUser /> Salir</button>
              <span className='px-2 py-1 text-right sm:text-left text-zinc-400 text-step0'>User </span></div>}
        </div>

        <button className='hidden sm:flex items-center hover:bg-secondary p-4 h-full' onClick={dropdownUser}>
          <IconUser />
        </button>

        <div ref={dropdownMenu}
          className="hidden w-full sm:absolute text-step0 min-w-60 sm:w-fit right-0 top-18 sm:flex flex-col rounded-sm opacity-0 bg-primary shadow-lg shadow-black border-b border-white">
          {
            auth
              ? (
              <div className='flex flex-col gap-1 text-step1'>
                <span className='truncate px-4 py-1 text-right text-step0 text-zinc-400'>User </span>
                <Link to={'/profile'} className='w-full h-full p-3 hover:bg-secondary'>
                  Perfil
                </Link>
                <button onClick={() => {
                  logout()
                  logoutUser()
                  removeNotesForApprove()
                  if (location.pathname !== '/') navigate('/')
                }} className='text-start p-3 hidden sm:block hover:bg-secondary'>
                  Salir
                </button>
              </div>
                )
              : <Link to={'/login'} className='flex flex-row gap-2 items-center px-2 py-3 w-full hover:bg-secondary'> <span>Inicia sesion</span> </Link>
          }
        </div>
      </div>
    </div>
  )
}
