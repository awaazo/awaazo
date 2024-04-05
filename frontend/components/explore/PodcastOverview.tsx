import { useEffect, useState } from 'react'
import { Box, Flex, useColorMode, useBreakpointValue, Text, Tag, Image, Wrap, WrapItem, Button, HStack, VStack, Img } from '@chakra-ui/react'
import EpisodeCard from '../cards/EpisodeCard'
import Reviews from '../explore/Reviews'
import Subscription from '../explore/Subscription'
import AuthHelper from '../../helpers/AuthHelper'
import MetricDisplay from '../../components/assets/MetricDisplay'
import { Settings } from '../../public/icons/'
import Rating from '../assets/RatingView';

// Component to render the podcast overview
export default function PodcastOverview({ podcast, User }) {
  const { colorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [showMore, setShowMore] = useState(false)
  const [podcastData, setPodcastData] = useState(podcast)

  const updatePodcastData = (newData) => {
    setPodcastData(newData)
  }

  // Function to render the podcast description
  const renderDescription = () => {
    const descriptionLines = podcast.description.split('\n')
    return descriptionLines
      .map((line, index) => (
        <Text key={index} style={index === 3 && !showMore ? fadeTextStyle : textStyle}>
          {line}
        </Text>
      ))
      .slice(0, showMore ? descriptionLines.length : 3)
  }

  const [currentUserID, setCurrentUserID] = useState(null)

  useEffect(() => {
    const fetchUserID = async () => {
      const response = await AuthHelper.authMeRequest()
      if (response.status === 200) {
        setCurrentUserID(response.userMenuInfo.id)
      }
    }

    fetchUserID()
  }, [])

  // Text style
  const textStyle = {
    fontSize: 'larger',
    paddingTop: '10px',
  }

  // Fade text style
  const fadeTextStyle = {
    ...textStyle,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '20px',
    paddingBottom: '40px',
    ':after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '40px',
      backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
    },
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

  return (
    <>
      <Box p={4} borderRadius="1em" padding={'2em'} dropShadow={' 0px 4px 4px rgba(0, 0, 0, 0.35)'} minHeight={'200px'}>
        <HStack spacing={1}>
          <Image boxSize={isMobile ? '125px' : '150px'} objectFit="cover" src={podcast.coverArtUrl} borderRadius="15px" marginLeft={isMobile ? '0px' : '20px'} mt={1} />
          <VStack top={'2'}>
            <HStack>
              <Text fontSize={'lg'} fontWeight={'bold'}>
                {podcast.name}
              </Text>

              <HStack>
              
              <Rating rating={podcast.totalRatings} />
                  <Settings />
                
              </HStack>
            </HStack>
            {renderDescription()}
            {podcast.description.split('\n').length > 3 && (
              <Button
                size="sm"
                background={'rgba(255, 255, 255, 0.1)'}
                onClick={() => setShowMore(!showMore)}
                mt={1}
                bottom="0"
                left="0"
                right="0"
                mx="auto"
                borderRadius={'3em'}
                outline={'1px solid rgba(255, 255, 255, 0.2)'}
              >
                {showMore ? 'Show Less' : 'Show More'}
              </Button>
            )}

            <TagList tags={podcast.tags} />
          </VStack>
        </HStack>

        <Box>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text fontSize="md" mt={10} style={{ fontWeight: 'bold', paddingLeft: 15 }}>
              Episodes
            </Text>{' '}
          </div>

          {podcast.episodes.length === 0 ? (
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
          ) : (
            podcast.episodes.map((episode, index) => <EpisodeCard key={episode.id} episode={episode} showLike={false} showComment={false} showMore={false} />)
          )}

          <Box
            p={4}
            mt={'0.5em'}
            padding={'1em'}
            _focus={{
              boxShadow: 'none',
              outline: 'none',
            }}
          >
            <Reviews podcast={podcastData} updatePodcastData={updatePodcastData} currentUserID={currentUserID} />
          </Box>
        </Box>
      </Box>
    </>
  )
}
