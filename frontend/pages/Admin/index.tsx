import React, { useState, useEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Reports from '../../components/admin/Reports'
import BannedUsers from '../../components/admin/BannedUsers'
import EmailLogs from '../../components/admin/EmailLogs'
import AdminHelper from '../../helpers/AdminHelper'
import UserProfileHelper from '../../helpers/UserProfileHelper'

const AdminPage = () => {
  const [emails, setEmails] = useState([])

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await AdminHelper.adminGetLogs(0)
      const emailData = response.emails || []
      const populatedEmails = await Promise.all(
        emailData.map(async (email) => {
          const fromUser = await getUsername(email.adminUserId)
          const toUser = await getUsername(email.toUserId)
          return {
            ...email,
            from: fromUser,
            to: toUser,
          }
        })
      )
      setEmails(populatedEmails)
    } catch (error) {
      console.error('Error fetching emails:', error)
    }
  }

  const getUsername = async (userId) => {
    const res = await UserProfileHelper.profileGetByIdRequest(userId)
    const user = res.userProfileByID
    if (!user) {
      return 'Deleted User'
    }
    return user.username
  }

  return (
    <Flex height={`calc((100vh - 100px))`}>
      <AdminSidebar />

      <Flex flex="1" p="4" ml={'15px'} flexDirection="column">
        <Text fontSize={'32px'} fontWeight={'bold'} mb={'15px'} height={'50px'}>
          Admin Panel
        </Text>
        <Flex>
          <Box flexBasis="50%" mr="15px">
            <Reports onSelectReport={null} selectedReport={null} inDashboard={true} />
          </Box>
          <Box flexBasis="50%" ml="15px">
            <BannedUsers inDashboard={true} refresh={null} />
            <Box mt={'15px'} />
            <EmailLogs selectedEmail={null} setSelectedEmail={null} emails={emails} inDashboard={true} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default AdminPage
