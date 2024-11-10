import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { IconImage } from './Icons'

export default function InputImage () {
  const { register, setValue, watch } = useFormContext()
  const image = watch('avatar')
  const [imageUrl, setImageUrl] = useState('')
  const [fileImage, setFileImage] = useState(null)

  const handleImage = (event) => {
    const file = event.target.files[0]
    setValue('avatar', file)
    setImageUrl(URL.createObjectURL(file))
    setFileImage(file)
  }

  useEffect(() => {
    console.log('render')
    console.log({ image })
    console.log({ imageUrl })
    console.log(typeof image)

    if (typeof image === 'string' && image) {
      return setImageUrl(image)
    }
  }, [image])

  return (
    <div className='image relative'>
      <div className='flex flex-col justify-start gap-2 items-start'>
        <label className='!w-full flex cursor-pointer gap-2 p-1 items-center justify-center border border-gray-300 rounded-md text-step1 leading-none font-medium text-gray-700 hover:text-third hover:border-third focus:outline-none focus:shadow-outline-indigo active:bg-gray-50 active:text-third transition duration-150 ease-in-out'>
          <input
            {...register('avatar')} // Registra el input en react-hook-form
            data-image
            type="file"
            name="avatar"
            id='avatar'
            onChange={handleImage}
            className='absolute opacity-0 pointer-events-none'
            accept='image/png, image/jpeg, image/jpg, image/webp, image/avif'
          />
          <IconImage />
          <span htmlFor="avatar" className='!border-none cursor-pointer'>
            Subir una nueva imagen
          </span>
        </label>

        {
          imageUrl !== '' && (
            <img
              src={imageUrl}
              alt='imagen'
              className='w-[200px] h-[200px] bg-black object-cover rounded-full object-top'
            />
          )
        }
      </div>
    </div>
  )
}
