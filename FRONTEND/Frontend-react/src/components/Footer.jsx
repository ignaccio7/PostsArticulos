import { Link } from 'react-router-dom'
import { IconFacebook, IconGithub, IconTwitter } from './ui/Icons'
import { PathsPublic } from '../routes/pathConstants'

export default function Footer () {
  return (
    // https://devdevout.com/css/css-footers
    <footer className="bg-primary text-center text-white/65 flex flex-col gap-4 py-8">
      <div className="social flex gap-4 justify-center">
        <IconFacebook className="hover:transform hover:scale-125 transition duration-200 cursor-pointer" />
        <IconGithub className="hover:transform hover:scale-125 transition duration-200 cursor-pointer" />
        <IconTwitter className="hover:transform hover:scale-125 transition duration-200 cursor-pointer" />
      </div>
      <div className="nav flex gap-4 justify-center items-center">
        {Object.values(PathsPublic).map(route => (<Link key={route.path} to={route.path}>{route.name}</Link>))}
      </div>
      <div className='text-xl'>
        © 2024 -
        All Rights Reserved.
      </div>
    </footer>

  )
}
