import { useEffect, useState } from 'react'
import { Box, useBreakpointValue, Text, Image, Wrap, WrapItem, Button, HStack, VStack } from '@chakra-ui/react'
import EpisodeCard from '../cards/EpisodeCard'
import Reviews from '../explore/Reviews'
import Subscription from '../explore/Subscription'
import AuthHelper from '../../helpers/AuthHelper'
import MetricDisplay from '../../components/assets/MetricDisplay'
import { Settings } from '../../public/icons/'
import CustomTabs from '../assets/CustomTabs'
import Rating from '../assets/RatingView'
import { Episode } from '../../types/Interfaces'

// Component to render the podcast overview
export default function PodcastOverview({ podcast, User }) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [showMore, setShowMore] = useState(false)
  const [podcastData, setPodcastData] = useState(podcast)
  const [currentUserID, setCurrentUserID] = useState(null)
  const updatePodcastData = (newData) => {
    setPodcastData(newData)
  }

  const Description = () => {
    const descriptionLines = podcast.description.split('\n')
    const isLongDescription = descriptionLines.length > 3

    return (
      <Box>
        {descriptionLines.slice(0, showMore ? descriptionLines.length : 3).map((line, index) => (
          <Text key={index}>{line}</Text>
        ))}
        {isLongDescription && (
          <Button size="sm" background={'rgba(255, 255, 255, 0.1)'} onClick={() => setShowMore(!showMore)} mt={1} borderRadius={'3em'} outline={'1px solid rgba(255, 255, 255, 0.2)'}>
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
        )}
      </Box>
    )
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

  const TagList = ({ tags }) => {
    return (
      <HStack>
        <Wrap spacing="10px">
          {' '}
          {/* Ensures spacing between items */}
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

  const PodcastHeader = () => (
    <HStack spacing={"12px"}>
      <Image boxSize={isMobile ? '125px' : '150px'} objectFit="cover" src={podcast.coverArtUrl} borderRadius="15px" marginLeft={isMobile ? '0px' : '20px'} mt={1} />
      <VStack align="start" spacing={"8px"}>
  <HStack>
    <Text fontSize={'lg'} fontWeight={'bold'}>
      {podcast.name}
    </Text>
    <HStack>
      <Rating rating={podcast.totalRatings} />
      <Text>{podcast.totalRatings}</Text>
      <Settings />
    </HStack>
  </HStack>
  <Description />
  <TagList tags={podcast.tags} />
</VStack>

    </HStack>
  )

  const tabItems = [
    { label: 'Review', component: <Reviews podcast={podcastData} updatePodcastData={updatePodcastData} currentUserID={currentUserID} /> },
    { label: 'Episodes', component: <EpisodesList episodes={podcast.episodes} /> },
  ]
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width={'95%'}>
      {isMobile ? (
        <VStack justify="center" align="center" ml={'15px'}>
          <PodcastHeader />
          <CustomTabs tabItems={tabItems} />
        </VStack>
      ) : (
        <HStack align="start" spacing={'30px'} ml={'5%'}>
          <PodcastHeader />

          <Box>
            <CustomTabs tabItems={tabItems} />
          </Box>
        </HStack>
      )}
    </Box>
  )
}
