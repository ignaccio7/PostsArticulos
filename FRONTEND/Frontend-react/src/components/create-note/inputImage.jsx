import { useEffect, useState } from 'react'

export default function InputImage ({ id, content = '' }) {
  const [image, setImage] = useState('')

  const handleImage = (event) => {
    // console.log(event.target.files[0])
    setImage(event.target.files[0])
  }

  useEffect(() => {
    // console.log(content.image)
    setImage(content.image)
  }, [content])

  return (
    <div className='image'>
      <div className='flex flex-col justify-start gap-2 items-start'>
        {
          content !== ''
            ? (
              <input data-image type="text" id={`${id}`} name="imagenes" hidden value={image} onChange={(e) => { setImage(e.target.value) }}/>
              )
            : <input
              data-image
              type="file"
              name="imagenes"
              id={`${id}`}
              onChange={handleImage}
              className='py-2 px-3 max-w-full border border-gray-300 rounded-md text-step1 leading-none font-medium text-gray-700 hover:text-third hover:border-third focus:outline-none focus:shadow-outline-indigo active:bg-gray-50 active:text-third transition duration-150 ease-in-out'
              required
              accept='image/png, image/jpeg, image/jpg, image/webp, image/avif'
            />
        }

        {
          image &&
          (<img
            src={typeof image !== 'string' ? URL.createObjectURL(image) : image}
            alt='imagen'
            className='max-w-2xl h-auto aspect-video w-full object-cover object-center rounded-md'
          />)
        }
      </div>
    </div>
  )
}
