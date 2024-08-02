import React, { useState, useEffect } from 'react'
import { Episode } from '../../types/Interfaces'
import { VStack, Text, HStack, useBreakpointValue, Spinner, SimpleGrid } from '@chakra-ui/react'
import PodcastHelper from '../../helpers/PodcastHelper'
import EpisodeCard from '../cards/EpisodeCard'
import { useTranslation } from 'react-i18next'

const RecentlyUploaded: React.FC = () => {
  const { t } = useTranslation()
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

  return (
    <VStack spacing={4} align="stretch">
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="az.red">{error}</Text>
      ) : (
        <VStack
          spacing={"12px"}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {episodes && episodes.length > 0 ? (
            episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} showLike={false} showComment={false} showMore={false} />)
          ) : (
            <Text>{t('home.noEpisodesAvailable')}</Text>
          )}
        </VStack>
      )}
    </VStack>
  )
}

export default RecentlyUploaded
