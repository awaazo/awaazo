import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  VStack,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Switch,
  HStack,
  Divider,
  useBreakpointValue,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'
import { Search } from '../../public/icons'
import { IoFilterSharp } from 'react-icons/io5'
import PodcastHelper from '../../helpers/PodcastHelper'
import UserProfileHelper from '../../helpers/UserProfileHelper'
import PodcastCard from '../../components/cards/PodcastCard'
import UserCard from '../../components/cards/UserCard'
import EpisodeCard from '../../components/cards/EpisodeCard'
import GenreSelector from '../../components/assets/GenreSelector'
import ForYou from '../../components/home/ForYou'
import ExploreGenres from '../../components/explore/ExploreGenres'
import { formatSecToDurationString } from '../../utilities/commonUtils'
import { FaXmark } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

export default function MyPodcast() {
  const { t } = useTranslation();
  const { isOpen: isPodcastModalOpen, onOpen: onPodcastModalOpen, onClose: onPodcastModalClose } = useDisclosure()
  const { isOpen: isEpisodeModalOpen, onOpen: onEpisodeModalOpen, onClose: onEpisodeModalClose } = useDisclosure()
  const router = useRouter()

  const { searchTerm } = router.query

  //Page Values
  const [searchInput, setSearchInput] = useState('')
  const [podcasts, setPodcasts] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [users, setUsers] = useState([])
  const [loadingPodcasts, setLoadingPodcasts] = useState(false)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [getError, setGetError] = useState('')

  const [podcastFilter, setPodcastFilter] = useState({
    tags: null,
    type: null,
    isExplicit: null,
    ratingGreaterThan: null,
    releaseDate: null,
  })
  const [episodeFilter, setEpisodeFilter] = useState({
    isExplicit: null,
    releaseDate: null,
    minEpisodeLength: null,
  })

  const [episodeRefresh, setEpisodeRefresh] = useState(false)
  const handleEpisodeRefresh = () => {
    setEpisodeRefresh(!episodeRefresh)
  }

  const [podcastRefresh, setPodcastRefresh] = useState(false)
  const handlePodcastRefresh = () => {
    setPodcastRefresh(!podcastRefresh)
  }

  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    if (searchTerm != '' && searchTerm != null && searchTerm != undefined) {
      fetchPodcasts()
    }
  }, [searchTerm, podcastRefresh])

  useEffect(() => {
    if (searchTerm != '' && searchTerm != null && searchTerm != undefined) {
      fetchEpisodes()
    }
  }, [searchTerm, episodeRefresh])

  useEffect(() => {
    if (searchTerm != '' && searchTerm != null && searchTerm != undefined) {
      fetchUsers()
    }
  }, [searchTerm])

  // Async functions to fetch podcasts, episodes, and users from an API
  const fetchPodcasts = async () => {
    setLoadingPodcasts(true)
    const requestData = { searchTerm: searchTerm, ...podcastFilter }
    try {
      const res = await PodcastHelper.podcastSearchPodcastsGet(0, 6, requestData)
      if (res.status === 200) {
        setPodcasts(res.podcasts)
      } else {
        setGetError('Podcasts cannot be fetched')
      }
    } catch (error) {
      setGetError('Error fetching podcasts')
    } finally {
      setLoadingPodcasts(false)
    }
  }

  const fetchEpisodes = async () => {
    setLoadingEpisodes(true)
    const requestData = { searchTerm: searchTerm, ...episodeFilter }
    try {
      const res = await PodcastHelper.podcastSearchEpisodeGet(0, 6, requestData)
      if (res.status === 200) {
        setEpisodes(res.episodes)
      } else {
        setGetError('Episodes cannot be fetched')
      }
    } catch (error) {
      setGetError('Error fetching episodes')
    } finally {
      setLoadingEpisodes(false)
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await UserProfileHelper.profileSearchProfilesGet(0, 9, searchTerm)
      if (res.status === 200) {
        setUsers(res.users)
        console.log(res.users)
      } else {
        setGetError('Users cannot be fetched')
      }
    } catch (error) {
      setGetError('Error fetching users')
    } finally {
      setLoadingUsers(false)
    }
  }

  // Function to handle search form submission
  const handleSearchSubmit = () => {
    router.push(
      {
        pathname: '/Explore/Search',
        query: { searchTerm: searchInput },
      },
      undefined,
      { shallow: true }
    )
  }

  const handlePodcastFilterChange = (name, value) => {
    setPodcastFilter((prev) => ({ ...prev, [name]: value }))
  }

  const handleEpisodeFilterChange = (name, value) => {
    setEpisodeFilter((prev) => ({ ...prev, [name]: value }))
  }

  // Functions to apply filters and fetch relevant data
  const applyPodcastFilter = () => {
    fetchPodcasts()
    onPodcastModalClose()
  }

  const applyEpisodeFilter = () => {
    fetchEpisodes()
    onEpisodeModalClose()
  }

  // Function to remove a specific tag from the podcast filter
  const removeTagFromFilter = (tagToRemove) => {
    setPodcastFilter((prev) => {
      const updatedTags = prev.tags.filter((tag) => tag !== tagToRemove)

      // Check if the updatedTags array is empty and set it to null if it is
      const newTags = updatedTags.length === 0 ? null : updatedTags

      return {
        ...prev,
        tags: newTags,
      }
    })
  }

  return (
    <>
      <Box px={['1em', '2em', '4em']}>
        <Flex
          alignItems="start"
          as="form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSearchSubmit()
          }}
          mt={4}
          mb={4}
          gridColumn="span 2"
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<Search color="az.Greyish" />} />
            <Input borderRadius={'25px'} width="400px" placeholder={t('search.placeholder')} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} pl="40px" />
          </InputGroup>
        </Flex>
        {searchTerm == '' || searchTerm == null ? (
          <>
            <Box mb={4}>
              <Text fontSize={['xl', '2xl']} fontWeight="bold" mb={3}>
                {t('explore.genres')}
              </Text>
              <ExploreGenres />
            </Box>
            <Box mb={4}>
              <ForYou />
            </Box>
          </>
        ) : (
          <>
            <Text fontSize="2xl" fontWeight="bold" mb={'25px'}>
              {t('search.resultsFor', { term: searchTerm })}
            </Text>
            <VStack spacing={4}>
              {/* Podcasts Section */}
              {!isMobile && <Divider />}
              <Flex align="center" justify="space-between" w="full">
                <HStack align="start">
                  <Text fontSize="2xl" fontWeight="bold" ml={'15px'}>
                  Podcasts
                  </Text>
                  {!isMobile && (
                    <>
                      {podcastFilter.tags &&
                        podcastFilter.tags.map((tag, index) => (
                          <Flex key={index} fontSize="md" color="gray.700" bg={'#8b8b8b'} padding={'5px'} fontWeight={'bold'} borderRadius={'8px'} alignItems="center" mr="2">
                            <Button
                              size="xs"
                              variant={'ghost'}
                              onClick={() => {
                                removeTagFromFilter(tag)
                                handlePodcastRefresh()
                              }}
                            >
                              <FaXmark />
                            </Button>
                            <Text>{tag}</Text>
                          </Flex>
                        ))}
                      {/* Display active podcast filters */}
                      {podcastFilter.isExplicit === false && (
                        <Flex fontSize="md" color="gray.700" bg={'#8b8b8b'} padding={'5px'} fontWeight={'bold'} borderRadius={'8px'} alignItems="center">
                          <Button
                            size="xs"
                            variant={'ghost'}
                            onClick={() => {
                              handlePodcastFilterChange('isExplicit', null)
                              handlePodcastRefresh()
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>{t('nonExplicit')}</Text>
                        </Flex>
                      )}

                      {podcastFilter.ratingGreaterThan !== null && (
                        <Flex fontSize="md" color="gray.700" bg={'#8b8b8b'} padding={'5px'} fontWeight={'bold'} borderRadius={'8px'} alignItems="center">
                          <Button
                            size="xs"
                            variant={'ghost'}
                            onClick={() => {
                              handlePodcastFilterChange('ratingGreaterThan', null)
                              handlePodcastRefresh()
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>{t('search.ratingGreaterThan', { rating: podcastFilter.ratingGreaterThan })}</Text>
                        </Flex>
                      )}
                    </>
                  )}
                </HStack>

                <Button onClick={onPodcastModalOpen} variant="ghost" mr={'15px'}>
                  {t('search.filter')}
                  <span style={{ marginRight: '10px' }}></span>
                  <IoFilterSharp />
                </Button>
              </Flex>
              {loadingPodcasts ? (
                <Spinner />
              ) : podcasts.length > 0 ? (
                <HStack alignSelf={'center'} spacing={5} width="100%" justify={isMobile ? 'center' : 'flex-start'} align={isMobile ? 'center' : 'stretch'}>
                  {podcasts.map((podcast) => (
                    <PodcastCard podcast={podcast} key={podcast.id} />
                  ))}
                </HStack>
              ) : (
                <Text fontWeight={'bold'} fontSize={'18px'} mt={'20px'} mb={'30px'}>
                  {t('noFound')}
                </Text>
              )}
              {/* Episodes Section */}
              {!isMobile && <Divider />}
              <Flex align="center" justify="space-between" w="full">
                <HStack align="start">
                  <Text fontSize="2xl" fontWeight="bold" ml={'15px'}>
                    {t('search.episodes')}
                  </Text>
                  {!isMobile && (
                    <>
                      {episodeFilter.isExplicit === false && (
                        <Flex fontSize="md" color="gray.700" bg={'#8b8b8b'} padding={'5px'} fontWeight={'bold'} borderRadius={'8px'} alignItems="center">
                          <Button
                            size="xs"
                            variant={'ghost'}
                            onClick={() => {
                              handleEpisodeFilterChange('isExplicit', null)
                              handleEpisodeRefresh()
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>{t('nonExplicit')}</Text>
                        </Flex>
                      )}

                      {episodeFilter.minEpisodeLength && (
                        <Flex fontSize="md" color="gray.700" bg={'#8b8b8b'} padding={'5px'} fontWeight={'bold'} borderRadius={'8px'} alignItems="center">
                          <Button
                            size="xs"
                            variant={'ghost'}
                            onClick={() => {
                              handleEpisodeFilterChange('minEpisodeLength', null)
                              handleEpisodeRefresh()
                            }}
                          >
                            <FaXmark />
                          </Button>
                          <Text>{t('episodes.minLength', { length: formatSecToDurationString(episodeFilter.minEpisodeLength) })}</Text>
                        </Flex>
                      )}
                    </>
                  )}
                </HStack>
                <Button onClick={onEpisodeModalOpen} variant="ghost" mr={'15px'}>
                  {t('episodes.filter')}
                  <span style={{ marginRight: '10px' }}></span>
                  <IoFilterSharp />
                </Button>
              </Flex>
              {loadingEpisodes ? (
                <Spinner />
              ) : episodes.length > 0 ? (
                <SimpleGrid columns={1} spacing={5} width="550px">
                  {episodes.map((episode) => (
                    <EpisodeCard key={episode.id} episode={episode} showLike={false} showComment={false} showMore={true} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text fontWeight={'bold'} fontSize={'18px'} mt={'20px'} mb={'30px'}>
                  {t('noFound')}
                </Text>
              )}
              {/* Users Section */}
              {!isMobile && <Divider />}
              <Flex align="center" justify="space-between" w="full">
                <Text fontSize="2xl" fontWeight="bold" ml={'15px'}>
                  {t('users')}
                </Text>
              </Flex>
              {loadingUsers ? (
                <Spinner />
              ) : users.length > 0 ? (
                <SimpleGrid columns={3} spacing={5} width="100%">
                  {users.map((user) => (
                    <UserCard user={user} key={user.id} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text fontWeight={'bold'} fontSize={'18px'} mt={'20px'} mb={'30px'}>
                  {t('users.noFound')}
                </Text>
              )}
            </VStack>
          </>
        )}
      </Box>
      {/* Podcast Filter Modal */}
      <Modal isOpen={isPodcastModalOpen} onClose={onPodcastModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('podcast.filter')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl textAlign={'center'} mt={'15px'}>
              <FormLabel textAlign={'center'}>
                {t('nonExplicit')}
                <Switch ml={'5px'} colorScheme="purple" isChecked={podcastFilter.isExplicit === false} onChange={(e) => handlePodcastFilterChange('isExplicit', e.target.checked ? false : null)} />
              </FormLabel>
            </FormControl>
            <FormControl mt={'20px'}>
              <FormLabel>{t('search.ratingGreaterThan', { rating: podcastFilter.ratingGreaterThan ?? '' })}</FormLabel>
              <Slider min={0} max={5} step={0.1} value={podcastFilter.ratingGreaterThan ?? 0} onChange={(val) => handlePodcastFilterChange('ratingGreaterThan', val)}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
            <FormControl mt={'20px'}>
              <FormLabel>{t('tags')}</FormLabel>
              <GenreSelector onGenresChange={(genres) => handlePodcastFilterChange('tags', genres)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                setPodcastFilter({
                  tags: null,
                  type: null,
                  isExplicit: null,
                  ratingGreaterThan: null,
                  releaseDate: null,
                })
              }}
            >
              {t('reset')}
            </Button>
            <Button colorScheme="blue" onClick={applyPodcastFilter}>
              {t('applyFilters')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Episode Filter Modal */}
      <Modal isOpen={isEpisodeModalOpen} onClose={onEpisodeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('episodes.filter')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl textAlign={'center'}>
              <FormLabel textAlign={'center'}>
                {t('nonExplicit')}
                <Switch ml={'5px'} colorScheme="purple" isChecked={episodeFilter.isExplicit === false} onChange={(e) => handleEpisodeFilterChange('isExplicit', e.target.checked ? false : null)} />
              </FormLabel>
            </FormControl>

            <FormControl mt={'15px'}>
              <FormLabel>{t('episodes.minLength', { length: episodeFilter.minEpisodeLength ? formatSecToDurationString(episodeFilter.minEpisodeLength) : '' })}</FormLabel>
              <Slider min={0} max={3600} value={episodeFilter.minEpisodeLength ?? 0} onChange={(val) => handleEpisodeFilterChange('minEpisodeLength', val)}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                setEpisodeFilter({
                  isExplicit: null,
                  releaseDate: null,
                  minEpisodeLength: null,
                })
              }}
            >
              {t('reset')}
            </Button>
            <Button colorScheme="blue" onClick={applyEpisodeFilter}>
              {t('applyFilters')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
