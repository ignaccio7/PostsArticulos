import NavBar from './NavBar'
import { IconHamburguer } from './ui/Icons'

export default function Header () {
  return (
    <header className="bg-primary flex flex-row justify-between items-center px-8 max-w-[1280px] m-auto h-28 z-50 overflow-hidden">
      <div className="logo w-28 h-auto">
        <img src="./logo.png" alt="" className='mix-blend-lighten' />
      </div>

      <label htmlFor="menu" className="sm:hidden cursor-pointer">
        <IconHamburguer />
      </label>
      <input type="checkbox" id="menu" className="peer hidden" />

      <NavBar />
    </header>
  )
}
