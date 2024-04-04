import React, { useEffect, useState } from 'react'
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Text, Image, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import AdminHelper from '../../helpers/AdminHelper'
import UserProfileHelper from '../../helpers/UserProfileHelper'
import PodcastHelper from '../../helpers/PodcastHelper'
import { AwaazoA } from '../../public/icons'

const Reports = ({ onSelectReport, selectedReport, inDashboard, refresh }) => {
  const [selectedTab, setSelectedTab] = useState('pending')
  const [resolvedReports, setResolvedReports] = useState([])
  const [rejectedReports, setRejectedReports] = useState([])
  const [pendingReports, setPendingReports] = useState([])

  useEffect(() => {
    fetchPendingReports()
    fetchResolvedReports()
    fetchRejectedReports()
  }, [refresh])

  const fetchPendingReports = async () => {
    try {
      const response = await AdminHelper.adminGetPendingReports()
      const reportsWithDetails = await fetchReportsWithDetails(response.reports)
      setPendingReports(reportsWithDetails)
    } catch (error) {
      console.error('Error fetching pending reports:', error)
    }
  }

  const fetchResolvedReports = async () => {
    try {
      const response = await AdminHelper.adminGetResolvedReports()
      const resolvedReports = response.reports.map(async (report) => {
        const adminName = await getUsername(report.deletedBy)
        return { ...report, adminName }
      })
      setResolvedReports(await Promise.all(resolvedReports))
      console.log('Resolved Reports:', resolvedReports)
    } catch (error) {
      console.error('Error fetching resolved reports:', error)
    }
  }

  const fetchRejectedReports = async () => {
    try {
      const response = await AdminHelper.adminGetRejectedReports()
      const rejectedReports = response.reports.map(async (report) => {
        const adminName = await getUsername(report.deletedBy)
        return { ...report, adminName }
      })
      setRejectedReports(await Promise.all(rejectedReports))
      console.log('Rejected Reports:', rejectedReports)
    } catch (error) {
      console.error('Error fetching rejected reports:', error)
    }
  }

  const fetchReportsWithDetails = async (reports) => {
    try {
      return await Promise.all(
        reports.map(async (report) => {
          const reportWithDetails = { ...report }

          // Fetch reporter name
          const reporterName = await getUsername(report.reportedBy)
          let imageUrl = ''
          let entityName = ''

          if (report.targetEntityName === 'Podcast') {
            const res = await PodcastHelper.getPodcastById(report.targetId)
            imageUrl = res.podcast.coverArtUrl
            entityName = res.podcast.name
          } else if (report.targetEntityName === 'Episode') {
            const res = await PodcastHelper.getEpisodeById(report.targetId)
            imageUrl = res.episode.thumbnailUrl
            entityName = res.episode.episodeName
          } else if (report.targetEntityName === 'User') {
            const res = await UserProfileHelper.profileGetByIdRequest(report.targetId)
            imageUrl = res.userProfile.avatarUrl
            entityName = res.userProfile.username
          }

          reportWithDetails.reporterName = reporterName
          reportWithDetails.imageUrl = imageUrl
          reportWithDetails.entityName = entityName

          return reportWithDetails
        })
      )
    } catch (error) {
      console.error('Error fetching reports with details:', error)
      return []
    }
  }

  const getUsername = async (userId) => {
    try {
      const res = await UserProfileHelper.profileGetByIdRequest(userId)
      const user = res.userProfileByID
      if (!user) {
        return 'Deleted User'
      }
      return user.username
    } catch (error) {
      console.error('Error fetching username:', error)
      return 'Unknown'
    }
  }

  return (
    <Box flex="1" overflow="auto" bg="rgba(129, 137, 144, 0.1)" borderRadius="20px" p="15px" height={`calc((100vh - 100px))`}>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em" width={'300px'} border={'none'}>
          <Tab
            onClick={() => setSelectedTab('pending')}
            border={'none'}
            color={selectedTab === 'pending' ? 'white' : 'az.greyish'}
            fontWeight={selectedTab === 'pending' ? 'bold' : 'normal'}
            position="relative"
            fontSize="18px"
          >
            {selectedTab === 'pending' && (
              <>
                <AwaazoA
                  style={{
                    position: 'absolute',
                    top: '0.3em',
                    left: '0.2em',
                    fontSize: '0.8em',
                  }}
                />
              </>
            )}
            Pending
          </Tab>
          <Tab
            onClick={() => setSelectedTab('resolved')}
            border={'none'}
            color={selectedTab === 'resolved' ? 'white' : 'az.greyish'}
            fontWeight={selectedTab === 'resolved' ? 'bold' : 'normal'}
            position="relative"
            fontSize="18px"
          >
            {selectedTab === 'resolved' && (
              <>
                <AwaazoA
                  style={{
                    position: 'absolute',
                    top: '0.3em',
                    left: '0.2em',
                    fontSize: '0.8em',
                  }}
                />
              </>
            )}
            Resolved
          </Tab>
          <Tab
            onClick={() => setSelectedTab('rejected')}
            border={'none'}
            color={selectedTab === 'rejected' ? 'white' : 'az.greyish'}
            fontWeight={selectedTab === 'rejected' ? 'bold' : 'normal'}
            position="relative"
            fontSize="18px"
          >
            {selectedTab === 'rejected' && (
              <>
                <AwaazoA
                  style={{
                    position: 'absolute',
                    top: '0.3em',
                    left: '0.2em',
                    fontSize: '0.8em',
                  }}
                />
              </>
            )}
            Rejected
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {pendingReports.map((report) => (
              <Box
                p={'10px'}
                borderRadius="15px"
                bg={selectedReport && selectedReport.id === report.id ? 'az.blackish' : 'az.darkGrey'}
                mb={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
                onClick={inDashboard ? null : () => onSelectReport(report)}
              >
                {/* Image */}
                <Box flex="0 0 auto" mr={4}>
                  <Image src={report.imageUrl} alt="Image" borderRadius="15px" width="90px" height="90px" />
                </Box>

                <Box flex="1">
                  <Text fontWeight="bold" fontSize="24px" mb="2px">
                    {report.entityName}
                  </Text>
                  <Text fontWeight="bold" fontSize="16px" color={'az.greyish'} mb="2px">
                    {report.targetEntityName}
                  </Text>
                  <Box display="flex" justifyContent="space-between">
                    <Text fontSize="16px" display="inline-flex" alignItems="center" mr={'15px'}>
                      <Text color={'az.greyish'} fontWeight="bold">
                        Reporter:{' '}
                      </Text>
                      &nbsp;
                      {report.reporterName}
                    </Text>
                    <Text fontSize="16px" color={'az.red'} fontWeight={'bold'}>
                      {' '}
                      {report.reason}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
            {pendingReports && pendingReports.length === 0 && (
              <Text textAlign={'center'} fontSize={'24px'} mt={'50px'}>
                No Reports Yet
              </Text>
            )}
          </TabPanel>
          <TabPanel>
            <Table variant="simple" size="sm" borderWidth="0px">
              <thead>
                <Tr borderBottom="2px solid #4F4F4F">
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Target
                  </Th>
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Type
                  </Th>
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Delete Date
                  </Th>
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Admin
                  </Th>
                </Tr>
              </thead>

              <Tbody>
                {resolvedReports &&
                  resolvedReports.map((report, index) => (
                    <Tr key={index} bg={index % 2 === 0 ? '' : 'az.darkerGrey'}>
                      <Td borderBottom="none" textAlign="center" fontSize="13px" color="white" pb="15px" pt="15px">
                        {report.targetId}
                      </Td>
                      <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                        {report.targetEntityName}
                      </Td>
                      <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                        {new Date(report.deletedAt).toLocaleDateString()}
                      </Td>
                      <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                        {report.adminName}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
            {resolvedReports && resolvedReports.length === 0 && (
              <Text textAlign={'center'} fontSize={'24px'} mt={'50px'}>
                No Reports Yet
              </Text>
            )}
          </TabPanel>
          <TabPanel>
            <Table variant="simple" size="sm" borderWidth="0px">
              <thead>
                <Tr borderBottom="2px solid #4F4F4F">
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Target
                  </Th>
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Type
                  </Th>
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Delete Date
                  </Th>
                  <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
                    Admin
                  </Th>
                </Tr>
              </thead>

              <Tbody>
                {rejectedReports &&
                  rejectedReports.map((report, index) => (
                    <Tr key={index} bg={index % 2 === 0 ? '' : 'az.darkerGrey'}>
                      <Td borderBottom="none" textAlign="center" fontSize="13px" color="white" pb="15px" pt="15px">
                        {report.targetId}
                      </Td>
                      <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                        {report.targetEntityName}
                      </Td>
                      <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                        {new Date(report.deletedAt).toLocaleDateString()}
                      </Td>
                      <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                        {report.adminName}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
            {rejectedReports && rejectedReports.length === 0 && (
              <Text textAlign={'center'} fontSize={'24px'} mt={'50px'}>
                No Reports Yet
              </Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Reports
