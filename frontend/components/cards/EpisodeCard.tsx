import { HStack, VStack, Image, Text, IconButton, Icon, Box } from '@chakra-ui/react'
import { Episode } from '../../types/Interfaces'
import { usePlayer } from '../../utilities/PlayerContext'
import { convertTime } from '../../utilities/commonUtils'
import { Dots, Time, Plays, Play } from '../../public/icons'
import Likes from '../interactionHub/Likes'
import CommentButton from '../interactionHub/comments/CommentButton'
import EpisodeMenu from './EpisodeMenu'
import { formatNumber } from '../../utilities/commonUtils'
interface EpisodeCardProps {
  episode: Episode
  showLike?: boolean
  showComment?: boolean
  showMore?: boolean
  isForPlaylist?: boolean; 
  playlistId?: string;
  inWallet?: boolean; 
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, showLike = false, showComment = false, showMore = false , isForPlaylist = false , playlistId = null ,inWallet = false  }) => {
  const { thumbnailUrl, episodeName, podcastName, duration, likes, playCount, id } = episode
  const { dispatch } = usePlayer()

  const handleEpisodeClick = () => {
    dispatch({ type: 'PLAY_NOW_QUEUE', payload: episode })
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return (
    <HStack
      p="8px 10px"
      alignItems="center"
      borderRadius="15px"
      bg="az.darkerGrey"
      onClick={handleEpisodeClick}
      _hover={{
        bg: 'az.darkestGrey',
      }}
      transition="all 0.5s ease-in-out"
      spacing={11}
      w="100%"
    >
      <Image src={thumbnailUrl} alt={episodeName} objectFit="cover" width="80px" height="80px" borderRadius="10px" />

      <VStack spacing={0} w="full" align="flex-start" >
        <VStack align="start" spacing={0} >
          <Text fontSize="md" fontWeight="bold" color="az.white" noOfLines={2} mb="-1" data-cy={`ticket-episode-${episode.episodeName}`}>
            {episodeName}
          </Text>
          <Text fontSize="xs" fontWeight="medium" color="az.greyish" noOfLines={1}>
            {podcastName}
          </Text>
        </VStack>
        <HStack justify="space-between">
          <HStack spacing={1}>
            <Icon as={Plays} color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
              {formatNumber(playCount)}
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
        <IconButton aria-label="Play" icon={<Play width="12px" />} variant="play" background="az.red" minWidth="2em" width="30px" height="30px" onClick={handleEpisodeClick} />
        <HStack spacing={0} ml={6}>
          {showLike && (
            <Box ml={-3}>
              <Likes episodeOrCommentId={id} initialLikes={likes} showCount={false} />
            </Box>
          )}
          {showComment && (
            <Box ml={-3}>
              <CommentButton episodeId={episode.id} initialComments={0} showCount={false} />
            </Box>
          )}
          {showMore && (
            <Box ml={-3}>
              <div onClick={handleMenuClick}>
                <EpisodeMenu episode={episode} inPlaylist={isForPlaylist} playlistId={playlistId} />
              </div>
            </Box>
          )}
        </HStack>
      </HStack>
    </HStack>
  )
}

export default EpisodeCard
