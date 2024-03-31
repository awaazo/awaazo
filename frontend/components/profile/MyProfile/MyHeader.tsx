import { useState, useEffect } from 'react'
import { Avatar, Heading, Center, Text, VStack, Link, IconButton, Divider, Flex, Box, HStack, useColorModeValue, useBreakpointValue } from '@chakra-ui/react'
import { UserProfile } from '../../../types/Interfaces'
import { useSession } from 'next-auth/react'
import { FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6'
import { FiEdit2 } from 'react-icons/fi'
import router from 'next/router'
import UserProfileHelper from '../../../helpers/UserProfileHelper'
import Subscriptions from './MySubscriptions'
import AnalyticsHelper from '../../../helpers/AnalyticsHelper'
import PodcastCard from '../../cards/PodcastCard'
import { AwaazoA, Pen } from '../../../public/icons'

const iconProps = {
  variant: 'ghost',
  size: 'lg',
  isRound: true,
}

export default function Header() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile>(null)

  const isMobile = useBreakpointValue({ base: true, md: false })
  const [averageWatchTime, setAverageWatchTime] = useState('')
  const [totalWatchTime, setTotalWatchTime] = useState('')
  const [mostWatchedPodcast, setMostWatchedPodcast] = useState([])
  const [topGenre, setTopGenre] = useState(null)

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

  useEffect(() => {
    UserProfileHelper.profileGetRequest()
      .then((response) => {
        if (response.status == 200) {
          setProfile(response.userProfile)
        }
      })
      .catch((error) => {
        console.error('Error fetching user info:', error)
      })
  }, [session, isUserLoggedIn])

  useEffect(() => {
    const fetchData = async () => {
      const averageWatchTimeResponse = await AnalyticsHelper.getUserAverageWatchTimeResponse()
      const totalWatchTimeResponse = await AnalyticsHelper.getUserTotalWatchTimeResponse()
      const topWatchedResponse = await AnalyticsHelper.getTopWatchedResponse(false, 1, false, 0, 1)
      const topGenreResponse = await AnalyticsHelper.getTopGenreResponse()

      if (averageWatchTimeResponse.status === 200) {
        setAverageWatchTime(averageWatchTimeResponse.data)
      }
      if (totalWatchTimeResponse.status === 200) {
        setTotalWatchTime(totalWatchTimeResponse.data)
      }
      if (topWatchedResponse.status === 200) {
        setMostWatchedPodcast(topWatchedResponse.data)
      }
      if (topGenreResponse.status === 200) {
        setTopGenre(topGenreResponse.data)
      }
    }

    fetchData()
  }, [])

  console.log(mostWatchedPodcast)

  return (
    <>
      <VStack width={'100%'} spacing={4} px={2} alignItems={{ base: 'center', sm: 'flex-start' }} marginBottom={'2em'} ml={isMobile ? '25px' : '0px'}>
        <HStack>
          <Box position="relative">
            <Avatar boxShadow="xl" width="5em" height="5em" src={profile?.avatarUrl} />
            <IconButton
              aria-label="Edit Profile"
              icon={<AwaazoA fontSize={'40px'} />}
              position="absolute"
              bottom={5}
              right={5}
              transform={'translate(-100%, -100%)'}
              variant="ghost"
              onClick={() => router.push('/profile/EditProfile')}
              color="az.red"
              _hover={{ color: 'az.blue' }}
              data-cy={`edit_profile_button`}
            />{' '}
            <IconButton
              aria-label="Edit Profile"
              icon={<Pen fontSize={'19px'} />}
              position="absolute"
              bottom={6}
              right={'17px'}
              transform={'translate(-100%, -100%)'}
              pointerEvents="none"
              variant="ghost"
              color="white"
            />
          </Box>
          <VStack align="start" spacing={1}>
            <Heading textAlign={{ base: 'center', sm: 'left' }} margin="0 auto" fontSize={{ base: '1.5rem', sm: '1.8rem' }}>
              {profile?.displayName}
            </Heading>
            <Text fontSize="1.2rem" color={'az.red'} fontWeight={'bold'}>
              @{profile?.username}
            </Text>
          </VStack>
        </HStack>

        <Text textAlign="left" color={'grey'}>
          {profile?.bio}
        </Text>
        <HStack>{/*<Subscriptions />*/}</HStack>
        <Divider />
        <Box w="100%">
          <Text fontWeight="bold" fontSize="22px" mb="15px" marginLeft="5px">
            Your Listening Habits:
          </Text>
          {averageWatchTime || totalWatchTime || topGenre || (mostWatchedPodcast && mostWatchedPodcast.length > 0) ? (
            <>
              {averageWatchTime && totalWatchTime && (
                <Text fontSize="16px" mb="15px" marginLeft="30px" color={'grey'}>
                  Your average watch time is <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{averageWatchTime.slice(0, 8)}.</span>
                  <br /> Your Total watch time is <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{totalWatchTime.slice(0, 8)}.</span>
                </Text>
              )}

              {topGenre && (
                <Text fontSize="16px" mb="15px" marginLeft="30px" color={'grey'}>
                  Your most listened-to genre is <span style={{ color: '#ff6a5f', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px', fontSize: '18px' }}>{topGenre.genre}</span>, accounting for{' '}
                  <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{topGenre.percentageOfTotalClicks}%</span> of total clicks. <br />
                  <Box p={'10px'} />
                  You've spent a total watch time of <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{topGenre.watchTime.slice(0, 8)}</span> on this genre,
                  which is <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{topGenre.percentageOfTotalWatchTime.toFixed(1)}%</span> of your total watch
                  time.
                  <br />
                  You've watched <span style={{ color: '#ff6a5f', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px', fontSize: '18px' }}>{topGenre.numberOfEpisodesWatched} episodes</span> and
                  liked
                  <span style={{ color: '#ff6a5f', fontWeight: 'bold', marginLeft: '3px', marginRight: '2px', fontSize: '18px' }}>{topGenre.numberOfLikes} episodes</span>.
                </Text>
              )}
              {mostWatchedPodcast && mostWatchedPodcast.length > 0 && (
                <>
                  <Text fontSize="18px" mb="10px" mt={'30px'} marginLeft="15px" color={'white'} fontWeight={'bold'}>
                    Your most listened-to podcast:
                  </Text>
                  <Center>
                    <PodcastCard podcast={mostWatchedPodcast[0]} />
                  </Center>
                </>
              )}
            </>
          ) : (
            <Text fontSize="16px" mb="15px" marginLeft="30px" color={'grey'}>
              No insights on your habits are available.
            </Text>
          )}
        </Box>
      </VStack>
    </>
  )
}
