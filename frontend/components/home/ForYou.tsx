import React, { useState, useEffect } from 'react'
import { Box, Text, Spinner, Flex, VStack, HStack, Grid, useBreakpointValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Podcast } from '../../types/Interfaces'
import PodcastHelper from '../../helpers/PodcastHelper'
import PodcastCard from '../cards/PodcastCard'
import EpisodesForYou from './EpisodesForYou'
import Snippets from './Snippets'
import TodaysRecommendation from './TodaysRecommendation'

const ForYou: React.FC = () => {
  const { t } = useTranslation()
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
          throw new Error(t('home.failedToLoadPodcasts'))
        }
      } catch (err) {
        setError(err.message || t('home.fetchError'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPodcasts()
  }, [t])

  const isMobile = useBreakpointValue({ base: true, md: false })
  const episodeColumnWidth = isMobile ? '100%' : '40%'
  const snippetColumnWidth = isMobile ? '100%' : '60%'

  return (
    <Box>
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : podcasts && podcasts.length > 0 ? (
        <>
          <Text fontSize="lg" fontWeight="bold" mt={4}>
            {t('home.podcasts')}
          </Text>
          {isMobile ? (
            <>
              <Box overflowX="auto" maxWidth="100vw">
                <Flex width={`${200 * podcasts.length}px`} flexDirection="row">
                  {podcasts.map((podcast) => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                  ))}
                </Flex>
              </Box>

              <VStack align="left" width={'100%'} mt={'15px'}>
                <Text fontSize="lg" fontWeight="bold">
                  {t('home.todaysRecommendation')}
                </Text>
                <TodaysRecommendation />{' '}
              </VStack>
            </>
          ) : (
            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="10px" width={'100%'}>
              {podcasts.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </Box>
          )}
          <Flex width="100%" alignItems="flex-start" direction={isMobile ? 'column' : 'row'}>
            <VStack width={episodeColumnWidth} align="left">
              <Text fontSize="lg" fontWeight="bold" mt={4}>
                {t('home.episodesForYou')}
              </Text>
              <EpisodesForYou />
            </VStack>

            <VStack width={snippetColumnWidth} alignItems="flex-start" pl={4}>
              <VStack align="left">
                <Text fontSize="lg" fontWeight="bold" mt={4}>
                  {t('home.snippets')}
                </Text>
                <Snippets />
              </VStack>
              {!isMobile && (
                <VStack align="left">
                  <Text fontSize="lg" fontWeight="bold" mt={4}>
                    {t('home.todaysRecommendation')}
                  </Text>
                  <TodaysRecommendation />
                </VStack>
              )}
            </VStack>
          </Flex>
        </>
      ) : (
        <Text>{t('home.noPodcastsAvailable')}</Text>
      )}
    </Box>
  )
}

export default ForYou
