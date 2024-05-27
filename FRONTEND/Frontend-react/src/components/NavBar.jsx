import InputSearch from './ui/InputSearch'
import NavLink from './ui/NavLink'

export default function NavBar () {
  return (
    <div className="nav hidden peer-checked:flex absolute top-28 flex-col gap-4 px-4 inset-x-0 mx-8 bg-primary py-4 rounded-md h-auto sm:h-full
    sm:static sm:flex sm:flex-row sm:justify-between sm:flex-1 sm:ml-0 sm:mr-0 sm:bg-transparent sm:items-center sm:py-0 z-10
    ">
      <nav className="navigation flex-1 flex flex-col items-center h-full
      sm:flex-row">
        <NavLink to="/">Articulos</NavLink>
        <NavLink to="/about">Notas</NavLink>
        <NavLink to="/notes">Perfil</NavLink>
        <NavLink to="/notes">Inicio de Sesion</NavLink>
      </nav>

      <div className="search w-full sm:w-72">
        <InputSearch />
      </div>
    </div>
  )
}
