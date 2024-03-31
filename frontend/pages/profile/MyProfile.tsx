import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box, HStack, VStack, useBreakpointValue } from '@chakra-ui/react'
import Header from '../../components/profile/MyProfile/MyHeader'
import MyEpisodes from '../../components/profile/MyProfile/MyEpisodes'
import Podcasts from '../../components/profile/MyProfile/MyPodcasts'
import MyPlaylists from '../../components/profile/MyProfile/MyPlaylists'

import withAuth from '../../utilities/authHOC'

const MyProfile = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [podcastId, setPodcastId] = useState(1)

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width={'95%'}>
      {isMobile ? (
        <VStack justify="center" align="center" ml={'15px'}>
          <Header />
          <Podcasts />
          <MyEpisodes />
          <MyPlaylists />
        </VStack>
      ) : (
        <HStack width="80vw" align={'start'} spacing={'15px'}>
          <VStack width="28vw" align="start" spacing={'10px'}>
            <Header />
          </VStack>
          <VStack width="500px" align="start">
            <Podcasts />
          </VStack>
          <VStack width="30vw" align="start">
            <MyPlaylists />
          </VStack>
        </HStack>
      )}
    </Box>
  )
}

export default withAuth(MyProfile)
