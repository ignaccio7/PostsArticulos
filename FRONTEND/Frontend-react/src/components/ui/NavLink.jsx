import { Link } from 'react-router-dom'

export default function NavLink ({ to, children }) {
  return (
    <Link to={to} className='w-full sm:h-full h-auto block sm:grid place-content-center cursor-pointer text-left hover:bg-secondary p-4 rounded-md sm:w-auto'>
      {children}
    </Link>
  )
}
