import React, { useState, useEffect } from 'react'
import { Box, Text, Spinner, Flex, VStack, HStack, Grid, useBreakpointValue } from '@chakra-ui/react'
import { Podcast } from '../../types/Interfaces'
import PodcastHelper from '../../helpers/PodcastHelper'
import PodcastCard from '../cards/PodcastCard'
import EpisodesForYou from './EpisodesForYou'
import Snippets from './Snippets'
import TodaysRecommendation from './TodaysRecommendation'

const ForYou: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true)
      try {
        const res = await PodcastHelper.podcastGetRecentPodcasts(0, 12)
        if (res.status === 200) {
          setPodcasts(res.podcasts)
        } else {
          throw new Error('Failed to load podcasts')
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching podcasts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPodcasts()
  }, [])
  // Define responsive grid layout
  const gridTemplateColumns = useBreakpointValue({
    base: 'repeat(2, 1fr)',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(auto-fit, minmax(220px, 1fr))',
  })

  const gridColumnGap = useBreakpointValue({
    base: '10px', // Adjust this value to decrease the gap between columns in mobile mode
    sm: '10px', // Gap for small devices
    md: '20px', // Gap for medium to larger devices
  })

  return (
    <Box>
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : podcasts && podcasts.length > 0 ? (
        <>
          <Text fontSize="2xl" fontWeight="bold" mt={4}>
            Podcasts
          </Text>
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="30px" width={'100%'}>
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </Box>

          <Flex width="100%" alignItems="flex-start">
            <HStack width="40%">
              <VStack align="left">
                <Text fontSize="2xl" fontWeight="bold" mt={4}>
                  Episodes For You
                </Text>
                <EpisodesForYou />
              </VStack>
            </HStack>
            <VStack width="60%" alignItems="flex-start">
              <VStack align="left">
                <Text fontSize="2xl" fontWeight="bold" mt={4}>
                  Snippets
                </Text>
                <Snippets />
              </VStack>
              <VStack align={'left'}>
                <Text fontSize="2xl" fontWeight="bold" mt={4}>
                  Today's Recommendation
                </Text>
                <TodaysRecommendation />
              </VStack>
            </VStack>
          </Flex>
        </>
      ) : (
        <Text>No podcasts available</Text>
      )}
    </Box>
  )
}

export default ForYou
