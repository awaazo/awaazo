import React from 'react'
import { Box, IconButton, Flex, useBreakpointValue } from '@chakra-ui/react'
import { usePanel } from '../../utilities/PanelContext'
import { usePlayer } from '../../utilities/PlayerContext'
import ChatBot from '../interactionHub/waazo/WaazoPanel'
import Comments from '../interactionHub/comments/CommentsPanel'
import Bookmarks from '../interactionHub/bookmarks/BookmarksPanel'
import Tipjar from '../interactionHub/tipJar/Tipjar'
import { Bookmark, Dollar, Chat, Document, Waazo, ArrowR, ArrowL } from '../../public/icons'
import TranscriptComp from '../interactionHub/Transcript'

const Panel = () => {
  const { state: panelState, dispatch: panelDispatch } = usePanel()
  const { state: playerState, dispatch: playerDispatch } = usePlayer()


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
      h="calc(88vh - 5em)"
      p={panelState.isOpen ? '10px' : '0'}
      zIndex={1000000} 
      bg="az.darkestGrey"
      roundedTopLeft="10px"
      roundedBottomLeft="10px"
    >
      {panelState.isOpen ? (
        <Flex position="absolute" left="0" top="50%" transform="translateY(-50%)" zIndex="1">
          <Box borderRadius="full" bg="az.darkestGrey" transform="translateX(-55%) " >
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
            <Box borderRadius="full" bg="az.darkestGrey">
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
          {panelState.content === 'Bookmarks' && playerState.episode.id && <Bookmarks episodeId={playerState.episode.id} selectedTimestamp={playerState.selectedTimestamp} />}
          {panelState.content === 'Tipjar' && playerState.episode.id && <Tipjar episodeId={playerState.episode.id} totalPoint={undefined} />}
        </Box>
         
      )}
    </Box>
  )
}
export default Panel
