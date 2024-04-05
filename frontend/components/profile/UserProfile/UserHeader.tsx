import { useState, useEffect } from 'react'
import { Avatar, Heading, Text, VStack, Link, IconButton, Divider, Flex, Box, HStack, useColorModeValue, useBreakpointValue, Button, Center } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import UserProfileHelper from '../../../helpers/UserProfileHelper'
import { userProfileByID } from '../../../types/Interfaces'

const iconProps = {
  variant: 'ghost',
  size: 'lg',
  isRound: true,
}

export default function Header({ userId }) {
  // Form Values
  const [user, setUser] = useState<userProfileByID | null>(null)
  const [getError, setGetError] = useState('')

  const { data: session } = useSession()
  const [profile, setProfile] = useState<userProfileByID>(null)

  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    console.log(userId)
    // Ensure userId is truthy before making the API call
    UserProfileHelper.profileGetByIdRequest(userId).then((res) => {
      // If logged in, set user, otherwise redirect to the login page
      if (res.status === 200) {
        setUser(res.userProfileByID)
      } else {
        setGetError('Podcasts cannot be fetched')
      }
    })
  }, [userId])

  return (
    <>
      <VStack width={'100%'} spacing={4} px={2} marginBottom={'2em'} ml={isMobile ? '25px' : '0px'}>
        <HStack alignItems={'flex-start'} width="100%">
          <Box position="relative">
            <Avatar boxShadow="xl" width="5em" height="5em" src={user?.avatarUrl} />
          </Box>
          <VStack align="start" spacing={1}>
            <Heading textAlign={{ base: 'center', sm: 'left' }} margin="0 auto" fontSize={{ base: '1.5rem', sm: '1.8rem' }}>
              {user?.displayName}
            </Heading>
            <Text fontSize="1.2rem" color={'az.red'} fontWeight={'bold'}>
              @{user?.username}
            </Text>
          </VStack>
        </HStack>

        <Text textAlign="left" color={'grey'}>
          {user?.bio}
        </Text>

        <Center>
          <HStack spacing={4} alignItems="center">
            <VStack justify="center" alignItems="center">
              <Text fontSize="16px" color="white" fontWeight="bold">
                5
              </Text>
              <Text fontSize="16px" color="az.red" fontWeight="bold">
                Podcasts
              </Text>
            </VStack>
            <Text fontSize="16px" color="gray">
              |
            </Text>
            <VStack justify="center" alignItems="center">
              <Text fontSize="16px" color="white" fontWeight="bold">
                250
              </Text>
              <Text fontSize="16px" color="az.red" fontWeight="bold">
                Episodes
              </Text>
            </VStack>
            <Text fontSize="16px" color="gray">
              |
            </Text>
            <VStack justify="center" alignItems="center">
              <Text fontSize="16px" color="white" fontWeight="bold">
                1.2M
              </Text>
              <Text fontSize="16px" color="az.red" fontWeight="bold">
                Likes
              </Text>
            </VStack>
            <Text fontSize="16px" color="gray">
              |
            </Text>
            <VStack justify="center" alignItems="center">
              <Text fontSize="16px" color="white" fontWeight="bold">
                500k
              </Text>
              <Text fontSize="16px" color="az.red" fontWeight="bold">
                Subscribers
              </Text>
            </VStack>
          </HStack>
        </Center>
      </VStack>
    </>
  )
}
