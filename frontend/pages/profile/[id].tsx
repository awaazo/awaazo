import React from 'react'
import { Box, VStack, HStack, useBreakpointValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import UserHeader from '../../components/profile/UserProfile/UserHeader'
import UserPodcasts from '../../components/profile/UserProfile/UserPodcasts'
import UserPlaylists from '../../components/profile/UserProfile/UserPlaylists'

export default function UserProfile() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Get the user ID from the link
  const router = useRouter()
  const path = router.asPath
  const userId = path.split('/').pop()

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width={'100%'}>
      {isMobile ? (
        <VStack justify="center" align="center" ml={'15px'}>
          <UserHeader userId={userId} />
          <UserPodcasts userId={userId} />
          <UserPlaylists userId={userId} />
        </VStack>
      ) : (
        <HStack align="start" spacing={'30px'} ml={'5%'}>
          <VStack minWidth={'300px'} width="calc((100% - 500px) * 0.6)" align="start" spacing={4}>
            <UserHeader userId={userId} />{' '}
          </VStack>
          <VStack width="500px" align="start">
            <UserPodcasts userId={userId} />
          </VStack>
          <VStack width="calc((100% - 500px) * 0.7)" align="start">
            <UserPlaylists userId={userId} />
          </VStack>
        </HStack>
      )}
    </Box>
  )
}
