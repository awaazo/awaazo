import { useEffect, useState } from 'react'
import { IconButton, Icon } from '@chakra-ui/react'
import { Like } from '../../public/icons'
import SocialHelper from '../../helpers/SocialHelper'
import AuthPrompt from '../auth/AuthPrompt'

const Likes = ({ episodeOrCommentId, initialLikes, showCount }) => {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likeResponse = await SocialHelper.isLiked(episodeOrCommentId)
        setIsLiked(likeResponse.isLiked)
      } catch (error) {
        console.error('Error fetching like status:', error)
      }
    }

    fetchData()
  }, [episodeOrCommentId])

  const handleLike = async (e) => {
    e.stopPropagation()
    try {
      const response = isLiked ? await SocialHelper.deleteEpisodeLike(episodeOrCommentId) : await SocialHelper.postLike(episodeOrCommentId)

      if (response.status === 200) {
        setLikes(isLiked ? likes - 1 : likes + 1)
        setIsLiked(!isLiked)
      } else if (response.status === 401) {
        setShowLoginPrompt(true)
      } else {
        console.error(`Error ${isLiked ? 'unliking' : 'liking'}:`, response.message)
      }
    } catch (error) {
      console.error(`Error ${isLiked ? 'unliking' : 'liking'}:`, error)
    }
  }

  return (
    <>
      <IconButton aria-label="like-button" variant="minimal"  onClick={handleLike} data-cy="like-button-index" icon={<Icon as={Like} />} color={isLiked ? 'az.red' : 'az.greyish'} >
        {showCount && likes}
      </IconButton>

      {showLoginPrompt && (
        <AuthPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage="To like an Episode, you must be logged in. Please log in or create an account." />
      )}
    </>
  )
}

export default Likes
