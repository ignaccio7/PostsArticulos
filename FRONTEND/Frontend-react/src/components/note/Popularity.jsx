import { toast } from 'sonner'
import { IconCommentOutline, IconHeart, IconHeartOutline } from '../ui/Icons'
import Article from '../../services/Article'
import { useState, useEffect } from 'react'
import { sleep } from '../../utils/utils'

export default function Popularity ({ likes = 0, comments = 0, islike = 0, isPublished = 0, accessToken = '' }) {
  const [popularity, setPopularity] = useState({
    likes: 0,
    comments: 0,
    islike: 0
  })

  useEffect(() => {
    setPopularity({
      likes,
      comments,
      islike
    })
  }, [likes, islike, comments])

  const toggleLike = async () => {
    const prevState = { ...popularity }
    try {
      setPopularity(prev => {
        return {
          ...prev,
          islike: prev.islike === 1 ? 0 : 1,
          likes: prev.islike === 1 ? prev.likes - 1 : prev.likes + 1
        }
      })
      await sleep(2)
      await Article.toggleLike({ accessToken, idPub: isPublished })
    } catch (error) {
      setPopularity(prevState)
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className='flex gap-4 py-2'>
      <button
        onClick={() => toggleLike()}
        className='flex gap-2 items-center text-step1'
      >
        {
          popularity.islike === 1
            ? <IconHeart />
            : <IconHeartOutline />
        }
        <span>{popularity.likes}</span>
      </button>
      <button className='flex gap-2 items-center text-step1'>
        <IconCommentOutline />
        <span>{popularity.comments}</span>
      </button>
    </div>
  )
}
