// PlaylistMenu.tsx
import React, { useState } from 'react'
import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem, MenuDivider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { usePlayer } from '../../utilities/PlayerContext'
import { CgPlayListSearch, CgPlayListAdd, CgPlayListRemove } from 'react-icons/cg'
import ShareComponent from '../interactionHub/Share'
import { Dots } from '../../public/icons/'
import { MdOutlinePodcasts } from 'react-icons/md'
import { IoShare } from 'react-icons/io5'
import ViewQueueModal from '../playlist/ViewQueueModal'
import AddToPlaylistModal from '../playlist/AddToPlaylistModal'
import AuthHelper from '../../helpers/AuthHelper'
import LoginPrompt from '../auth/AuthPrompt'

const PlayerMenu = ({ episode }) => {
  const { dispatch } = usePlayer()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const onShareModalClose = () => setIsShareModalOpen(false)
  const onShareModalOpen = () => setIsShareModalOpen(true)

  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false)
  const onQueueModalClose = () => setIsQueueModalOpen(false)
  const onQueueModalOpen = () => setIsQueueModalOpen(true)

  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false)
  const onAddToPlaylistModalClose = () => setIsAddToPlaylistModalOpen(false)
  const onAddToPlaylistModalOpen = () => setIsAddToPlaylistModalOpen(true)

  // State to track whether the menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen)

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const handleAddPlaylistClick = () => {
    console.log('Clicked')
    AuthHelper.authMeRequest().then((response) => {
      if (response.status === 401) {
        console.log('User not logged in')
        onAddToPlaylistModalClose()
        setShowLoginPrompt(true)
        return
      } else {
        onAddToPlaylistModalOpen()
      }
    })
  }
  const handleRemoveFromQueue = () => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: episode })
  }

  return (
    <Box position="relative" zIndex={9999} data-cy={`3-dots`}>
      <Menu isOpen={isMenuOpen} onClose={handleMenuToggle} >
        <MenuButton as={IconButton} aria-label="Options" icon={<Dots />} variant="minimal" fontSize="20px" ml={1} onClick={handleMenuToggle} />
        <MenuList backgroundColor="rgba(50, 50, 50, 0.8)" backdropFilter="blur(4px)">
          <MenuItem
            onClick={() => {
              handleAddPlaylistClick()
              onAddToPlaylistModalOpen()
            }}
          >
            <CgPlayListAdd size="20px" style={{ marginRight: '10px', color: 'white' }} />
            <Text fontSize={'sm'}>Add to Playlist</Text>
          </MenuItem>

          <MenuDivider />
          <MenuItem onClick={onQueueModalOpen}>
            <CgPlayListSearch size="18px" style={{ marginRight: '10px', color: 'white' }} />
            <Text fontSize={'sm'}> View Queue</Text>
          </MenuItem>
          <MenuItem onClick={handleRemoveFromQueue}>
            <CgPlayListRemove size="18px" style={{ marginRight: '10px', color: 'white' }} />
            <Text fontSize={'sm'}> Remove from Queue</Text>
          </MenuItem>
          <Link href={'Explore/' + episode?.podcastId} style={{ textDecoration: 'none' }}>
            <MenuItem>
              <MdOutlinePodcasts size="18px" style={{ marginRight: '10px', color: 'white' }} />
              <Text fontSize={'sm'}> Go to Podcast Page</Text>
            </MenuItem>
          </Link>

          <MenuDivider />
          <MenuItem onClick={onShareModalOpen}>
            <IoShare size="20px" style={{ marginRight: '10px', color: 'white' }} /> <Text fontSize={'sm'}>Share</Text>
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={isShareModalOpen} onClose={onShareModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShareComponent content={episode} contentType="episode" />
          </ModalBody>
        </ModalContent>
      </Modal>
      <ViewQueueModal isOpen={isQueueModalOpen} onClose={onQueueModalClose} />
      <AddToPlaylistModal episode={episode} isOpen={isAddToPlaylistModalOpen} onClose={onAddToPlaylistModalClose} />
      {showLoginPrompt && (
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="To add this episode to your playlist, you must be logged in. Please log in or create an account."
        />
      )}
    </Box>
  )
}

export default PlayerMenu
