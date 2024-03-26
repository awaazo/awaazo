import { Box, HStack, VStack, Image, Text, IconButton, Icon } from '@chakra-ui/react'
import { FaPlay, FaClock } from 'react-icons/fa'
import { Episode } from '../../types/Interfaces'
import { usePlayer } from '../../utilities/PlayerContext'
import { convertTime } from '../../utilities/commonUtils'
import { Chat, Like, Dots , Time , Plays } from '../../public/icons'

const PodcastTicket: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { thumbnailUrl, episodeName, podcastName, duration, likes, playCount } = episode
  const { dispatch } = usePlayer()

  const handleEpisodeClick = () => {
    dispatch({ type: 'PLAY_NOW_QUEUE', payload: episode })
  }

  return (
    <HStack
      width="100%" // Ensures HStack takes full width
      maxW="600px" // Adjust maximum width as needed
      overflow="hidden" // Prevents content from spilling out
      p={'15px'}
      spacing={1}
      alignItems="center"
      borderRadius="15px"
      bg={'az.darkerGrey'}
      _hover={{
        bg: 'az.blackish',
        boxShadow: 'lg',
      }}
      transition="all 0.3s ease-in-out"
      onClick={handleEpisodeClick}
      cursor="pointer"
      role="group"
    >
      <Image src={thumbnailUrl} alt={episodeName} objectFit="cover" width="80px" height="80px" borderRadius="10px" />

      <VStack spacing={0} w="222px" flexDir="column" justify="center" align="flex-start" gap={"9px"} flexShrink={0}>
        <Text fontWeight="bold" color="az.white" noOfLines={1} textAlign="left" data-cy={`ticket-episode-${episode.episodeName}`}>
          {episodeName}
        </Text>
        <Text fontSize="sm" color="az.greyish" noOfLines={1} textAlign="left">
          {podcastName}
        </Text>
        <HStack>
          <Icon as={Plays} color="az.greyish" />
          <Text color="az.greyish" fontSize="xs">
            {playCount}
          </Text>
          <Icon as={Time} color="az.red" />
          <Text color="az.greyish" fontSize="xs">
            {convertTime(duration)}
          </Text>
        </HStack>
      </VStack>

      <HStack>
        <IconButton icon={<Icon as={FaPlay} />} aria-label="Button 1" onClick={handleEpisodeClick}></IconButton>
        <IconButton icon={<Icon as={Like} />} aria-label="Button 2"></IconButton>
        <IconButton icon={<Icon as={Chat} />} aria-label="comments"></IconButton>
        <IconButton icon={<Icon as={Dots} />} aria-label="more"></IconButton>
      </HStack>
    </HStack>
  )
}

export default PodcastTicket
