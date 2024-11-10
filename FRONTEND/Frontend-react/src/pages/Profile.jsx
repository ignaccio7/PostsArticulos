import { useForm } from 'react-hook-form'
import { IconBadge, IconEmail, IconImage, IconPhone, IconText, IconTrash } from '../components/ui/Icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { partialRegisterSchema } from '../schemas/User.schema'
import { useSessionStore } from '../store/session'
import '../styles/login.css'
import { useEffect, useState, useRef } from 'react'
import ProfileService from '../services/Profile'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import SkeletonProfileForm from '../components/ui/skeleton/ProfileForm'
import ModalConfirm from '../components/ui/dialog/ModalConfirm'
import { useModal } from '../hooks/useModal'

export default function Profile () {
  const username = useSessionStore(state => state.username)
  const accessToken = useSessionStore(state => state.accessToken)
  const ci = useRef('')
  const [loading, setLoading] = useState(true)

  const { openModal } = useModal()

  const navigate = useNavigate()
  const { logout } = useAuth()

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(partialRegisterSchema) })
  const [image, setImage] = useState('')

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const formData = new FormData()
      formData.append('nombres', data.nombres)
      formData.append('paterno', data.paterno)
      formData.append('materno', data.materno)
      formData.append('telefono', data.telefono)
      formData.append('correo', data.correo)

      console.log(data)

      if (data.avatar.length > 0 && typeof data.avatar === 'object' && image !== '') {
        formData.append('avatar', data.avatar[0]) // Acceder al primer archivo
      }

      const res = await ProfileService.updateProfile({ ci: ci.current, formData, accessToken })
      console.log(res)
      toast.success('Perfil actualizado')
    } catch (error) {
      console.log(error)
    }
  }

  watch('avatar')

  const handleImage = (event) => {
    const file = event.target.files[0]
    console.log(file)

    if (file) {
      setImage(URL.createObjectURL(file))
    } else {
      setImage('')
    }
  }

  const deleteImage = async () => {
    try {
      const res = await ProfileService.deleteImageProfile({ ci: ci.current, accessToken })
      console.log(res)
      setImage('')
      toast.success('Foto eliminada')
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    ProfileService.getProfileByUsername({ username, accessToken })
      .then(res => {
        ci.current = res.data[0].ci
        res.data[0].telefono = res.data[0]?.telefono.toString()
        // TODO falta listar notas pertenecientes al usuario y el crear que redireccione a la pagina de notas
        const imageUrl = res.data[0]?.avatar
        if (imageUrl) {
          setImage(imageUrl)
        }
        reset(res.data[0])
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        logout()
        toast.error(e.message)
        navigate('/login')
      })
  }, [])

  if (loading) return <SkeletonProfileForm />

  return (
    <section className="container sm:w-4/5">
      {/* className={`modal inset-0 fixed backdrop-blur-sm bg-zinc-900/70 z-50 grid place-items-center transition-all duration-500 ${modal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}  */}
      <ModalConfirm action={deleteImage}>
        Esta seguro que desea eliminar su foto?
      </ModalConfirm>

      <h1>Profile</h1>
      <form className="form-register !border-none !p-0" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className='form__credentials'>
            <label className={`${errors.ci ? 'error' : ''} sm:!w-full bg-slate-700`}>
              <IconBadge />
              <input disabled {...register('ci')} type="number" placeholder="Cedula" name='ci' id='ci' />
              <div>
                {errors.ci && <span>{errors.ci.message}</span>}
              </div>
            </label>
            <label className={`${errors.nombres ? 'error' : ''} sm:!w-full`}>
              <IconText />
              <input {...register('nombres')} type="nombres" placeholder="Nombres" name='nombres' id='nombres' />
              <div>
                {errors.nombres && <span>{errors.nombres.message}</span>}
              </div>
            </label>
            <label className={`${errors.paterno ? 'error' : ''} sm:!w-full`}>
              <IconText />
              <input {...register('paterno')} type="paterno" placeholder="Paterno" name='paterno' id='paterno' />
              <div>
                {errors.paterno && <span>{errors.paterno.message}</span>}
              </div>
            </label>
            <label className={`${errors.materno ? 'error' : ''} sm:!w-full`}>
              <IconText />
              <input {...register('materno')} type="materno" placeholder="materno" name='materno' id='materno' />
              <div>
                {errors.materno && <span>{errors.materno.message}</span>}
              </div>
            </label>
            <label className={`${errors.telefono ? 'error' : ''} sm:!w-full`}>
              <IconPhone />
              <input {...register('telefono')} type="text" placeholder="telefono" name='telefono' id='telefono' />
              <div>
                {errors.telefono && <span>{errors.telefono.message}</span>}
              </div>
            </label>
            <label className={`${errors.correo ? 'error' : ''} sm:!w-full`}>
              <IconEmail />
              <input {...register('correo')} type="correo" placeholder="correo" name='correo' id='correo' />
              <div>
                {errors.correo && <span>{errors.correo.message}</span>}
              </div>
            </label>
          </div>
          <div className='form__credentials !grid !grid-cols-2 !place-content-start !gap-2'>
            <label className={`${errors.avatar ? 'error' : ''} !bg-blue-600 !text-step0 items-center cursor-pointer !border-[1px] !border-transparent hover:!bg-transparent hover:!border-blue-500 transition-all duration-500`}>
              <IconImage />
              Cambiar foto
              <input {...register('avatar')} onChange={handleImage} type="file" placeholder="avatar" name='avatar' id='avatar' accept='image/png, image/jpeg, image/jpg, image/webp, image/avif' className='absolute opacity-0 pointer-events-none' />
              <div>
                {errors.avatar && <span>{errors.avatar.message}</span>}
              </div>
            </label>
            <button
              type='button'
              disabled={image === ''}
              className={`w-full border-[1px] border-red-600 bg-red-600 rounded-xl p-2 col-span-1 h-full text-step0 flex items-center justify-between transition-all duration-500 ${image !== '' ? 'hover:bg-transparent hover:border-red-500' : ''}`}
              // onClick={() => setModal(!modal)}
              // onClick={() => { dialogRef.current.showModal() }}
              onClick={() => { openModal() }}
            >
              Eliminar foto
              <IconTrash />
            </button>
            {
              (image !== '' && typeof image === 'string') && (
                <img
                  src={image}
                  alt='Imagen de su perfil'
                  className='w-[200px] h-[200px] bg-black object-cover rounded-full object-top col-span-2'
                />
              )
            }
          </div>
        </div>
        <div className="form__actions">
          <button type="submit" disabled={isSubmitting} className='!w-full'>
            {isSubmitting ? 'Cargando...' : 'Modificar'}
          </button>
        </div>
      </form>
    </section>
  )
}
