import { useAuth } from '../hooks/useAuth'

export default function Home () {
  const { login } = useAuth()
  return (
    <>
      <h1>Home</h1>
      <button onClick={() => { login() }}>Login</button>
    </>
  )
}
