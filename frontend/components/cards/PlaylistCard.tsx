import React from 'react'
import { Box, Flex, HStack, Text, Image } from '@chakra-ui/react'
import { convertTime } from '../../utilities/commonUtils'
import PlaylistMenu from '../playlist/PlaylistMenu'
import LikedEpisodesImage from '../../styles/images/LikedEpisodes.png'
import { Time, Plays, Lock, Unlock } from '../../public/icons'

const PlaylistCard = ({ playlist }) => {
  const playlistImage = playlist.name === 'Liked Episodes' ? LikedEpisodesImage.src : playlist.coverArt

  return (
    <Flex p={3} mt={3} width="100%" borderRadius="15px" bg={'az.darkGrey'}>
      <Flex direction="column" flex={1}>
        <Flex justifyContent="space-between" mb={2} align="center">
          <Box mr={3} borderRadius="10px" overflow={'hidden'}>
            <Image src={playlistImage} alt={playlist.name} width={100} height={100} />
          </Box>

          <Box flex={1}>
            <Text fontWeight="bold" fontSize="20px" color="white" mb={1}>
              {playlist.name}
            </Text>
            <Text fontSize="16px" color="grey">
              {playlist.description}
            </Text>

            <HStack textAlign="left" mt={'5px'}>
              <Flex align="center" color="grey" mr="10px">
                <Plays />
                <Text fontSize="16px" ml="1">
                  {playlist.numberOfEpisodes}
                </Text>
              </Flex>
              <Flex align="center" color="grey">
                <Time />
                <Text fontSize="16px" ml="1" mr="15px">
                  {convertTime(playlist.duration)}
                </Text>
              </Flex>
              <Text fontSize="16px" color="white">
                {playlist.privacy === 'public' ? <Unlock /> : <Lock />}
              </Text>
            </HStack>
          </Box>

          {/* Playlist Menu */}
          <Box ml={3} textAlign="center" zIndex={5}>
            <PlaylistMenu playlist={playlist} onUpdate={null} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PlaylistCard
