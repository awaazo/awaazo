import { HStack, VStack, Image, Text, IconButton, Icon } from '@chakra-ui/react'
import { Episode } from '../../types/Interfaces'
import { usePlayer } from '../../utilities/PlayerContext'
import { convertTime } from '../../utilities/commonUtils'
import { Dots, Time, Plays, Play } from '../../public/icons'
import Likes from '../interactionHub/Likes'
import CommentButton from '../interactionHub/buttons/CommentButton'

interface EpisodeCardProps {
  episode: Episode
  showLike?: boolean
  showComment?: boolean
  showMore?: boolean
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, showLike = true, showComment = true, showMore = true }) => {
  const { thumbnailUrl, episodeName, podcastName, duration, likes, playCount, id } = episode
  const { dispatch } = usePlayer()

  const handleEpisodeClick = () => {
    dispatch({ type: 'PLAY_NOW_QUEUE', payload: episode })
  }

  return (
    <HStack
      
     
      overflow="hidden"
      p={'15px'}
      alignItems="center"
      borderRadius="15px"
      bg={'az.darkerGrey'}
      onClick={handleEpisodeClick}
      _hover={{
        transform: 'scale(1.01)',
      }}
      transition="transform 1s ease-in-out"
      spacing={3}
    >
      <Image src={thumbnailUrl} alt={episodeName} objectFit="cover" width="80px" height="80px" borderRadius="10px" />

      <VStack spacing={1} w="310px" flexDir="column" justify="center" align="flex-start" flexShrink={0}>
        <VStack align="start" spacing={-1}>
          <Text fontSize="md" fontWeight="bold" color="az.white" noOfLines={2} data-cy={`ticket-episode-${episode.episodeName}`}>
            {episodeName}
          </Text>
          <Text fontSize="xs" color="az.greyish" noOfLines={1}>
            {podcastName}
          </Text>
        </VStack>
        <HStack>
          <HStack spacing={1} mr={5}>
            <Icon as={Plays} color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
              {playCount}
            </Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={Time} color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
              {convertTime(duration)}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <HStack spacing={1}>
        <IconButton aria-label={'Play'} icon={<Play />} variant="circle" background="az.red" minWidth="2.5em" size="md" onClick={handleEpisodeClick} />
        <HStack spacing={0}>
          {showLike ? <Likes episodeOrCommentId={id} initialLikes={likes} showCount={false} /> : null}
          {showComment ? <CommentButton episodeId={episode.id} initialComments={0} showCount={false} /> : null}
          {showMore ? <IconButton aria-label="more" icon={<Icon as={Dots} />} variant="minimal" color="az.greyish" /> : null}
        </HStack>
      </HStack>
    </HStack>
  )
}

export default EpisodeCard
