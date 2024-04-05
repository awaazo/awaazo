import { useState, useEffect, FormEvent } from 'react'
import { Box, Button, Icon, FormControl, Textarea, VStack, HStack, Text, Input, FormHelperText, Flex, IconButton, useBreakpointValue, Spacer } from '@chakra-ui/react'
import { MdBookmark, MdBookmarkAdd } from 'react-icons/md'
import BookmarksHelper from '../../helpers/BookmarksHelper'
import { convertTime } from '../../utilities/commonUtils'
import { EpisodeBookmarkRequest } from '../../types/Requests'
import { Bookmark } from '../../types/Interfaces'
import { FaTrash } from 'react-icons/fa'

const Bookmarks = ({ episodeId, selectedTimestamp }) => {
  const fontSize = useBreakpointValue({ base: 'md', md: 'lg' })
  const [formData, setFormData] = useState({ title: '', note: '' })
  const [characterCounts, setCharacterCounts] = useState({ title: 0, note: 0 })
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(null)
  const [deletedBookmark, setDeletedBookmark] = useState()
  const [bookmarkError, setBookmarkError] = useState('')
  const MAX_CHARS = { title: 25, note: 250 }
  const [refresh, setRefresh] = useState(false)
  const [showBookmarkForm, setShowBookmarkForm] = useState(false)
  const [bookmarkTimestamp, setbookmarkTimestamp] = useState(0)

  const handleRefresh = () => {
    setRefresh(!refresh)
  }

  const handleChange = (field) => (e) => {
    const value = e.target.value.slice(0, MAX_CHARS[field])
    setFormData({ ...formData, [field]: value })
    setCharacterCounts({ ...characterCounts, [field]: value.length })
  }

  useEffect(() => {
    if (episodeId) {
      BookmarksHelper.getAllBookmarks(episodeId)
        .then((res) => {
          if (res.status === 200) {
            setBookmarks(res.bookmarks)
          } else {
            console.error('Error fetching bookmarks data:', res.message)
          }
        })
        .catch((error) => console.error('Error fetching bookmarks data:', error))
    }
  }, [episodeId, refresh])

  const handleDeleteBookmark = (bookmarkId) => {
    console.log('id: ', bookmarkId)
    // Send the request to delete bookmark
    BookmarksHelper.deleteEpisodeBookmark(bookmarkId).then((response) => {
      if (response.status === 200) {
        setDeletedBookmark(bookmarkId)
        handleRefresh()
      } else {
        console.error('Error deleting bookmark', response.message)
      }
    })
  }

  const handleBookmark = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.note) {
      setBookmarkError('Bookmark Title and Note are Both Required')
      return
    }

    const request: EpisodeBookmarkRequest = {
      title: formData.title,
      note: formData.note,
      time: bookmarkTimestamp,
    }

    try {
      const response = await BookmarksHelper.postBookmark(episodeId, request)
      if (response.status === 200) {
        setFormData({ title: '', note: '' })
        handleRefresh()
        setShowBookmarkForm(false)
        setBookmarkError('')
      } else {
        console.error('Error bookmarking episode:', response.message)
      }
    } catch (error) {
      console.error('Error bookmarking episode:', error)
    }
  }

  return (
    <>
      <VStack spacing={5} align="center" p={5} maxHeight={'calc(88vh - 5em)'}>
        <Box p={4} bg="rgba(255, 255, 255, 0.08)" rounded="xl" w="full" backdropFilter="blur(10px)">
          {!showBookmarkForm ? (
            <HStack align="center" justify="space-between">
              <HStack>
                <Icon as={MdBookmark} color="az.red" boxSize="24px" />
                <Text fontSize="18px" fontWeight="bold">
                  Bookmarks:
                </Text>
              </HStack>
              <HStack>
                <Spacer />
                <Button
                  bg="transparent"
                  onClick={() => {
                    setShowBookmarkForm(true)
                    setbookmarkTimestamp(selectedTimestamp)
                  }}
                >
                  <Text fontSize="20px" color="az.yellow" fontWeight={'bold'}>
                    {convertTime(selectedTimestamp)}
                  </Text>{' '}
                  <Icon as={MdBookmarkAdd} color="az.yellow" boxSize="24px" />
                </Button>
              </HStack>
            </HStack>
          ) : (
            <HStack align="center" justify="space-between">
              <HStack>
                <Icon as={MdBookmarkAdd} color="az.red" boxSize="24px" />
                <Text fontSize="24px" color="az.red" fontWeight={'bold'}>
                  {convertTime(bookmarkTimestamp)}
                </Text>{' '}
              </HStack>
              <HStack>
                <Spacer />
                <Button variant={'ghost'} onClick={() => setShowBookmarkForm(false)} bg="transparent">
                  {' '}
                  <Text fontSize="20px" color="az.yellow" fontWeight={'bold'}>
                    Cancel
                  </Text>{' '}
                </Button>
              </HStack>
            </HStack>
          )}
        </Box>

        {showBookmarkForm ? (
          <VStack position="relative" width="100%" p={'20px'}>
            {bookmarkError && <Text color="red.500">{bookmarkError}</Text>}
            <FormControl isInvalid={characterCounts.title > MAX_CHARS.title} width="100%">
              <Input placeholder="Enter A Title" rounded="xl" value={formData.title} onChange={handleChange('title')} maxLength={MAX_CHARS.title} />
              <FormHelperText textAlign="right">
                {characterCounts.title}/{MAX_CHARS.title}
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={characterCounts.note > MAX_CHARS.note} width="100%">
              <Textarea maxHeight={'50px'} placeholder="Enter A Note" value={formData.note} onChange={handleChange('note')} maxLength={MAX_CHARS.note} h="10rem" />
              <FormHelperText textAlign="right">
                {characterCounts.note}/{MAX_CHARS.note}
              </FormHelperText>
            </FormControl>

            <Button leftIcon={<Icon as={MdBookmarkAdd} />} onClick={handleBookmark} bg="az.red" borderRadius={'10px'}>
              Add Bookmark
            </Button>
          </VStack>
        ) : (
          <VStack spacing={3} align="start" width="100%" mb={4} ml={'15px'} mr={'15px'} overflowY="scroll" maxHeight={'75vh'}>
            {bookmarks && bookmarks.length > 0 ? (
              bookmarks.map((bookmark, index) => (
                <Box key={index} bg="rgba(255, 255, 255, 0.02)" borderRadius="2xl" p={4} _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }} w="100%">
                  <Flex justify="space-between" align="center">
                    <Text fontSize={'20px'} color="white" fontWeight={'bold'}>
                      {bookmark.title}
                    </Text>
                    <IconButton
                      icon={<Icon as={FaTrash} />}
                      variant={'ghost'}
                      color={'az.red'}
                      aria-label="Delete Bookmark"
                      data-cy={`delete-bookmark-id:`}
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      size="md"
                    />
                  </Flex>

                  <Text fontSize={'16px'} color="gray">
                    {convertTime(bookmark.time)}
                  </Text>

                  <Text fontSize={'18px'} color="white">
                    {bookmark.note}
                  </Text>
                </Box>
              ))
            ) : (
              <Text color="gray" mt={'50px'} textAlign={'center'}>
                You have no bookmarks for this episode.
              </Text>
            )}
          </VStack>
        )}
      </VStack>
    </>
  )
}

export default Bookmarks
