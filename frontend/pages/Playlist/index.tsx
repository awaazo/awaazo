import { ChevronDownIcon } from '@chakra-ui/icons'
import { Container, Button, VStack, Flex, Tooltip, IconButton, useBreakpointValue, Text, Box, HStack, Spacer } from '@chakra-ui/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import PlaylistCard from '../../components/cards/PlaylistCard'
import PlaylistHelper from '../../helpers/PlaylistHelper'
import { Playlist } from '../../types/Interfaces'
import withAuth from '../../utilities/authHOC'
import PlaylistMenu from '../../components/playlist/PlaylistMenu'
import LikedEpisodesImage from '../../styles/images/LikedEpisodes.png'
import { Time, Plays, Lock, Unlock } from '../../public/icons'

import { convertTime } from '../../utilities/commonUtils'

const MyPlaylist = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [page, setPage] = useState(0)
  const pageSize = 3

  const isMobile = useBreakpointValue({ base: true, md: false })

  // Form errors
  const [playlistError, setPlaylistError] = useState('')

  useEffect(() => {
    PlaylistHelper.playlistMyPlaylistsGet(page, pageSize).then((res2) => {
      if (res2.status == 200) {
        setPlaylists((prevPlaylists) => [...prevPlaylists, ...res2.playlists])
      } else {
        setPlaylistError('Podcasts cannot be fetched')
      }
    })
  }, [page])

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1)
  }

  return (
    <Flex ml={isMobile ? '0' : '30px'} flexDirection="column" alignItems={'center'}>
      <Box marginBottom="1em" fontSize="1.5em" fontWeight="bold" display="flex" alignItems="center" justifyContent="space-between">
        My Playlists
        <Link href="/Playlist/MyPlaylists" passHref></Link>
      </Box>
      {playlists && playlists.length == 0 ? (
        <Text mt={'50px'} fontSize={'18px'} textAlign={'center'}>
          You have not created any Playlists yet
        </Text>
      ) : (
        <>
          <Flex width="95%" mr={'10px'} ml={'10px'}>
            {playlists.map((playlist, index) => (
              <Link href={`/Playlist/${playlist.id}`} key={index} passHref>
                <Flex
                  key={index}
                  p={3}
                  mt={3}
                  width="250px"
                  height="250px"
                  borderRadius="15px"
                  position="relative"
                  overflow="hidden"
                  bgImage={playlist.name === 'Liked Episodes' ? LikedEpisodesImage.src : playlist.coverArt}
                  bgSize="cover"
                  bgPosition="center"
                  _hover={{
                    '.playlist-overlay': {
                      opacity: 1,
                    },
                    '.playlist-details': {
                      opacity: 1,
                    },
                  }}
                  mr={'10px'}
                  ml={'10px'}
                >
                  <Box
                    className="playlist-overlay"
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    bg="rgba(0, 0, 0, 0.7)"
                    opacity={0}
                    transition="opacity 0.3s ease"
                    borderRadius="15px"
                  />

                  <Flex
                    direction="column"
                    justifyContent="flex-start"
                    position="absolute"
                    width="100%"
                    height="100%"
                    zIndex={1}
                    color="white"
                    textAlign="center"
                    padding={'5px'}
                    opacity={0}
                    transition="opacity 0.3s ease"
                    className="hover-details"
                    _hover={{
                      opacity: 1,
                    }}
                  >
                    <Text fontWeight="bold" fontSize="20px" color="white" mb={1} textAlign="left">
                      {playlist.name}
                    </Text>
                    <Text fontSize="15px" color="grey" textAlign="left" mr={'5px'}>
                      {playlist.description}
                    </Text>

                    <HStack textAlign="left" mt={'auto'} mb={'10px'}>
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
                      <Spacer />
                      <Text fontSize="16px" color="white" mr={'20px'}>
                        {playlist.privacy === 'public' ? <Unlock /> : <Lock />}
                      </Text>
                    </HStack>
                  </Flex>
                </Flex>
              </Link>
            ))}
          </Flex>
          {playlists[(page + 1) * pageSize - 1] != null && (
            <Flex justify="center" mt={4} alignSelf={'center'}>
              <Tooltip label="Load More" placement="top">
                <IconButton aria-label="Load More" icon={<ChevronDownIcon />} onClick={handleLoadMoreClick} size="lg" variant="outline" />
              </Tooltip>
            </Flex>
          )}
        </>
      )}
    </Flex>
  )
}

export default withAuth(MyPlaylist)
