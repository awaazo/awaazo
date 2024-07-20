import { useState, useEffect, FormEvent } from 'react'
import { Box, Button, Icon, FormControl, Textarea, VStack, HStack, Text, Input, FormHelperText, Flex, IconButton, useBreakpointValue, Spacer, InputGroup } from '@chakra-ui/react'
import BookmarksHelper from '../../../helpers/BookmarksHelper'
import { convertTime } from '../../../utilities/commonUtils'
import { EpisodeBookmarkRequest } from '../../../types/Requests'
import { Bookmark } from '../../../types/Interfaces'
import { Trash } from '../../../public/icons'
import { MdBookmark, MdBookmarkAdd } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

const Bookmarks = ({ episodeId, selectedTimestamp }) => {
  const { t } = useTranslation()
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
      setBookmarkError(t('bookmarks.title_and_note_required'))
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
        console.error(t('bookmarks.error_bookmarking_episode'), response.message)
      }
    } catch (error) {
      console.error(t('bookmarks.error_bookmarking_episode'), error)
    }
  }

  return (
    <>
      <VStack spacing={5} align="center" p={5} maxHeight={'calc(88vh - 5em)'}>
        <Box rounded="xl" w="full" backdropFilter="blur(10px)">
          {!showBookmarkForm ? (
            <HStack align="center" justify="space-between">
              <HStack>
                <Icon as={MdBookmark} color="az.red" boxSize="24px" />
                <Text fontSize="md" fontWeight="bold">
                  {t('bookmarks.title')}
                </Text>
              </HStack>
              <HStack>
                <Spacer />
                <Button
                  variant={'minimal'}
                  onClick={() => {
                    setShowBookmarkForm(true)
                    setbookmarkTimestamp(selectedTimestamp)
                  }}
                  color="az.yellow"
                >
                  <Text fontSize="md"  fontWeight={'bold'} mr={'8px'}>
                    {convertTime(selectedTimestamp)}
                  </Text>
                  <Icon as={MdBookmarkAdd}  boxSize="24px" />
                </Button>
              </HStack>
            </HStack>
          ) : (
            <HStack align="center" justify="space-between">
              <HStack>
                <Icon as={MdBookmarkAdd} color="az.red" boxSize="24px" />
                <Text fontSize="md" color="az.red" fontWeight={'bold'}>
                  {convertTime(bookmarkTimestamp)}
                </Text>
              </HStack>
              <HStack>
                <Spacer />
                <Button variant={'minimal'} onClick={() => setShowBookmarkForm(false)} color="az.yellow" >
                  <Icon as={MdBookmark} boxSize="24px" />
                </Button>
              </HStack>
            </HStack>
          )}
        </Box>

        {showBookmarkForm ? (
          <VStack position="relative" width="100%" p={'20px'}>
            {bookmarkError && <Text color="red.500">{bookmarkError}</Text>}
            <FormControl isInvalid={characterCounts.title > MAX_CHARS.title} width="100%">
              <Input placeholder={t('bookmarks.enter_title')} rounded="xl" value={formData.title} onChange={handleChange('title')} maxLength={MAX_CHARS.title} />
              <FormHelperText textAlign="right">
                {characterCounts.title}/{MAX_CHARS.title}
              </FormHelperText>
            </FormControl>

            <FormControl isInvalid={characterCounts.note > MAX_CHARS.note} width="100%">
              <InputGroup>
                <Textarea value={formData.note} onChange={handleChange('note')} placeholder={t('bookmarks.enter_notes')} />
                <Button variant={'minimalColor'} width="18px" height="18px" position="absolute" zIndex={'50'} right="10px" bottom="10px" onClick={handleBookmark} p="0">
                  <MdBookmarkAdd color="az.yellow" fontSize={'20px'} />
                </Button>
              </InputGroup>

              <FormHelperText textAlign="right">
                {characterCounts.note}/{MAX_CHARS.note}
              </FormHelperText>
            </FormControl>
          </VStack>
        ) : (
          <VStack spacing={3} align="start" width="100%" mb={4} ml={'15px'} mr={'15px'}>
            {bookmarks && bookmarks.length > 0 ? (
              <Box overflowY="scroll" maxHeight={'55vh'} width={'100%'}>
                {bookmarks.map((bookmark, index) => (
                  <VStack mb={'15px'} key={index} align="right" bg="az.darkGrey" borderRadius="15px" p={4} _hover={{ bg: 'az.darkerGrey' }} w="100%">
                    
                    <HStack justify="space-between" width={'100%'}>
                      <VStack width={'100%'} spacing={0} align="right">
                      <Text fontSize={'md'} color="white" fontWeight={'bold'}>
                        {bookmark.title}
                      </Text>
                      <Text fontSize={'sm'} color="az.greyish" mt={'-4px'} fontWeight={"bold"}>
                      {convertTime(bookmark.time)}
                    </Text>
                    </VStack>
                      <IconButton
                        icon={<Icon as={Trash} />}
                        variant={'minimal'}
                        color={'az.red'}
                        aria-label={t('bookmarks.delete_bookmark')}
                        data-cy={`delete-bookmark-id:`}
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        size="md"
                      />
                    </HStack>
                  
                   
                    <Text fontSize={'sm'} color="white" opacity={'0.8'} > 
                      {bookmark.note}
                    </Text>
                  </VStack>
                ))}
              </Box>
            ) : (
              <Text color="gray" mt={'50px'} textAlign={'center'} width={'100%'}>
                {t('bookmarks.no_bookmarks')}
              </Text>
            )}
          </VStack>
        )}
      </VStack>
    </>
  )
}

export default Bookmarks
