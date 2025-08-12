import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import { IconHamburguer } from './ui/Icons'

export default function Header () {
  return (
    <header className="bg-primary h-28 z-50 ">
      <div className="container h-full flex flex-row justify-between items-center">
        <Link className="logo w-28 h-auto flex-shrink-0" to="/">
          {/* <img src="./logo.png" alt="" className="mix-blend-lighten" /> */}
          <img src="/logo_sin_fondo.webp" alt="" className="w-full h-auto aspect-square" />
        </Link>

        <label htmlFor="menu" className="sm:hidden cursor-pointer">
          <IconHamburguer />
        </label>
        <input type="checkbox" id="menu" className="peer hidden" />

        <NavBar />
      </div>
    </header>
  )
}
