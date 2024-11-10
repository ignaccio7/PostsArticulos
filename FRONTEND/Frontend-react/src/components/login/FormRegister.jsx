import { useForm } from 'react-hook-form'
import { IconBadge, IconEmail, IconImage, IconLock, IconPhone, IconText, IconUser } from '../ui/Icons'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../schemas/User.schema'
import { toast } from 'sonner'
import User from '../../services/User'
import { useAuth } from '../../hooks/useAuth'

export default function FormRegister () {
  const auth = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } =
    useForm({ resolver: zodResolver(registerSchema) })
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const formData = new FormData()
      formData.append('ci', data.ci)
      formData.append('nombres', data.nombres)
      formData.append('paterno', data.paterno)
      formData.append('materno', data.materno)
      formData.append('telefono', data.telefono)
      formData.append('correo', data.correo)
      formData.append('usuario', data.usuario)
      formData.append('password', data.password)
      // console.log(data.avatar)
      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0]) // Acceder al primer archivo
      }

      await User.registerUser({ payload: formData })
      auth.login()
      toast.success('Usuario registrado exitosamente')
      navigate('/notes', { replace: true })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // const handleRegisterNote = (event) => {
  //   event.preventDefault()
  //   const formData = new FormData(event.target)
  //   formData.append('paterno', 'Perez')

  //   // formData.append('pass', '260298nesigABC+-*')
  //   formData.append('pass', '123jpABC+-*')
  //   console.log(formData)
  //   console.log(formData.get('imagenes'))
  //   // const { ci, nombres, avatar } = Object.fromEntries(formData)
  //   // const formData = new FormData()
  //   // console.log(formData);
  //   // formData.append('ci', event.target.ci.value )
  //   // console.log(formData);
  //   // fetch('http://localhost:1234/user', {
  //   //   method: 'post',
  //   //   body: formData
  //   // })
  //   //   .then(res => res.json())
  //   //   .then(data => {
  //   //     console.log(data)
  //   //     /** RESPONSE WITH MULTER */
  //   //   })
  // }

  return (
    <>
    <form className="form-register" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="form__title">Registro</h1>
      <div className="form__credentials">
        <label className={errors.ci ? 'error' : ''}>
          <IconBadge />
          <input {...register('ci')} type="number" placeholder="Cedula" name='ci' id='ci' />
          <div>
            {errors.ci && <span>{errors.ci.message}</span>}
          </div>
        </label>
        <label className={errors.nombres ? 'error' : ''}>
          <IconText />
          <input {...register('nombres')} type="nombres" placeholder="Nombres" name='nombres' id='nombres' />
          <div>
            {errors.nombres && <span>{errors.nombres.message}</span>}
          </div>
        </label>
        <label className={errors.paterno ? 'error' : ''}>
          <IconText />
          <input {...register('paterno')} type="paterno" placeholder="Paterno" name='paterno' id='paterno' />
          <div>
            {errors.paterno && <span>{errors.paterno.message}</span>}
          </div>
        </label>
        <label className={errors.materno ? 'error' : ''}>
          <IconText />
          <input {...register('materno')} type="materno" placeholder="materno" name='materno' id='materno' />
          <div>
            {errors.materno && <span>{errors.materno.message}</span>}
          </div>
        </label>
        <label className={errors.telefono ? 'error' : ''}>
          <IconPhone />
          <input {...register('telefono')} type="text" placeholder="telefono" name='telefono' id='telefono' />
          <div>
            {errors.telefono && <span>{errors.telefono.message}</span>}
          </div>
        </label>
        <label className={errors.correo ? 'error' : ''}>
          <IconEmail />
          <input {...register('correo')} type="correo" placeholder="correo" name='correo' id='correo' />
          <div>
            {errors.correo && <span>{errors.correo.message}</span>}
          </div>
        </label>
        <label className={errors.usuario ? 'error' : ''}>
          <IconUser />
          <input {...register('usuario')} type="text" placeholder="Usuario" name='usuario' id='usuario'/>
          <div>
            {errors.usuario && <span>{errors.usuario.message}</span>}
          </div>
        </label>
        <label className={errors.password ? 'error' : ''}>
          <IconLock />
          <input {...register('password')} type="password" placeholder="Password" name='password' id='password' />
          <div>
            {errors.password && <span>{errors.password.message}</span>}
          </div>
        </label>
        <label className={errors.avatar ? 'error' : ''}>
          <IconImage />
          <input {...register('avatar')} type="file" placeholder="avatar" name='avatar' id='avatar' />
          <div>
            {errors.avatar && <span>{errors.avatar.message}</span>}
          </div>
        </label>
      </div>
      <div className="form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cargando...' : 'Registrarse'}
        </button>
      </div>
      <footer>
        Volver hacia <label htmlFor="change-form">Atras</label>
      </footer>
    </form>
    {/* <main>
      <h1>Person</h1>
      <form onSubmit={handleRegisterNote} method='post' encType="multipart/form-data">
        <input type="text" name='titulo' placeholder='titulo' /> <br />
        <input type="text" name='tema' placeholder='tema' /> <br />
        <input type="file" name='imagenes' /> <br />
        <button>Enviar</button>
      </form>
    </main> */}
    </>
  )
}
