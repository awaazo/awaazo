import { useState, useEffect } from 'react'
import { Avatar, Heading, Center, Text, VStack, Link, IconButton, Divider, Flex, Box, HStack, useColorModeValue, useBreakpointValue } from '@chakra-ui/react'
import { UserProfile } from '../../../types/Interfaces'
import { useSession } from 'next-auth/react'
import router from 'next/router'
import UserProfileHelper from '../../../helpers/UserProfileHelper'
import AnalyticsHelper from '../../../helpers/AnalyticsHelper'
import PodcastCard from '../../cards/PodcastCard'
import { AwaazoA, Pen } from '../../../public/icons'
import MetricDisplay from '../../assets/MetricDisplay'

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

  const metrics = [
    { value: 999, label: 'Podcasts' },
    { value: 1500, label: 'Episodes' },
    { value: 1200000, label: 'Likes' },
    { value: 500000, label: 'Subscribers' },
  ]

  return (
    <>
      <VStack width={'100%'} spacing={4} marginBottom={'2em'} ml={isMobile ? '25px' : '0px'}>
        <VStack spacing={'14px'} alignItems={'flex-start'}>
          <HStack alignItems={'flex-start'} width="100%">
            <Box position="relative">
              <Avatar boxShadow="xl" width="73px" height="73px" src={profile?.avatarUrl} />
              <Box position="absolute" top="50px" right="7">
                <IconButton
                  aria-label="Decorative Icon"
                  icon={<AwaazoA fontSize={'22px'} />}
                  position="absolute"
                  bottom={5}
                  right={5}
                  variant="ghost"
                  onClick={() => router.push('/profile/EditProfile')}
                  color="az.red"
                  _hover={{ color: 'az.lightRed' }}
                  data-cy={`edit_profile_button`}
                />{' '}
                <IconButton aria-label="Edit Profile" icon={<Pen fontSize={'11px'} />} position="absolute" bottom={'22px'} right={'19px'} pointerEvents="none" variant="ghost" color="white" />
              </Box>
            </Box>
            <VStack align="start" spacing={1}>
              <Heading textAlign={{ base: 'left', sm: 'left' }} margin="0 auto" fontSize={{ base: 'xl', sm: 'lg' }}>
                {profile?.displayName}
              </Heading>
              <Text fontSize="md" color={'az.greyish'} fontWeight={'bold'}>
                @{profile?.username}
              </Text>
            </VStack>
          </HStack>

          <Text textAlign="right" color="grey">
            {profile?.bio}
          </Text>

          <MetricDisplay metrics={metrics} />
        </VStack>
        <Box w="100%" mt={'16px'} >
          <Text fontWeight="bold" fontSize="md" mb="15px">
            Your Listening Habits:
          </Text>
          {averageWatchTime || totalWatchTime || topGenre || (mostWatchedPodcast && mostWatchedPodcast.length > 0) ? (
            <>
              {averageWatchTime && totalWatchTime && (
                <Text fontSize="md" mb="15px" color={'az.greyish'}>
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
                  <Text fontSize="md" mb="10px" mt={'30px'} marginLeft="15px" color={'white'} fontWeight={'bold'}>
                    Your most listened-to podcast:
                  </Text>
                  <Center>
                    <PodcastCard podcast={mostWatchedPodcast[0]} />
                  </Center>
                </>
              )}
            </>
          ) : (
            <Text fontSize="sm" mb="15px" marginLeft="30px" color={'grey'}>
              No insights on your habits are available.
            </Text>
          )}
        </Box>
      </VStack>
    </>
  )
}
