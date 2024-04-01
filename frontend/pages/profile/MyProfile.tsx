import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box, HStack, VStack, useBreakpointValue } from '@chakra-ui/react'
import Header from '../../components/profile/MyProfile/MyHeader'
import Podcasts from '../../components/profile/MyProfile/MyPodcasts'
import MyPlaylists from '../../components/profile/MyProfile/MyPlaylists'

import withAuth from '../../utilities/authHOC'

const MyProfile = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [podcastId, setPodcastId] = useState(1)

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width={'100%'}>
      {isMobile ? (
        <VStack justify="center" align="center" ml={'15px'}>
          <Header />
          <Podcasts />
          <MyPlaylists />
        </VStack>
      ) : (
        <HStack align="start" spacing={'30px'} ml={'5%'}>
          <VStack minWidth={'300px'} width="calc((100% - 500px) * 0.6)" align="start" spacing={4}>
            <Header />
          </VStack>
          <VStack width="500px" align="start">
            <Podcasts />
          </VStack>
          <VStack width="calc((100% - 500px) * 0.7)" align="start">
            <MyPlaylists />
          </VStack>
        </HStack>
      )}
    </Box>
  )
}

export default withAuth(MyProfile)
