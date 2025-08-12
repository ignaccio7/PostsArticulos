import { TITLE_PROJECT, DESCRIPTION_PROJECT } from '../utils/constants'
import { useSEOStore } from '../store/seo'

export function useSEO () {
  const { title, description, setSEO } = useSEOStore(state => state)

  const changeMetadata = ({ title, description }) => {
    const metaTitle = title ? `${title} | ${TITLE_PROJECT}` : TITLE_PROJECT
    const metaDescription = description || DESCRIPTION_PROJECT
    setSEO({
      title: metaTitle,
      description: metaDescription
    })
  }

  return {
    changeMetadata,
    title,
    description
  }
}