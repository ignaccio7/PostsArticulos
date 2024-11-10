import { useLocation, Link } from 'react-router-dom'

export default function NavLink ({ to, children, className = '' }) {
  const location = useLocation()
  const pathName = location.pathname

  return (
    <Link to={to} className={`${pathName === to ? 'bg-secondary' : ''} 
      ${className}
      w-full sm:h-full h-auto block sm:grid place-content-center cursor-pointer bg-primary
      text-left hover:bg-secondary p-4 rounded-md sm:w-auto`}>
      {children}
    </Link>
  )
}
