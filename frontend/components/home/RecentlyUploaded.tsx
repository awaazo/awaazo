import React, { useState, useEffect } from 'react'
import { Episode } from '../../types/Interfaces'
import { VStack, Text, HStack, useBreakpointValue, Spinner, SimpleGrid } from '@chakra-ui/react'
import PodcastHelper from '../../helpers/PodcastHelper'
import EpisodeCard from '../cards/EpisodeCard'

const RecentlyUploaded: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true)
      try {
        const res = await PodcastHelper.podcastGetRecentEpisodes(0, 12)
        if (res.status === 200) {
          setEpisodes(res.episode)
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

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <VStack spacing={4} align="stretch">
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <HStack
          spacing={4}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {episodes && episodes.length > 0 ? (
            episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} showLike={false} showComment={false} showMore={false} />)
          ) : (
            <Text>No episodes available</Text>
          )}
        </HStack>
      )}
    </VStack>
  )
}

export default RecentlyUploaded
