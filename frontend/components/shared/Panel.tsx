import React from 'react'
import { Box, IconButton, Flex, useBreakpointValue } from '@chakra-ui/react'
import { usePanel } from '../../utilities/PanelContext'
import { usePlayer } from '../../utilities/PlayerContext'
import ChatBot from '../interactionHub/ChatBot'
import Comments from '../interactionHub/Comments'
import Bookmarks from '../interactionHub/Bookmarks'
import Tipjar from '../interactionHub/Tipjar'
import { Bookmark, Dollar, Chat, Document, Waazo, ArrowR, ArrowL } from '../../public/icons'
import TranscriptComp from '../nowPlaying/Transcript'

const Panel = () => {
  const { state: panelState, dispatch: panelDispatch } = usePanel()
  const { state: playerState, dispatch: playerDispatch } = usePlayer()

  console.log('panelState', panelState)
  console.log('playerState', playerState)

  const togglePanel = () => {
    panelDispatch({ type: 'TOGGLE_PANEL', payload: panelState.content })
  }

  const openPanel = (content) => {
    panelDispatch({ type: 'OPEN_PANEL', payload: content })
  }

  const panelWidth = () => {
    if (playerState.episode && playerState.episode.id && panelState.isOpen) {
      if (isMobile) return '95%'
      return '32%'
    } else if (playerState.episode && playerState.episode.id && !panelState.isOpen) {
      return '60px'
    } else {
      return '0px'
    }
  }

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box
      position="fixed"
      right="0"
      top="5em"
      transition="width 0.5s ease-in-out"
      w={panelWidth()}
      h="calc(88vh - 7em)"
      p={panelState.isOpen ? '10px' : '0'}
      zIndex={1000000} 
      bg="linear-gradient(180deg, #1D1D1D, #2A2A2A)"
      border={'2px solid rgba(255, 255, 255, 0.03)'}
      roundedTopLeft="20px"
      roundedBottomLeft="20px"
    >
      {panelState.isOpen ? (
        <Flex position="absolute" left="0" top="50%" transform="translateY(-50%)" zIndex="1">
          <Box borderRadius="full" bg="linear-gradient(180deg, #1D1D1D, #2A2A2A)" transform="translateX(-55%) " >
            <IconButton
              aria-label="Open Panel"
              transform={'translateX(-15%)'}
              icon={<ArrowR />}
              onClick={togglePanel}
              variant="ghost"
              color="#FFFFFF"
              _hover={{ textDecoration: 'none', color: 'red.300' }}
              _active={{ background: 'transparent' }}
            />
          </Box>
        </Flex>
      ) : (
        panelState.content && (
          <Flex position="absolute" left="0" top="50%" transform="translateY(-50%) translateX(-55%)" zIndex="1" >
            <Box borderRadius="full" bg="linear-gradient(180deg, #1D1D1D, #2A2A2A)">
              <IconButton
                transform={'translateX(-15%)'}
                aria-label="Close Panel"
                icon={<ArrowL />}
                onClick={togglePanel}
                variant="ghost"
                color="#FFFFFF"
                _hover={{ textDecoration: 'none', color: 'az.red' }}
                _active={{ background: 'transparent' }}
              />
            </Box>
          </Flex>
        )
      )}
      {playerState.episode && playerState.episode.id && !panelState.isOpen && (
        <Flex direction="column" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" alignItems="center" justifyContent="center" gap="10px">
          <IconButton
            aria-label="Open Comments"
            fontSize={'20'}
            icon={<Chat />}
            onClick={() => openPanel('Comments')}
            variant="ghost"
            color="#FFFFFF"
            _hover={{ textDecoration: 'none', color: 'az.red' }}
            _active={{ background: 'transparent' }}
            
          />

          <IconButton
            aria-label="Open Chat"
            fontSize={'20'}
            icon={<Waazo />}
            onClick={() => openPanel('ChatBot')}
            variant="ghost"
            color="#FFFFFF"
            _hover={{ textDecoration: 'none', color: 'az.red' }}
            _active={{ background: 'transparent' }}
          />
          <IconButton
            aria-label="Open Transcript"
            fontSize={'20'}
            icon={<Document />}
            onClick={() => openPanel('Transcript')}
            variant="ghost"
            color="#FFFFFF"
            _hover={{ textDecoration: 'none', color: 'az.red' }}
            _active={{ background: 'transparent' }}
          />
          <IconButton
            aria-label="Open Bookmarks"
            icon={<Bookmark />}
            fontSize={'20'}
            onClick={() => openPanel('Bookmarks')}
            variant="ghost"
            color="#FFFFFF"
            _hover={{ textDecoration: 'none', color: 'az.red' }}
            _active={{ background: 'transparent' }}
          />
          <IconButton
            aria-label="Open Tipjar"
            icon={<Dollar />}
            fontSize={'20'}
            onClick={() => openPanel('Tipjar')}
            variant="ghost"
            color="#FFFFFF"
            _hover={{ textDecoration: 'none', color: 'az.red' }}
            _active={{ background: 'transparent' }}
          />
        </Flex>
      )}
      {panelState.isOpen && (
        <Box overflow={'hidden'}>
          {panelState.content === 'ChatBot' && playerState.episode.id && <ChatBot episodeId={playerState.episode.id} />}
          {panelState.content === 'Comments' && <Comments episodeIdOrCommentId={playerState.episode.id} initialComments={0} />}
          {panelState.content === 'Transcript' && playerState.episode.id && <TranscriptComp episodeId={playerState.episode.id} />}
          {panelState.content === 'Bookmarks' && playerState.episode.id && <Bookmarks episodeId={playerState.episode.id} selectedTimestamp={panelState.selectedTimestamp} />}
          {panelState.content === 'Tipjar' && playerState.episode.id && <Tipjar episodeId={playerState.episode.id} totalPoint={undefined} />}
        </Box>
         
      )}
    </Box>
  )
}
export default Panel
