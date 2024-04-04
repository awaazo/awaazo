import React, { useState, useEffect } from 'react'
import { Box, Image, VStack, IconButton, useBreakpointValue, Text, Link, Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton } from '@chakra-ui/react'
import { FaPlay, FaPause, FaShare } from 'react-icons/fa'
import { usePlayer } from '../../utilities/PlayerContext'
import Likes from '../interactionHub/Likes'
import CommentButton from '../interactionHub/buttons/CommentButton'
import HighlightHelper from '../../helpers/HighlightHelper'
import ShareComponent from '../interactionHub/Share'
import PodcastHelper from '../../helpers/PodcastHelper'
import { set } from 'lodash'

const HighlightTicket = ({ highlight, onOpenFullScreen, isFullScreenMode }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState(new Audio())
  const [episode, setEpisode] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const { dispatch, state } = usePlayer()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const onShareModalClose = () => setIsShareModalOpen(false)
  const onShareModalOpen = () => setIsShareModalOpen(true)

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

    fetchData() // Call the async function
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

  return (
    <Box height="150px" width="150px" borderRadius={'150px'} position="relative" overflow={'hidden'} onClick={() => (!isFullScreenMode && onOpenFullScreen ? onOpenFullScreen() : undefined)}>
      {episode && (
        <>
          <Image src={thumbnailUrl} alt={`Highlight from ${highlight.title || 'episode'}`} fit="cover" w="full" h="full" position="absolute" zIndex="-1" />

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
        colorScheme="whiteAlpha"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      />
    </Box>
  )
}

export default HighlightTicket
