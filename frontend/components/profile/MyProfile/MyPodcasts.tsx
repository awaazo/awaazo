import { useState, useEffect } from 'react'
import { Box, Button, Stack, Grid, useBreakpointValue, Text, Flex, IconButton, Tooltip, Spinner } from '@chakra-ui/react'
import { Settings } from '../../../public/icons'
import { ChevronDownIcon } from '@chakra-ui/icons'

import Link from 'next/link'
import { Podcast } from '../../../types/Interfaces'
import PodcastHelper from '../../../helpers/PodcastHelper'
import PodcastCard from '../../cards/PodcastCard'

export default function Podcasts() {
  // podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 3 })
  const [page, setPage] = useState(0)
  const pageSize = 6
  const [isLoading, setIsLoading] = useState(false)

  // Form errors
  const [podcastError, setPodcastError] = useState('')

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true)
      try {
        const res2 = await PodcastHelper.podcastMyPodcastsGet(page, pageSize)
        if (res2.status == 200) {
          setPodcasts((prevPodcasts) => [...prevPodcasts, ...res2.myPodcasts])
        } else {
          setPodcastError('Podcasts cannot be fetched')
        }
      } catch (error) {
        console.error('Error fetching podcasts:', error)
        setPodcastError('Failed to load podcasts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPodcasts()
  }, [page])

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1)
  }

  return (
    <>
      <Box marginBottom="1em" display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Text fontSize="lg" fontWeight="bold">
          My Podcasts
        </Text>
        <Link href="/CreatorHub/" passHref>
          <IconButton aria-label="Settings" icon={<Settings />} size="14px" variant="minimal" />
        </Link>
      </Box>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" height="100px">
          <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
        </Flex>
      ) : (
        <>
          {podcastError && (
            <Text color="red.500" textAlign="center">
              {podcastError}
            </Text>
          )}

          {podcasts && podcasts.length === 0 ? (
            <Text mt={'50px'} fontSize={'md'} textAlign={'center'} color={'az.greyish'}>
              You have not created any podcasts yet.
            </Text>
          ) : (
            <>
              {podcasts.map(
                (podcast, index) =>
                  index % 2 === 0 && (
                    <Grid key={index} templateColumns={`repeat(2, 1fr)`} gap={'0px'} placeItems="center">
                      {podcasts.slice(index, index + 2).map((podcast, innerIndex) => (
                        <Stack key={innerIndex} spacing={4} direction="column" align="center" height="100%" width="100%">
                          <PodcastCard podcast={podcast} />
                        </Stack>
                      ))}
                    </Grid>
                  )
              )}
            </>
          )}
          {podcasts[(page + 1) * pageSize - 1] != null && (
            <Flex justify="center" mt={4} width={'100%'}>
              <Tooltip label="Load More" placement="top">
                <IconButton aria-label="Load More" icon={<ChevronDownIcon />} onClick={handleLoadMoreClick} size="lg" variant="outline" />
              </Tooltip>
            </Flex>
          )}
        </>
      )}
    </>
  )
}
