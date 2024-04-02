import { useState, useEffect } from 'react'
import { Box, Stack, Grid, useBreakpointValue, Text, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Podcast } from '../../../types/Interfaces'
import PodcastHelper from '../../../helpers/PodcastHelper'
import PodcastCard from '../../cards/PodcastCard'

export default function UserPodcasts({ userId }) {
  // podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 3 })

  // Form errors
  const [podcastError, setPodcastError] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 6

  // State to maintain the selected podcast ID
  useEffect(() => {
    // Check to make sure the user has logged in

    PodcastHelper.podcastUserPodcastsGet(userId, page, pageSize).then((res2) => {
      // If logged in, set user, otherwise redirect to login page
      if (res2.status == 200) {
        setPodcasts((prevPodcasts) => [...prevPodcasts, ...res2.myPodcasts])
      } else {
        setPodcastError('Podcasts cannot be fetched')
      }
    })
  }, [userId, page])

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1)
  }

  return (
    <>
      <Box marginBottom="1em" fontSize="1.5em" fontWeight="bold" display="flex" alignItems="center" justifyContent="space-between">
        Podcasts:
      </Box>

      {podcasts && podcasts.length == 0 ? (
        <Text mt={'50px'} fontSize={'18px'} textAlign={'center'}>
          This user has not created any podcasts yet.
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
        <Flex justify="center" mt={4}>
          <Tooltip label="Load More" placement="top">
            <IconButton aria-label="Load More" icon={<ChevronDownIcon />} onClick={handleLoadMoreClick} size="lg" variant="outline" />
          </Tooltip>
        </Flex>
      )}
    </>
  )
}
