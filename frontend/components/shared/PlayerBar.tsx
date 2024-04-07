import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Flex, IconButton, Image, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, useBreakpointValue, HStack, Img, VStack } from '@chakra-ui/react'
import { FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa'
import { SpeakerFull, SpeakerLow, SpeakerMute } from '../../public/icons'
import waazoSleeping from '../../public/svgs/waazoSleeping.svg'

import { Play } from '../../public/icons'
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb'
import Likes from '../interactionHub/Likes'
import { convertTime } from '../../utilities/commonUtils'
import { usePalette } from 'color-thief-react'
import EndpointHelper from '../../helpers/EndpointHelper'
import { usePlayer } from '../../utilities/PlayerContext'
import { SaveWatchHistoryRequest } from '../../types/Requests'
import PodcastHelper from '../../helpers/PodcastHelper'
import PlayerMenu from '../playerbar/Menu'

const PlayerBar = () => {
  const { state, dispatch, audioRef } = usePlayer()
  const { episode } = state
  const isEpisodeLoaded = !!episode
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [audioUrl, setAudioUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)

  const isMobile = useBreakpointValue({ base: true, md: false })
  const isTablet = useBreakpointValue({ base: true, md: true, lg: false })

  const getEpisodePlaying = async (podcastId, episodeId) => {
    return EndpointHelper.getPodcastEpisodePlayEndpoint(podcastId, episodeId)
  }

  // Effect Hooks
  // Fetch and load audio URL
  useEffect(() => {
    const fetchAudio = async () => {
      if (isPlaying) setIsLoading(true)
      try {
        const url = await getEpisodePlaying(episode.podcastId, episode.id)
        setAudioUrl(url)
      } catch (error) {
        console.error('Error fetching episode:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isEpisodeLoaded) {
      fetchAudio()
    }
  }, [episode])

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl
      audioRef.current.load()
      audioRef.current.addEventListener(
        'loadedmetadata',
        () => {
          setDuration(audioRef.current.duration)
          setIsPlaying(true)
        },
        { once: true }
      )
    }
  }, [audioUrl])

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    audioRef.current.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed
  }, [playbackSpeed])

  useEffect(() => {
    const audio = audioRef.current
    const setAudioData = () => {
      setDuration(audio.duration)
    }
    const updatePosition = () => {
      dispatch({ type: 'SET_CT', payload: audio.currentTime })
      setPosition(audio.currentTime)
    }
    setSelectedTimestamp(audio.currentTime)
    audio.addEventListener('loadedmetadata', setAudioData)
    audio.addEventListener('timeupdate', updatePosition)
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData)
      audio.removeEventListener('timeupdate', updatePosition)
    }
  }, [])

  const togglePlayPause = () => setIsPlaying(!isPlaying)
  const toggleMute = () => {
    setIsMuted(!isMuted)
    setVolume(isMuted ? 30 : 0)
  }

  const handleSeek = (newValue) => {
    const seekTime = Number(newValue)
    audioRef.current.currentTime = seekTime
    setPosition(seekTime)
  }

  const skipAmount = 10
  const skipForward = () => {
    const newPosition = Math.min(position + skipAmount, duration)
    audioRef.current.currentTime = newPosition
    setPosition(newPosition)
  }

  const skipBackward = () => {
    const newPosition = Math.max(position - skipAmount, 0)
    audioRef.current.currentTime = newPosition
    setPosition(newPosition)
  }

  const playNext = () => {
    dispatch({ type: 'PLAY_NEXT' })
  }

  const setSelectedTimestamp = (timestamp) => {
    dispatch({ type: 'SET_SELECTED_TIMESTAMP', payload: timestamp })
  }

  const playPrevious = () => {
    const currentTime = audioRef.current.currentTime

    if (currentTime > 5) {
      // If current time is more than 5 seconds, reset time to 0
      audioRef.current.currentTime = 0
    } else {
      // Otherwise, dispatch the "PLAY_PREVIOUS" action
      dispatch({ type: 'PLAY_PREVIOUS' })
    }
  }

  const timeLeft = isEpisodeLoaded ? convertTime(Math.max(episode.duration - position, 0)) : '0:00'

  const thumbnailUrl = isEpisodeLoaded ? episode.thumbnailUrl : '/awaazo_bird_aihelper_logo.svg'
  const { data: palette } = usePalette(thumbnailUrl, 2, 'rgbArray', {
    crossOrigin: 'Anonymous',
    quality: 10,
  })

  useEffect(() => {
    //remove 'if (episode)' when refreshing the page will keep the episode
    if (episode) {
      const loadWatchHistory = async () => {
        PodcastHelper.getWatchHistory(episode.id)
          .then((res) => {
            if (res.status === 200) {
              if (res.watchHistory.listenPosition >= 0) {
                console.log('listenPosition loaded: ' + res.watchHistory.listenPosition)
                audioRef.current.currentTime = res.watchHistory.listenPosition
              } else {
                console.log('listenPosition loaded: ' + res.watchHistory.listenPosition)
                audioRef.current.currentTime = 0
              }
            } else {
              console.error('Error fetching watch history data:', res.message)
            }
          })
          .catch((error) => console.error('Error fetching watch history data:', error))
      }
      // Call the function to load the watch history
      loadWatchHistory()

      const handleBeforeUnload = async () => {
        const request: SaveWatchHistoryRequest = {
          listenPosition: audioRef.current.currentTime, 
        }
        if (audioRef.current && isEpisodeLoaded) {
          await PodcastHelper.saveWatchHistory(episode.id, request).then((response) => {
            if (response.status === 200) {
              console.log('Saved Episode Watch History')
              console.log('listenPosition saved: ' + audioRef.current.currentTime)
            } else {
              console.error('Error saving the episode watch history:', response.message)
            }
          })
        }
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [episode])

  //Saves watch history every 30 seconds
  useEffect(() => {
    const saveHistoryAtInterval = async () => {
      const request: SaveWatchHistoryRequest = {
        listenPosition: audioRef.current.currentTime, 
      }
      if (audioRef.current && episode !== null) {
        try {
          await PodcastHelper.saveWatchHistory(episode.id, request).then((response) => {
            if (response.status === 200) {
              console.log('Saved Episode Watch History')
              console.log('listenPosition saved: ' + audioRef.current.currentTime)
            } else {
              console.error('Error saving the episode watch history:', response.message)
            }
          })
        } catch (error) {
          console.error('Error saving the episode watch history:', error)
        }
      }
    }

    const interval = setInterval(() => {
      saveHistoryAtInterval()
    }, 30000)

    return () => clearInterval(interval)
  }, [episode])

  return (
    <Box
      maxWidth={isMobile ? '100%' : '97%'}
      padding={isMobile ? '0.5em' : '1em'}
      bg="az.darkestGrey"
      position="fixed"
      left="50%"
      transform="translateX(-50%)"
      width="100%"
      zIndex={999}
      bottom={isMobile ? '55px' : '0.1px'}
      borderTopLeftRadius="20px"
      borderTopRightRadius="20px"
    >
      <Flex
        flexDirection="row"
        justifyContent={isEpisodeLoaded ? 'space-between' : 'flex-start'} // Updated justifyContent
        mr={isEpisodeLoaded ? '15px' : '0px'}
        alignItems="center"
      >
        {/* Episode Info */}
        <Flex alignItems="center" ml={2}>
          {isEpisodeLoaded ? (
            <Link href={`/NowPlaying/${episode.id}`} shallow>
              <Image boxSize={isMobile ? '30px' : '60px'} src={episode.thumbnailUrl} borderRadius="15px" mr={4} objectFit="cover" cursor="pointer" />
            </Link>
          ) : (
            <Box boxSize={isMobile ? '30px' : '40px'} mr={4}>
            <Img src={waazoSleeping.src} alt="Waazo Sleeping" style={{ width: '100%', height: '100%' }} />
          </Box>
          )}
          <VStack maxWidth={isMobile ? '75%' : '100%'} align={"start"} spacing={0}>
            <Text fontWeight="bold" fontSize={isMobile ? 'sm' : 'md'} isTruncated>
              {isEpisodeLoaded ? episode.episodeName : 'Not Playing'}
            </Text>
            <Text fontSize={isMobile ? 'xs' : 'sm'} color="az.greyish" mt={"-1"}isTruncated>
              {isEpisodeLoaded ? episode.podcastName : ''}{' '}
            </Text>
          </VStack>
          <Box ml={2 }>
          <Likes episodeOrCommentId={isEpisodeLoaded ? episode.id : 'default-id'} initialLikes={isEpisodeLoaded ? episode.likes : 0} showCount={false} />
          </Box>
        </Flex>

        <HStack flexDirection="column" width={isEpisodeLoaded ? '45%' : '75%'} alignItems="center">
          {/* Player Controls */}
          <Flex alignItems="center" mb="5px">
            <IconButton aria-label="Previous Episode" icon={<FaStepBackward />} variant="ghost" size="sm" onClick={playPrevious} mr={2} data-cy={`play-previous`} />
            <IconButton aria-label="Skip Backward" icon={<TbRewindBackward10 size={'20px'} />} variant="ghost" size="sm" onClick={skipBackward} mr={4} data-cy={`skip-backward`} />
            <IconButton
              aria-label={isPlaying ? 'Pause' : 'Play'}
              icon={isPlaying ? <FaPause /> : <Play />}
              variant="play"
              bg="az.red"
              minWidth="2.5em"
              size="md"
              onClick={togglePlayPause}
              mr={4}
              data-cy={`play-pause-button`}
            />
            <IconButton aria-label=" Skip Forward" icon={<TbRewindForward10 size={'20px'} />} variant="ghost" size="sm" onClick={skipForward} mr={2} data-cy={`skip-forward`} />
            <IconButton aria-label=" Next Episode" icon={<FaStepForward />} variant="ghost" size="sm" onClick={playNext} data-cy={`play-next`} />
          </Flex>

          {/* Slider */}
          {!isMobile && (
            <Flex width={isEpisodeLoaded ? '100%' : '65%'} mx={4} alignItems="center">
              <Text data-cy={`time-passed-${convertTime(position)}`} mr={3} fontSize="xs" fontWeight="medium">
                {convertTime(position)}
              </Text>
              <Slider aria-label="Track Timeline" value={position} max={duration} onChange={(val) => handleSeek(val)}>
                <SliderTrack bg="transparent"></SliderTrack>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
              </Slider>

              <Text data-cy={`time-left-${timeLeft}`} ml={3} fontSize="xs" fontWeight="medium">
                {timeLeft}
              </Text>
            </Flex>
          )}
        </HStack>

        {/* Like and Comment - Hidden in mobile */}

        {!isMobile && (
          <Flex alignItems="center" mr={2}>
            <Flex alignItems="center" mr={2}>
              <PlayerMenu episode={episode} />
              
            </Flex>

            {/* Volume Control Section */}
            {!isTablet && (
              <Box display="contents" alignItems="center">
                <IconButton aria-label={isMuted ? 'Unmute' : 'Mute'} icon={isMuted ? <SpeakerMute /> : <SpeakerFull />} variant="minimal" size="sm" onClick={toggleMute} />
                <Slider
                  aria-label="Volume"
                  value={isMuted ? 0 : volume}
                  isDisabled={isMuted}
                  onChange={(val) => {
                    setVolume(val)
                    setIsMuted(val === 0)
                    audioRef.current.volume = val / 100
                  }}
                  mx={2}
                  width="5rem"
                >
                  <SliderTrack bg="gray.500">
                    <SliderFilledTrack bg="az.red" />
                  </SliderTrack>
                  <SliderThumb boxSize={2} bg="az.red" />
                </Slider>
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

export default PlayerBar
