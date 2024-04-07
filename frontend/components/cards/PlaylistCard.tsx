import React from 'react'
import { HStack, Text, Image, VStack, Icon, IconButton } from '@chakra-ui/react'
import { convertTime } from '../../utilities/commonUtils'
import PlaylistMenu from '../playlist/PlaylistMenu'
import LikedEpisodesImage from '../../styles/images/LikedEpisodes.png'
import { Time, Plays, Play } from '../../public/icons'
import { TiLockClosed , TiLockOpen } from "react-icons/ti";
import { usePlayer } from '../../utilities/PlayerContext'

const PlaylistCard = ({ playlist }) => {
  const playlistImage = playlist.name === 'Liked Episodes' ? LikedEpisodesImage.src : playlist.coverArt
  const { dispatch } = usePlayer()

  const handlePlaylistClick = () => {
    dispatch({
      type: 'PLAY_PLAYLIST_NOW',
      payload: playlist,
    })
  }

  return (
    <HStack
      p="8px 10px"
      alignItems="center"
      borderRadius="15px"
      bg="az.darkerGrey"
      _hover={{
        bg: 'az.darkestGrey',
      }}
      transition="all 0.5s ease-in-out"
      spacing={11}
      w="100%"
    >
      <Image src={playlistImage} alt={playlist.name} objectFit="cover" width="80px" height="80px" borderRadius="10px" />
      <VStack spacing={0} w="full" align="flex-start">
        <VStack align="start" spacing={0}>
          <Text fontSize="md" fontWeight="bold" color="az.white" noOfLines={2} mb="-1">
            {playlist.name}
          </Text>
          <Text fontSize="xs" fontWeight="medium" color="az.greyish" noOfLines={1}>
            {playlist.description}
          </Text>
        </VStack>
        <HStack justify="space-between">
          <HStack spacing={1}>
            <Icon as={Plays} color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
              {playlist.numberOfEpisodes}
            </Text>
          </HStack>
          <HStack spacing={1}>
            <Icon as={Time} color="az.greyish" boxSize={3} />
            <Text color="az.greyish" fontSize="xs">
              {convertTime(playlist.duration)}
            </Text>
          </HStack>
          <HStack spacing={1}>
          {playlist.privacy === 'public' ? 
        <Icon as={TiLockOpen} color="az.green" boxSize={4} /> : 
        <Icon as={TiLockClosed} color="az.red" boxSize={4} />
      }
            
          </HStack>
        </HStack>
      </VStack>
      
      {/* Playlist Menu */}
      <HStack textAlign="center" >
      <IconButton aria-label="Play" icon={<Play width="12px" />} variant="play" background="az.red" minWidth="2em" width="30px" height="30px" onClick={handlePlaylistClick} />
        <PlaylistMenu playlist={playlist} onUpdate={null} />
      </HStack >
    </HStack>
  )
}

export default PlaylistCard
