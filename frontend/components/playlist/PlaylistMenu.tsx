// PlaylistMenu.tsx
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Menu,
  MenuButton,
  IconButton,
  Input,
  Textarea,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Switch,
  Text,
} from '@chakra-ui/react'
import {  BsFillSkipForwardFill } from 'react-icons/bs'
import { TbPlayerTrackNextFilled } from 'react-icons/tb'
import { MdDelete } from 'react-icons/md'
import { usePlayer } from '../../utilities/PlayerContext'
import PlaylistHelper from '../../helpers/PlaylistHelper'
import ImageAdder from '../assets/ImageAdder'
import { Dots, Pen } from '../../public/icons'
import { useRouter } from 'next/router'
import ShareComponent from '../interactionHub/Share'
import { IoShare } from 'react-icons/io5'

const PlaylistMenu = ({ playlist, onUpdate }) => {
  const { dispatch } = usePlayer()
  const toast = useToast()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [name, setName] = useState(playlist.name)
  const [description, setDescription] = useState(playlist.description)
  const [playlistCoverArt, setPlaylistCoverArt] = useState<File | null>(null)
  const router = useRouter()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const onShareModalOpen = () => setIsShareModalOpen(true)
  const onShareModalClose = () => setIsShareModalOpen(false)
  const [privacy, setPrivacy] = useState(playlist.privacy)

  // Function to handle deletion of the playlist
  const handleDelete = async (id) => {
    setDeleting(true)
    const response = await PlaylistHelper.playlistDeleteRequest(playlist.id)
    if (response.status === 200) {
      window.location.href = '/Playlist/MyPlaylists'
    } else {
      toast({
        title: 'Error deleting playlist',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    onClose()
    setDeleting(false)
  }
  // Handler functions for play actions
  const handlePlayNextClick = () => {
    dispatch({
      type: 'ADD_PLAYLIST_NEXT',
      payload: playlist,
    })
  }
  const handlePlaylistLaterClick = () => {
    dispatch({
      type: 'ADD_PLAYLIST_LATER',
      payload: playlist,
    })
  }

  const handlePlaylistClick = () => {
    dispatch({
      type: 'PLAY_PLAYLIST_NOW',
      payload: playlist,
    })
  }

  const handleMenuItemClick = (action) => {
    if (action === 'playNext') {
      handlePlayNextClick()
      toast({
        title: 'Playlist added to queue',
        status: 'info',
        position: 'bottom-right',
        duration: 3000,
        isClosable: true,
      })
    } else if (action === 'playLater') {
      handlePlaylistLaterClick()
      toast({
        title: 'Playlist added to queue',
        status: 'info',
        position: 'bottom-right',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Open and close edit modal
  const openEditModal = () => setEditModalOpen(true)
  const closeEditModal = () => setEditModalOpen(false)

  useEffect(() => {
    setName(playlist.name)
    setDescription(playlist.description)
    setPrivacy(playlist.privacy)
  }, [playlist])

  // Handle save logic for editing a playlist
  const handleSaveEdit = async () => {
    if (!playlist.id) {
      toast({
        title: 'Playlist ID is missing',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const request = {
      name: name,
      description: description,
      privacy: privacy,
      coverArt: playlistCoverArt,
    }

    const response = await PlaylistHelper.playlistEditRequest(request, playlist.id, playlistCoverArt)
    if (response.status === 200) {
      toast({
        position: 'top',
        title: 'Playlist updated successfully',
        status: 'success',
        duration: 1000,
        isClosable: true,
      })
      const updatedPlaylist = {
        ...playlist,
        name: name,
        description: description,
        privacy: privacy,
        lastUpdated: new Date().toISOString(), // Update the lastUpdated field
        // Include other updated fields if applicable
      }
      window.dispatchEvent(new CustomEvent('playlistUpdated', { detail: updatedPlaylist }))
      // Update the parent component's state
      onUpdate(updatedPlaylist)
    } else {
      toast({
        position: 'top',
        title: 'Error updating playlist',
        status: 'error',
        duration: 1000,
        isClosable: true,
      })
    }
    closeEditModal()
  }

  // State to track whether the menu is open or not
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen)

  const handleImageAdded = useCallback(async (addedImageUrl: string) => {
    try {
      const response = await fetch(addedImageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'avatar.jpg', { type: blob.type })
      setPlaylistCoverArt(file)
    } catch (error) {
      console.error('Error converting image URL to File:', error)
    }
  }, [])

  return (
    <Box position="relative" data-cy={`3-dots`}>
      <Menu isOpen={isMenuOpen} onClose={handleMenuToggle}>
        <MenuButton as={IconButton} aria-label="Options" icon={<Dots />} variant="minmal" fontSize="18px" onClick={handleMenuToggle} />
        <MenuList backgroundColor="rgba(50, 50, 50, 0.8)" backdropFilter="blur(4px)">
          <MenuItem onClick={() => handleMenuItemClick('playNext')}>
            <TbPlayerTrackNextFilled size="16px" style={{ marginRight: '10px', color: 'white' }} /> <Text>Play Next</Text>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('playLater')}>
            <BsFillSkipForwardFill size="16px" style={{ marginRight: '10px', color: 'white' }} /> <Text>Play Later</Text>
          </MenuItem>

          {playlist.isHandledByUser && (
            <>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  openEditModal()
                  handleMenuToggle()
                }}
              >
                <Pen style={{ marginRight: '10px', color: 'white'  }} data-cy={`edit-button`} /> <Text>Edit "{playlist.name}"</Text>
              </MenuItem>
              <MenuItem style={{ color: 'red' }} onClick={onOpen}>
                <MdDelete size={'18px'} style={{ marginRight: '10px', color: 'red' }} data-cy={`delete-button`} />
                <Text> Delete "{playlist.name}" </Text>
              </MenuItem>
            </>
          )}
          <MenuItem onClick={onShareModalOpen}>
          <IoShare size="18px" style={{ marginRight: '10px', color: 'white' }} />
             <Text>Share</Text>
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={isShareModalOpen} onClose={onShareModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share this Playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShareComponent content={playlist} contentType="playlist" />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the episode "{playlist.name}". <br />
            This action cannot be undone
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={() => handleDelete(playlist.id)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={closeEditModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Playlist</ModalHeader>
        
          <ModalBody>
            <ImageAdder onImageAdded={handleImageAdded} />

            <FormControl>
              <Input placeholder="Playlist Name" value={name} onChange={(e) => setName(e.target.value)} data-cy={`edit-playlist-name-form`} focusBorderColor="brand.100" />
            </FormControl>

            <FormControl mt={4}>
              <Textarea placeholder="Playlist Description" value={description} onChange={(e) => setDescription(e.target.value)} focusBorderColor="brand.100" />
            </FormControl>

            <FormControl display="flex" alignItems="center" justifyContent="center" mt={4}>
              <FormLabel htmlFor="privacy-switch" mb="0">
                Private:
              </FormLabel>
              <Switch id="privacy-switch" isChecked={privacy === 'Private'} onChange={(e) => setPrivacy(e.target.checked ? 'Private' : 'Public')} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant={"normal"} mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant={"normal"} color={"az.offwhite"} bg={"az.darkGrey"}  onClick={closeEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default PlaylistMenu
