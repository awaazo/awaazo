import React, { useState, useEffect } from 'react'
import { Select, Box, Text, Spinner } from '@chakra-ui/react'
import AnalyticsHelper from '../../helpers/AnalyticsHelper'
import { Episode } from '../../types/Interfaces'
import EpisodeCard from '../cards/EpisodeCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Line, LineChart } from 'recharts'

export default function Analytics({ podcastId }) {
  const [selectedOption, setSelectedOption] = useState('mostLiked')
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [ageData, setAgeData] = useState([])
  const [watchTimeData, setWatchTimeData] = useState([])
  const [minAge, setMinAge] = useState(0)
  const [maxAge, setMaxAge] = useState(0)
  const [averageAge, setAverageAge] = useState(0)
  const [ageCount, setAgeCount] = useState(0)
  const [averageWatchTime, setAverageWatchTime] = useState('')
  const [totalWatchTime, setTotalWatchTime] = useState('')
  const [minWatchTime, setMinWatchTime] = useState('')
  const [maxWatchTime, setMaxWatchTime] = useState('')
  const [totalClicks, setTotalClicks] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true)
      try {
        let res
        switch (selectedOption) {
          case 'mostCommented':
            res = await AnalyticsHelper.getMostCommentedResponse(podcastId, 3, false)
            break
          case 'mostLiked':
            res = await AnalyticsHelper.getMostLikedResponse(podcastId, 3, false)
            break
          case 'mostClicked':
            res = await AnalyticsHelper.getMostClickedResponse(podcastId, 3, false)
            break
          case 'mostListened':
            res = await AnalyticsHelper.getMostWatchedResponse(podcastId, 3, false)
            break
          default:
            res = { episodes: [] }
        }
        setEpisodes(res.data)
      } catch (error) {
        console.error('Error fetching episodes:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchAgeData = async () => {
      try {
        const response = await AnalyticsHelper.getAgeRangeDistributionInfoResponse(podcastId, 1)
        const response2 = await AnalyticsHelper.getAgeRangeInfoResponse(podcastId, 0, 1000)

        setMinAge(response2.data.min)
        setMaxAge(response2.data.max)
        setAverageAge(response2.data.average)
        setAgeCount(response2.data.count)

        const ageGroups = [
          { min: 15, max: 19 },
          { min: 20, max: 24 },
          { min: 25, max: 29 },
          { min: 30, max: 34 },
          { min: 35, max: 39 },
          { min: 40, max: 44 },
          { min: 45, max: 49 },
          { min: 50, max: 54 },
          { min: 55, max: 59 },
          { min: 60, max: 64 },
          { min: 65, max: 69 },
          { min: 70, max: 74 },
          { min: 75, max: Infinity },
        ]

        // Initialize age groups with count and percentage
        const totalCount = response.data.reduce((acc, curr) => acc + curr.count, 0)
        const groupedAgeData = ageGroups.map(({ min, max }) => {
          const count = response.data.reduce((acc, curr) => {
            if (curr.average >= min && curr.average <= max) {
              return acc + curr.count
            }
            return acc
          }, 0)

          return {
            ageRange: `${min}-${max === Infinity ? '75+' : max}`,
            count,
            percentage: totalCount === 0 ? 0 : Math.round((count / totalCount) * 1000) / 10, // Round to one decimal point
          }
        })

        // Update the state with groupedAgeData
        setAgeData(groupedAgeData)
      } catch (error) {
        console.error('Error fetching age data:', error)
      }
    }

    const fetchWatchData = async () => {
      try {
        const watchTimeResponse = await AnalyticsHelper.getWatchTimeDistributionResponse(podcastId, 1, true)
        const response2 = await AnalyticsHelper.getWatchTimeRangeInfoResponse(podcastId, 0, 1400)

        setMinWatchTime(formatTime(response2.data.minWatchTime))
        setMaxWatchTime(formatTime(response2.data.maxWatchTime))
        setAverageWatchTime(formatTime(response2.data.averageWatchTime))
        setTotalWatchTime(formatTime(response2.data.totalWatchTime))
        setTotalClicks(response2.data.totalClicks)

        // Process watch time data
        const watchTimeRanges = [
          { start: '00:00', end: '04:59' },
          { start: '05:00', end: '09:59' },
          { start: '10:00', end: '14:59' },
          { start: '15:00', end: '19:59' },
          { start: '20:00', end: '24:00' },
          { start: '25:00', end: '29:59' },
          { start: '30:00', end: '34:59' },
          { start: '35:00', end: '39:59' },
          { start: '40:00', end: '44:59' },
          { start: '45:00', end: '49:59' },
          { start: '50:00', end: '54:59' },
          { start: '55:00', end: '59:59' },
          { start: '60:00', end: '64:59' },
          { start: '65:00', end: '69:59' },
          { start: '70:00', end: '74:59' },
          { start: '75:00', end: '79:59' },
          { start: '80:00', end: '84:59' },
          { start: '85:00', end: '89:59' },
          { start: '90:00', end: '90:00+' },
        ]

        const groupedWatchTimeData = watchTimeRanges.map(({ start, end }) => {
          // Convert start and end time to seconds
          const startTimeInSeconds = parseMinutesSecondsToSeconds(start)
          const endTimeInSeconds = parseMinutesSecondsToSeconds(end)

          // Filter watch time data within the current range
          const watchTimeInCurrentRange = watchTimeResponse.data.filter((episode) => {
            const avgWatchTimeInSeconds = parseTimeToSeconds(episode.averageWatchTime)
            return avgWatchTimeInSeconds >= startTimeInSeconds && avgWatchTimeInSeconds <= endTimeInSeconds
          })

          // Calculate the total percentage of watch time within the current range
          const totalPercentage = watchTimeInCurrentRange.reduce((acc, curr) => acc + curr.watchTimePercentage, 0)

          return {
            rangeStart: `${start} - ${end === '90:00+' ? '90:00+' : end}`,
            percentage: parseFloat(totalPercentage.toFixed(1)),
          }
        })

        setWatchTimeData(groupedWatchTimeData)
        console.log('watchTimeData', watchTimeData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchEpisodes()
    fetchAgeData()
    fetchWatchData()
  }, [selectedOption, podcastId])

  // Format time values
  const formatTime = (time) => {
    const [hours, minutes, seconds] = time.split(':')
    const roundedSeconds = Math.round(parseFloat(seconds))
    const formattedSeconds = roundedSeconds < 10 ? `0${roundedSeconds}` : roundedSeconds
    const formattedHours = hours.padStart(2, '0')
    return `${formattedHours}:${minutes}:${formattedSeconds}`
  }

  const parseMinutesSecondsToSeconds = (time) => {
    const [minutes, seconds] = time.split(':').map(parseFloat)
    const totalSeconds = minutes * 60 + seconds
    return totalSeconds
  }

  const parseTimeToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(parseFloat)
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    return totalSeconds
  }

  const maxPercentage = Math.max(...ageData.map(({ percentage }) => Math.round(percentage * 10) / 10))
  const yAxisDomain = [0, Math.round(maxPercentage * 2)]

  const maxWatchTimePercentage = Math.max(...watchTimeData.map(({ percentage }) => Math.round(percentage * 10) / 10))
  const yAxisDomainWatchTime = [0, Math.round(maxWatchTimePercentage * 2)]

  return (
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Text fontWeight="bold" fontSize="24px" mb="15px">
          Interaction Insights:
        </Text>
        <Select fontSize="20px" fontWeight="bold" bg="az.red" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} mb="15px">
          <option value="mostCommented" style={{ backgroundColor: '#333' }}>
            Most Commented
          </option>
          <option value="mostLiked" style={{ backgroundColor: '#333' }}>
            Most Liked
          </option>
          <option value="mostClicked" style={{ backgroundColor: '#333' }}>
            Most Clicked
          </option>
          <option value="mostListened" style={{ backgroundColor: '#333' }}>
            Most Listen Time
          </option>
        </Select>
        <Box>
          {loading ? (
            <Spinner />
          ) : episodes.length > 0 ? (
            episodes.map((episode) => (
              <Box key={episode.id} mb="10px">
                <EpisodeCard episode={episode} />
              </Box>
            ))
          ) : (
            <Text textAlign={'center'} mt={'30px'} mb={'30px'} fontSize={'18px'}>
              No data available for Interaction Insights
            </Text>
          )}
        </Box>
      </Box>

      {/* Right Section - Audience Insights */}
      <Box flex="1" marginLeft="30px">
        <Text fontWeight="bold" fontSize="24px" mb="15px" marginLeft="30px">
          Audience Insights:
        </Text>
        {ageData.length > 0 ? (
          <React.Fragment>
            <Text fontSize="18px" mb="15px" marginLeft="30px" color={'grey'}>
              Your audience is between{' '}
              <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>
                {minAge} and {maxAge} years old{' '}
              </span>{' '}
              on average, with the average age of listeners being around <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{averageAge} years old</span> based
              on <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{ageCount} listeners.</span>
            </Text>
            <Box>
              <Text fontSize="18px" mb="5px" marginLeft="30px" color={'az.red'}>
                Audience Age Distribution
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageData} margin={{ bottom: 50, left: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="ageRange" interval={0} angle={-45} textAnchor="end" fontSize={'16px'} />
                  <YAxis type="number" domain={yAxisDomain} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="percentage" fill="#ff6a5f" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </React.Fragment>
        ) : (
          <Text textAlign={'center'} mt={'30px'} mb={'30px'} fontSize={'18px'}>
            No data available for Audience Insights
          </Text>
        )}
        <Text fontWeight="bold" fontSize="24px" mb="15px" marginLeft="30px">
          Watch Time Insights:
        </Text>
        {watchTimeData.length > 0 ? (
          <React.Fragment>
            <Box>
              {' '}
              <Text fontSize="18px" mb="15px" marginLeft="30px" color={'grey'}>
                On average, your audience watches between
                <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>
                  {' '}
                  {minWatchTime} and {maxWatchTime},
                </span>{' '}
                with an average watch time of <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{averageWatchTime} per listener,</span> based on{' '}
                <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{totalWatchTime} total watch time</span> from{' '}
                <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '2px', marginRight: '2px' }}>{totalClicks} clicks.</span>
              </Text>
              <Text fontSize="18px" mb="5px" marginLeft="30px" color={'az.red'}>
                Watch Time Distribution
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={watchTimeData} margin={{ bottom: 80, left: 5 }}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="rangeStart" interval={1} angle={-45} textAnchor="end" fontSize={'16px'} />
                  <YAxis type="number" domain={yAxisDomain} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line type="monotone" dataKey="percentage" stroke="#ff6a5f" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </React.Fragment>
        ) : (
          <Text textAlign={'center'} mt={'30px'} mb={'30px'} fontSize={'18px'}>
            No data available for Watch Time Insights
          </Text>
        )}
      </Box>
    </Box>
  )
}
