import { useEffect, useState } from 'react'
import { Box, useBreakpointValue, Text, Image, Wrap, WrapItem, Button, HStack, VStack, IconButton, Flex } from '@chakra-ui/react'
import EpisodeCard from '../cards/EpisodeCard'
import Reviews from '../explore/Reviews'
import Subscription from '../explore/Subscription'
import AuthHelper from '../../helpers/AuthHelper'
import MetricDisplay from '../../components/assets/MetricDisplay'
import { Settings } from '../../public/icons/'
import CustomTabs from '../assets/CustomTabs'
import Rating from '../assets/RatingView'
import { Episode } from '../../types/Interfaces'
import Link from 'next/link'

// Component to render the podcast overview
export default function PodcastOverview({ podcast, User }) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [showMore, setShowMore] = useState(false)
  const [podcastData, setPodcastData] = useState(podcast)
  const [currentUserID, setCurrentUserID] = useState(null)
  const updatePodcastData = (newData) => {
    setPodcastData(newData)
  }

  useEffect(() => {
    const fetchUserID = async () => {
      const response = await AuthHelper.authMeRequest()
      if (response.status === 200) {
        setCurrentUserID(response.userMenuInfo.id)
      }
    }

    fetchUserID()
  }, [])

  const EpisodesList: React.FC<{ episodes: Episode[] }> = ({ episodes }) => {
    if (episodes.length === 0) {
      return (
        <Text
          align={'center'}
          fontSize="md"
          style={{
            fontWeight: 'normal',
            marginTop: '2em',
          }}
        >
          (This podcast has no episodes yet)
        </Text>
      )
    }
    return (
      <>
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} showLike={false} showComment={false} showMore={false} />
        ))}
      </>
    )
  }

  const tabItems = [
    { label: 'Episodes', component: <EpisodesList episodes={podcast.episodes} /> },
    { label: 'Review', component: <Reviews podcast={podcastData} updatePodcastData={updatePodcastData} currentUserID={currentUserID} /> },
  ]
  const metrics = [
    { value: 250, label: 'Episodes' },
    { value: 1200000, label: 'Listeners' },
    { value: 100000, label: 'Subscribers' },
  ]

  const PodcastHeader = () => (
    <VStack width={'100%'} spacing={4} mb={'4'}>
      <HStack spacing={'12px'} width={'100%'} align={'start'}>
        <Image boxSize={isMobile ? '125px' : '150px'} objectFit="cover" src={podcast.coverArtUrl} borderRadius="15px" />
        <VStack align="start" spacing={'8px'} width={'100%'} justify="space-between">
          <HStack width={'full'} justify="space-between" pr={"12px"}>
            <Text fontSize={'lg'} fontWeight={'bold'}>
              {podcast.name}
            </Text>
            
            <Rating rating={podcast.totalRatings} />
          
          </HStack>
          <VStack align="start">
            <Description />
            <TagList tags={podcast.tags} />
          </VStack>
        </VStack>
      </HStack>
      <Metrics_Subscribe />
    </VStack>
  )

  const Description = () => {
    const maxCharCount = 150
    const isLongDescription = podcast.description.length > maxCharCount
    const truncatedDescription = podcast.description.slice(0, maxCharCount) + '...'

    return (
      <Box>
        {isLongDescription && !showMore ? (
          <Flex align="center" wrap="wrap">
            <Text color={'az.greyish'} noOfLines={1}>
              {truncatedDescription}
            </Text>
            <Button variant={'minimal'} fontSize="sm" onClick={() => setShowMore(!showMore)} p={0}>
              Show More
            </Button>
          </Flex>
        ) : (
          <>
            <Text color={'az.greyish'}>{podcast.description}</Text>
            {isLongDescription && (
              <Button variant={'minimal'} fontSize="sm" onClick={() => setShowMore(!showMore)} p={0}>
                Show Less
              </Button>
            )}
          </>
        )}
      </Box>
    )
  }

  const TagList = ({ tags }) => {
    return (
      <HStack>
        <Wrap spacing="10px">
          {' '}
          {tags.map((tag, index) => (
            <WrapItem key={index}>
              <Box bg="az.darkGrey" px={3} py={1} borderRadius="10px">
                <Text fontSize="xs">{tag}</Text>
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </HStack>
    )
  }

  const Metrics_Subscribe = () => (
    <HStack bg={'az.darkestGrey'} width={'100%'} justify="space-between" px={4} py={2} borderRadius={'10'}>
      <MetricDisplay metrics={metrics} />
      <Subscription PodcastId={podcast.id} initialIsSubscribed={Boolean} podcasterId={podcast.podcasterId} currentUserID={currentUserID} />

      {podcast.podcasterId === currentUserID && (
        <Link href="/CreatorHub" passHref>
          <IconButton aria-label="Settings" icon={<Settings />} variant="minimalColor" size="md" p={'0'} />
        </Link>
      )}
    </HStack>
  )

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width={'100%'}>
      {isMobile ? (
        <VStack justify="center" align="center" ml={'15px'} w={'full'}>
          <PodcastHeader />
          <Box width={'100%'}>
            <CustomTabs tabItems={tabItems} />
          </Box>
        </VStack>
      ) : (
        <HStack align="start" spacing={'30px'} ml={'5%'} w={'85%'}>
          <PodcastHeader />

          <Box w={'full'}>
            <CustomTabs tabItems={tabItems} />
          </Box>
        </HStack>
      )}
    </Box>
  )
}
