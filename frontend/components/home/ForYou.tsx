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

  const isMobile = useBreakpointValue({ base: true, md: false });
  const episodeColumnWidth = isMobile ? '100%' : '40%';
  const snippetColumnWidth = isMobile ? '100%' : '60%';

  return (
    <Box>
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : podcasts && podcasts.length > 0 ? (
        <>
          <Text fontSize="lg" fontWeight="bold" mt={4}>
            Podcasts
          </Text>
          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="30px" width={'100%'}>
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </Box>


          <Flex width="100%" alignItems="flex-start" direction={isMobile ? 'column' : 'row'}>
            {/* Episodes For You */}
            <VStack width={episodeColumnWidth} align="left">
              <Text fontSize="lg" fontWeight="bold" mt={4}>
                Episodes For You
              </Text>
              <EpisodesForYou />
            </VStack>

            {/* Snippets and Today's Recommendation */}
            <VStack width={snippetColumnWidth} alignItems="flex-start" pl={4} >
              <VStack align="left">
                <Text fontSize="lg" fontWeight="bold" mt={4}>
                  Snippets
                </Text>
                <Snippets />
              </VStack>
              <VStack align="left">
                <Text fontSize="lg" fontWeight="bold" mt={4}>
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
