import React, { useEffect, useState } from 'react'
import { Box, Image, Text, VStack, IconButton, HStack, Icon } from '@chakra-ui/react'
import type { Episode } from '../../types/Interfaces'
import type { Playlist } from '../../types/Interfaces'
import PlaylistHelper from '../../helpers/PlaylistHelper'
import EpisodeCard from '../../components/cards/EpisodeCard'
import { formatSecToDurationString } from '../../utilities/commonUtils'
import { usePlayer } from '../../utilities/PlayerContext'
import { useRouter } from 'next/router'
import PlaylistMenu from '../../components/playlist/PlaylistMenu'
import { Play } from '../../public/icons'
import { FaShuffle } from 'react-icons/fa6'
import { FaCircle,FaPause } from 'react-icons/fa'
import CustomAvatar from '../../components/assets/CustomAvatar'
import { TiLockClosed, TiLockOpen } from 'react-icons/ti'

export default function Playlist() {
  const router = useRouter()
  const playlistId = router.query.playlistId as string; 
  const { dispatch } = usePlayer()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>(null)
  const [reload, setReload] = useState(false)
  const [playlistError, setPlaylistError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PlaylistHelper.playlistsEpisodesGet(playlistId)
        setPlaylist(response.playlist)
        setEpisodes(response.playlist.playlistEpisodes)
      } catch (error) {
        setPlaylistError('Cannot load Playlist')
      }
    }
    fetchData()
  }, [playlistId, reload])

  const handlePlaylistClick = () => {
    dispatch({
      type: 'PLAY_PLAYLIST_NOW',
      payload: playlist,
    })
  }

  const handlePlaylistShuffleClick = () => {
    dispatch({
      type: 'SHUFFLE_PLAYLIST_NOW',
      payload: playlist,
    })
  }

  const updatePlaylistData = (updatedPlaylist) => {
    setPlaylist(updatedPlaylist)
  }

  return (
    <Box >
      {/* {playlistError && <Text color="red.500">{playlistError}</Text>} */}
      {playlist && (
        <VStack spacing="4" px={10} align="center" width={"90%"} mx="auto">
          <HStack spacing={4} width={"full"}>
            <Image src={playlist.coverArt} alt={playlist.name} boxSize="183px" borderRadius={'15px'} />
            <VStack align={'start'} spacing={3} width={"full"}>
              <VStack align={'start'} spacing={0} width={'full'}>
                <HStack justifyContent={'space-between'} width={'full'}>
                  <Text fontWeight="bold" fontSize="xs">
                    Playlist
                  </Text>
                  <Icon as={playlist.privacy === 'Private' ? TiLockClosed : TiLockOpen} color="white" />
                </HStack>
                <VStack align={'start'} spacing={0}>
                  <Text fontWeight="bold" fontSize="xxl" mt={'-1'}>
                    {playlist.name}
                  </Text>
                  <Text fontWeight="medium" fontSize="sm" color={'az.greyish'} mt={'-1'}>
                    {playlist.description}
                  </Text>
                </VStack>
              </VStack>

              <HStack>
                <CustomAvatar imageUrl={playlist.user.avatarUrl} username={playlist.user.username} size={'xs'} />
                <Text color="white" fontSize={'xs'} fontWeight={'bold'}>
                  <Text>{playlist.user.username}</Text>{' '}
                </Text>
                <Box as={FaCircle} color={'az.yellow'} size="8px" style={{ marginLeft: '1px' }} />
                <Text color="white" fontSize={'xs'} fontWeight={'bold'}>
                  <Text>187 Likes</Text>{' '}
                </Text>
                <Box as={FaCircle} color={'az.blue'} size="8px" style={{ marginLeft: '1px' }} />
                <Text color="white" fontSize={'xs'} fontWeight={'bold'}>
                  <Text>{playlist.numberOfEpisodes} Episodes</Text>{' '}
                </Text>
                <Box as={FaCircle} color={'az.green'} size="8px" style={{ marginLeft: '1px' }} />
                <Text fontSize={'xs'} fontWeight={'bold'}>
                  About {formatSecToDurationString(playlist.duration)}
                </Text>{' '}
              </HStack>
              <HStack justifyContent={'space-between'} width={'full'}>
                <HStack spacing={2}>
                  <IconButton
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    icon={isPlaying ? <FaPause size="22px" /> : <Play width="22px" height="22px" />}
                    variant="play"
                    bg="az.red"
                    minWidth="50px"
                    height="50px"
                    onClick={() => handlePlaylistClick()}
                  />
                  <IconButton aria-label="Shuffle" variant="minimal" onClick={() => handlePlaylistShuffleClick()} icon={<FaShuffle size="26px" />} />
                </HStack>
                <PlaylistMenu playlist={playlist} onUpdate={updatePlaylistData} />
              </HStack>
            </VStack>
          </HStack>
          <VStack spacing={"12px"} width={"full"}>
            {episodes && episodes.length > 0 ? (
              episodes.map((episode: any) => <EpisodeCard episode={episode} isForPlaylist={true} playlistId={playlist.id} showMore={true} showComment ={true} showLike={true} />)
            ) : (
              <Text textAlign={'center'} mt={'5%'} fontWeight={'bold'}>
                No episodes in this playlist yet
              </Text>
            )}
          </VStack>
        </VStack>
      )}
    </Box>
  )
}
