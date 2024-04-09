import React, { useEffect, useState } from 'react'
import { Flex, Tooltip, Text, IconButton, VStack, Box } from '@chakra-ui/react'
import Link from 'next/link'
import { Playlist } from '../../../types/Interfaces'
import PlaylistHelper from '../../../helpers/PlaylistHelper'
import PlaylistCard from '../../cards/PlaylistCard'
import { Settings, ArrowD } from '../../../public/icons'

// Define the MyEpisodes component
export default function MyPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [page, setPage] = useState(0)
  const pageSize = 3

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
    <Box width="100%" overflow={'hidden'}>
    
      <Box marginBottom="1em" display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Text fontSize="lg" fontWeight="bold">
        My Playlists
        </Text>
        <Link href="/Playlist/MyPlaylists" passHref>
          <IconButton aria-label="Settings" icon={<Settings />} size="14px" variant="minimal" />
        </Link>
      </Box>
      {playlists && playlists.length == 0 ? (
        <Text mt={'50px'} fontSize={'18px'} textAlign={'center'}>
          You have not created any Playlists yet
        </Text>
      ) : (
        <>
          {/* Render the list of selected episodes */}
          <VStack spacing={'12px'} width={'100%'}>
            {playlists.map((playlist) => (
              <PlaylistCard playlist={playlist} />
            ))}
          </VStack>
          {playlists[(page + 1) * pageSize - 1] != null && (
            <Flex justify="center" mt={4} width={'100%'}>
              <Tooltip label="Load More" placement="top">
                <IconButton aria-label="Load More" icon={<ArrowD />} onClick={handleLoadMoreClick} size="18px" variant="minimal" />
              </Tooltip>
            </Flex>
          )}
        </>
      )}
    </Box>
  )
}
