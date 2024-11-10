import { IconDropdown } from './Icons'
import NavLink from './NavLink'

export default function Dropdown ({ path, name, routes }) {
  return (
    <label
      htmlFor={`dropdownButton-${name}`}
      className='dropdownMenu text-step1 cursor-pointer hover:bg-secondary h-full w-full text-left
        sm:w-auto sm:flex sm:relative'
    >
      <input type="checkbox" id={`dropdownButton-${name}`} className='peer hidden' />
      <span className='flex items-center gap-2 justify-between w-full sm:w-auto peer-checked:bg-secondary p-4'>
        {name}
        <IconDropdown />
      </span>
      <div className="dropdownSubMenu hidden peer-checked:flex flex-col text-left
          sm:absolute sm:top-28 sm:left-0 sm:bg-secondary sm:z-40
          sm:shadow-lg sm:shadow-black
          sm:peer-checked:border-b ">
        {
          Object.values(routes).map(r => {
            return (
              <NavLink className='sm:w-[120px]' key={r.path} to={r.path}>
                <span className='w-max'>{r.name}</span>
              </NavLink>
            )
          })
        }
      </div>
    </label>
  )
}
