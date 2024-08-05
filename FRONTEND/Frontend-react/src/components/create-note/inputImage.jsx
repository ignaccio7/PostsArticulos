import { useState } from 'react'

export default function InputImage ({ id }) {
  const [image, setImage] = useState()

  const handleImage = (event) => {
    console.log(event.target.files[0])
    setImage(event.target.files[0])
  }

  return (
    <div className='image'>
      <div className='flex flex-col justify-start gap-2 items-start'>
        <input
          data-image
          type="file"
          name={`${id}`}
          id={`${id}`}
          onChange={handleImage}
          className='py-2 px-3 max-w-full border border-gray-300 rounded-md text-step1 leading-none font-medium text-gray-700 hover:text-third hover:border-third focus:outline-none focus:shadow-outline-indigo active:bg-gray-50 active:text-third transition duration-150 ease-in-out'
          required
        />
        {
          image &&
          (<img
            src={URL.createObjectURL(image)}
            alt='imagen'
            className='max-w-80 h-auto object-cover object-center rounded-md'
          />)
        }
      </div>
    </div>
  )
}
