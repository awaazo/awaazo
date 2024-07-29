import { DeleteIcon } from '@chakra-ui/icons'
import {
  Flex,
  Wrap,
  Box,
  Text,
  WrapItem,
  Button,
  Tooltip,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import EditPodcastForm from './EditPodcast'
import MyEpisodes from './MyEpisodes'
import { useEffect, useState } from 'react'
import PodcastHelper from '../../helpers/PodcastHelper'
import { Episode, Metrics } from '../../types/Interfaces'
import { GiHeptagram } from 'react-icons/gi'
import AnalyticsHelper from '../../helpers/AnalyticsHelper'
import { useTranslation } from 'react-i18next' // Importing i18n translation hook

const PodcastInfo = ({ podcastId }) => {
  const { t } = useTranslation(); // Initialize translation hook

  useEffect(() => {
    PodcastHelper.getPodcastById(podcastId).then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setCoverImage(res.podcast.coverArtUrl)
        setPodcastName(res.podcast.name)
        setDescription(res.podcast.description)
        setTags(res.podcast.tags)
        setEpisodes(res.podcast.episodes)
      } else {
        setCreateError(t('podcast.fetchError')); // Use translation for error message
      }
    })
  }, [podcastId])

  // Form Values
  const [coverImage, setCoverImage] = useState('')
  const [podcastName, setPodcastName] = useState('')
  const [tags, setTags] = useState([])
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [description, setDescription] = useState('')
  const [metrics, setMetrics] = useState<Metrics>(null)
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Form errors
  const [createError, setCreateError] = useState('')
  const [metricsError, setMetricsError] = useState('')

  // For delete pop up
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDeleting, setDeleting] = useState(false)

  useEffect(() => {
    AnalyticsHelper.getEngagementMetricsResponse(podcastId).then((res) => {
      if (res.status == 200) {
        setMetrics(res.metrics)
      } else {
        setMetricsError(t('metrics.fetchError')); // Use translation for error message
      }
    })
  }, [podcastId])

  // Handle Deletion of podcast
  const handleDelete = async () => {
    setDeleting(true)
    // Create request object
    const response = await PodcastHelper.deletePodcast(podcastId)
    console.log(response)
    if (response.status == 200) {
      window.location.reload()
    } else {
      setCreateError(t('podcast.deleteError')); // Use translation for error message
    }
    onClose()
    setDeleting(false)
  }

  const [isModalPodcastOpen, setIsModalPodcastOpen] = useState(false)
  const openEditPodcastModal = () => {
    setIsModalPodcastOpen(true)
  }
  const closeEditPodcastModal = () => {
    setIsModalPodcastOpen(false)
  }
  console.log('Rendering episodes:', episodes)
  console.log('Rendering metrics:', metrics)

  return (
    <>
      <Flex justify="space-between" align="center" w="full">
        <Wrap align="center" spacing={4}>
          <WrapItem>
            <Text fontSize="2xl" fontWeight="bold">
              🎙️ {podcastName}
            </Text>
          </WrapItem>

          {/* Display tags */}
          {tags.map((tag, index) => (
            <WrapItem key={index}>
              <Box bg="az.red" px={2} py={1} borderRadius="1em" display="flex" alignItems="center">
                <Icon as={GiHeptagram} color="brand.600" />
                <Text fontSize="sm" ml={2}>
                  {tag}
                </Text>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
        <Box display="flex" alignItems="center" gap="1rem">
          {isMobile ? (
            <Box>
              <Tooltip label={t('podcast.editTooltip')} aria-label="Edit Podcast Tooltip"> {/* Use translation for tooltip */}
                <IconButton variant="ghost" fontSize="lg" rounded="full" opacity={0.7} color="white" aria-label={t('podcast.editAriaLabel')} icon={<Icon as={MdEdit} />} onClick={() => openEditPodcastModal()} />
              </Tooltip>
            </Box>
          ) : (
            <Button onClick={() => openEditPodcastModal()} display="flex" borderRadius="1em" padding="1em" color="white" bg="az.red">
              <Text fontSize="md">{t('podcast.editButton')}</Text> {/* Use translation for button text */}
            </Button>
          )}
          {/* Edit button */}
          <IconButton onClick={onOpen} disabled={isDeleting} variant="ghost" size={isMobile === true ? 'sm' : 'lg'} rounded={'full'} opacity={0.7} mr={3} color="red" aria-label={t('podcast.deleteAriaLabel')}>
            <DeleteIcon w={isMobile === true ? '5' : '6'} h={isMobile === false ? '5' : '6'} color="#FF6666" data-cy={`podcast-delete`} />
          </IconButton>
        </Box>
      </Flex>

      {isMobile ? (
        <Box>
          <Text
            backgroundColor="rgba(0, 0, 0, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="1em"
            padding="1em"
            outline="2px solid rgba(255, 255, 255, 0.1)"
            marginBottom="0.5em"
            marginTop="1em"
            wordBreak="break-word"
          >
            {description}
          </Text>
          <Box backdropFilter="blur(10px)" borderRadius="1em" padding="1em" marginTop="1em" marginBottom="2em">
            <Box backgroundColor="rgba(0, 0, 0, 0.1)" backdropFilter="blur(10px)" borderRadius="1em" padding="2em" marginTop="1em" marginBottom="2em">
              {/* Podcast metrics */}
              {metricsError && <Text color="red.500">{metricsError}</Text>}

              {metrics && (
                <>
                  <VStack align={'right'}>
                    <Text fontSize="md" fontWeight="bold" color={'az.red'}>
                      {t('metrics.userEngagementInsights')} {/* Use translation for metrics title */}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.averageClicks')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.averageClicks}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.averageWatchTime')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.averageWatchTime.slice(0, 8)}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.commentsPercentage')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.commentsPercentage}%
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.likesPercentage')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.likesPercentage}%
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.totalClicks')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.totalClicks}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.totalComments')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.totalComments}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.totalLikes')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.totalLikes}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.totalListeners')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.totalListeners}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {t('metrics.totalWatchTime')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {metrics.totalWatchTime.slice(0, 8)}
                      </Text>
                    </HStack>
                  </VStack>
                </>
              )}
            </Box>
          </Box>
          <>
            <Box display="flex" alignItems="center">
              <Text fontSize="md" style={{ fontWeight: 'bold', paddingLeft: 15 }}>
                {t('podcast.episodes')} {/* Use translation for episodes label */}
              </Text>{' '}
            </Box>

            {episodes.length === 0 ? (
              <Text align={'center'} fontSize="md" fontWeight="normal" marginTop="2em">
                {t('podcast.noEpisodes')} {/* Use translation for no episodes message */}
              </Text>
            ) : (
              episodes.map((episode, index) => <MyEpisodes episode={episode} key={index} />)
            )}
          </>
        </Box>
      ) : (
        <Flex justify="space-between" align="start">
          {/* Sidebar on the left */}
          <Box
            p={2}
            mt={'0.5em'}
            width={'30%'}
            padding={'0.5em'}
            _focus={{
              boxShadow: 'none',
              outline: 'none',
            }}
          >
            {/* Description and statistics */}
            <Text backgroundColor="rgba(0, 0, 0, 0.1)" backdropFilter="blur(10px)" borderRadius="1em" padding="2em" marginBottom="0.5em" marginTop="1em">
              {description}
            </Text>
            <Box backgroundColor="rgba(0, 0, 0, 0.1)" backdropFilter="blur(10px)" borderRadius="1em" padding="2em" marginTop="1em" marginBottom="2em">
              {/* Podcast metrics */}
              {metricsError && <Text color="red.500">{metricsError}</Text>}{' '}
              {metrics && (
                <>
                  <VStack align={'right'}>
                    <Text fontSize="lg" fontWeight="bold" color={'az.red'}>
                      {t('metrics.userEngagementInsights')} {/* Use translation for metrics title */}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.averageClicks')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.averageClicks}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.averageWatchTime')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.averageWatchTime.slice(0, 8)}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.commentsPercentage')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.commentsPercentage}%
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.likesPercentage')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.likesPercentage}%
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.totalClicks')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.totalClicks}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.totalComments')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.totalComments}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.totalLikes')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.totalLikes}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.totalListeners')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.totalListeners}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold">
                        {t('metrics.totalWatchTime')} {/* Use translation for metrics label */}
                      </Text>
                      <Text fontSize="md" fontWeight="medium">
                        {metrics.totalWatchTime.slice(0, 8)}
                      </Text>
                    </HStack>
                  </VStack>
                </>
              )}
            </Box>
          </Box>

          {/* Podcast mapping on the right */}
          <Box flex="1" paddingLeft="25px" marginTop="1.5em">
            {episodes.length === 0 ? (
              <Text align={'center'} fontSize="lg" fontWeight="normal" marginTop="5em">
                {t('podcast.noEpisodes')} {/* Use translation for no episodes message */}
              </Text>
            ) : (
              episodes.map((episode, index) => <MyEpisodes episode={episode} key={index} />)
            )}
          </Box>
        </Flex>
      )}
      {/* Modal for deleting a podcast */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('podcast.confirmDeletion')}</ModalHeader> {/* Use translation for modal header */}
          <ModalCloseButton />
          <ModalBody>
            {t('podcast.confirmDeletionMessage', { podcastName })} {/* Use translation for deletion message */}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              {t('podcast.cancel')} {/* Use translation for cancel button */}
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              {t('podcast.delete')} {/* Use translation for delete button */}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for editing a podcast */}
      <Modal isOpen={isModalPodcastOpen} onClose={closeEditPodcastModal}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent boxShadow="dark-lg" backdropFilter="blur(40px)" display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop={'10%'} padding={'2em'}>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack spacing={5} align="center" backgroundColor={'transparent'}>
                <Text>{t('podcast.editPodcast', { podcastName })}</Text> {/* Use translation for edit podcast title */}
                <EditPodcastForm podcastId={podcastId} />
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PodcastInfo
