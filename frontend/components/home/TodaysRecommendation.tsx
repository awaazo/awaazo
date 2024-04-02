import React, { useState, useEffect } from 'react'
import { Episode, Podcast } from '../../types/Interfaces'
import { VStack, Text, HStack, useBreakpointValue, Spinner, SimpleGrid, Image, Box, Flex } from '@chakra-ui/react'
import PodcastHelper from '../../helpers/PodcastHelper'
import Link from 'next/link'
import EpisodeCard from '../cards/EpisodeCard'
import PodcastCard from '../cards/PodcastCard'

const TodaysRecommendation: React.FC = () => {
  const [podcast, setPodcast] = useState<Podcast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true)
      try {
        const res = await PodcastHelper.podcastAllPodcastsGet(0, 1)
        if (res.status === 200) {
          setPodcast(res.podcasts)
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

  const PodcastImage = ({ coverArtUrl, name }) => (
    <>
      <Image src={coverArtUrl} alt={name} objectFit="cover" position="absolute" top={0} w="full" h="full" transition="opacity 0.2s ease-in-out" _groupHover={{ opacity: 1, filter: 'blur(3px)' }} />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(180deg, rgba(30, 30, 30, 0.80) 0%, rgba(41.64, 41.64, 41.64, 0.80) 100%)"
        opacity={0}
        transition="opacity 0.2s ease-in-out"
        _groupHover={{ opacity: 0.8 }}
      />
    </>
  )

  const PodcastNameAndTags = ({ name, description }) => (
    <Flex position="absolute" top="5" left={1} right={1} px="4" justifyContent="space-between" alignItems="center" zIndex={2}>
      <Box>
        <Text fontSize="24px" fontWeight="bold" color="az.darkGradient" data-cy={`podcast-name:${name}`}>
          {name}
        </Text>
        <Text fontSize="16px" fontWeight="medium" color="gray.200" noOfLines={4}>
          {description}
        </Text>
      </Box>
    </Flex>
  )

  const PodcastType = ({ type }) => (
    <Text fontSize="xs" color="white" position="absolute" bottom="3" right={4} zIndex={2} textShadow="0px 2px 20px #0000008E">
      {type}
    </Text>
  )
  return (
    <Flex align="stretch">
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box width={'50vw'} height={'30vh'} position="relative" margin="1em">
          <Link href={`/Explore/${podcast[0].id}`} passHref>
            <Flex
              direction="column"
              align="center"
              rounded="15px"
              overflow="hidden"
              position="absolute"
              role="group"
              cursor="pointer"
              transition="transform 0.2s ease-in-out"
              width="full"
              height="full"
              zIndex={0}
            >
              <PodcastImage coverArtUrl={podcast[0].coverArtUrl} name={podcast[0].name} />
              <Box position="absolute" top={0} left={0} right={0} bottom={0} bgGradient="linear(to-t, rgba(0, 0, 0, 0.5), transparent)" zIndex="1" />

              <PodcastNameAndTags name={podcast[0].name} description={podcast[0].description} />
              <PodcastType type={podcast[0].type} />
            </Flex>
          </Link>
        </Box>
      )}
    </Flex>
  )
}

export default TodaysRecommendation
