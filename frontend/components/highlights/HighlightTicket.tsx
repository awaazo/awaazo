import React, { useState, useEffect } from 'react'
import { Box, Image, IconButton, useBreakpointValue, Text, Link, Progress, VStack } from '@chakra-ui/react'
import { FaPlay, FaPause } from 'react-icons/fa'
import { usePlayer } from '../../utilities/PlayerContext'
import HighlightHelper from '../../helpers/HighlightHelper'
import PodcastHelper from '../../helpers/PodcastHelper'
import { useTranslation } from 'react-i18next'

const HighlightTicket = ({ highlight, onOpenFullScreen, isFullScreenMode }) => {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState(new Audio())
  const [episode, setEpisode] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const { dispatch, state } = usePlayer()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const isEpisodeLoaded = !!episode

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PodcastHelper.getEpisodeById(highlight.episodeId)
        setEpisode(res.episode)
        setThumbnailUrl(res.episode.thumbnailUrl)
      } catch (error) {
        console.error('Error fetching episode:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    return () => audio && audio.pause()
  }, [audio, highlight.id])

  const handlePlayPauseClick = (e) => {
    e.stopPropagation()
    if (!isPlaying) {
      const audioUrl = HighlightHelper.getHighlightAudioEndpoint(highlight.highlightId)
      console.debug('Playing audio from URL:', audioUrl)
      if (audio && audioUrl) {
        audio.src = audioUrl
        audio.play()
        setIsPlaying(true)
      }
    } else {
      if (audio) {
        audio.pause()
        setIsPlaying(false)
      }
    }
  }

  useEffect(() => {
    if (isFullScreenMode) {
      const playAudio = async () => {
        const audioUrl = HighlightHelper.getHighlightAudioEndpoint(highlight.highlightId)
        console.debug('Playing audio from URL:', audioUrl)
        if (audio && audioUrl) {
          audio.src = audioUrl
          try {
            await audio.play()
            setIsPlaying(true)
          } catch (error) {
            console.error('Audio playback failed:', error)
          }
        }
      }

      playAudio()
    } else {
      if (audio) {
        audio.pause()
        setIsPlaying(false)
      }
    }

    return () => {
      if (audio) {
        audio.pause()
        setIsPlaying(false)
      }
    }
  }, [highlight.highlightId, isFullScreenMode])

  useEffect(() => {
    const setAudioMetadata = () => {
      setDuration(audio.duration || 0)
    }

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    audio.addEventListener('loadedmetadata', setAudioMetadata)
    audio.addEventListener('timeupdate', updateTime)

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioMetadata)
      audio.removeEventListener('timeupdate', updateTime)
    }
  }, [audio])

  return (
    <>
      <Box
        width={isFullScreenMode ? '600px' : '150px'}
        height={isFullScreenMode ? '850px' : '150px'}
        borderRadius={isFullScreenMode ? '10px' : '150px'}
        position="relative"
        overflow={'hidden'}
        onClick={() => (!isFullScreenMode && onOpenFullScreen ? onOpenFullScreen() : undefined)}
      >
        {episode && (
          <>
            <Image
              loading="lazy"
              src={thumbnailUrl}
              alt={`Highlight from ${highlight.title || 'episode'}`}
              fit="cover"
              w="full"
              h="full"
              position="absolute"
              zIndex="-1"
              style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform, opacity' }}
            />

            <Box position="absolute" top="4" width="full" textAlign="center" p={2} borderRadius="md">
              <Link
                href={`/NowPlaying/${episode.id}`}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              ></Link>
            </Box>
          </>
        )}

      <IconButton
        aria-label={isPlaying ? 'Pause' : 'Play'}
        icon={isPlaying ? <FaPause /> : <FaPlay />}
        onClick={handlePlayPauseClick}
        size="lg"
        isRound
        colorScheme="white"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      />

        {isFullScreenMode && (
          <>
            <Text color="white" fontSize="lg" fontWeight="bold" noOfLines={2} position="absolute" bottom="1" width="full" p={2} bg="blackAlpha.800">
              {t('highlight.title')}: {highlight.title}
            </Text>
            <Progress value={(currentTime / duration) * 100} size="xs" colorScheme="red" position="absolute" bottom="0" width="full" />
          </>
        )}
      </Box>

      <Box position="fixed" bottom="0" right="0" zIndex="1000" width="full" bg="blackAlpha.800" p={2} display="flex" alignItems="center" justifyContent="center">
        {isFullScreenMode && (
          <VStack spacing={2} position="absolute" bottom="5" width="full" alignItems="center" px={4}>
            {episode && (
              <>
                <Link href={`/NowPlaying/${episode.id}`}>
                  <Text fontSize={['md', 'lg']} color="whiteAlpha.900" fontWeight="bold">
                    {t('highlight.episode')}: {episode.episodeName}
                  </Text>
                </Link>
                <Text fontSize={['sm', 'md']} color="whiteAlpha.900">
                  {t('highlight.podcast')}: {episode.podcastName}
                </Text>
              </>
            )}
          </VStack>
        )}
      </Box>
    </>
  )
}

export default HighlightTicket
