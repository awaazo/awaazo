// EmailLogsPage.js
import React, { useState, useEffect } from 'react'
import { Flex, Box, Text } from '@chakra-ui/react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import EmailLogs from '../../components/admin/EmailLogs'
import UserProfileHelper from '../../helpers/UserProfileHelper'
import AdminHelper from '../../helpers/AdminHelper'

const EmailLogsPage = () => {
  const [emails, setEmails] = useState([])
  const [selectedEmail, setSelectedEmail] = useState(null)

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
      if (populatedEmails.length > 0) {
        setSelectedEmail(populatedEmails[0])
      }
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
    <Flex height={`calc(100vh - 100px)`}>
      <AdminSidebar />

      <Box flex="1" p="4" ml={'15px'}>
        <Text fontSize={'32px'} fontWeight={'bold'} mb={'15px'}>
          Email Logs
        </Text>
        <Flex height={`calc((100vh - 100px))`}>
          <EmailLogs emails={emails} setSelectedEmail={setSelectedEmail} selectedEmail={selectedEmail} inDashboard={false} />
          {selectedEmail && (
            <Box flexBasis="60%" ml="15px" overflow="auto" bg="rgba(129, 137, 144, 0.1)" borderRadius="20px" p="15px">
              <Box borderRadius="10px" p="4">
                <Box borderRadius="md" p="4" mt="2" display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Text fontSize="18px" fontWeight="bold" display="inline">
                      From:{' '}
                    </Text>
                    <Text fontSize="18px" display="inline">
                      {selectedEmail.from}
                    </Text>
                    <br />
                    <Text fontSize="18px" fontWeight="bold" display="inline">
                      To:{' '}
                    </Text>
                    <Text fontSize="18px" display="inline">
                      {selectedEmail.to}
                    </Text>
                    <br />
                    <Text fontSize="18px" fontWeight="bold" display="inline">
                      Subject:{' '}
                    </Text>
                    <Text fontSize="18px" display="inline">
                      {selectedEmail.subject}
                    </Text>
                    <br />
                  </Box>
                  <Text fontSize="16px" color="az.greyish">
                    Sent at {new Date(selectedEmail.createdAt).toLocaleString()}
                  </Text>
                </Box>
                <Text fontSize="16px" mt="30px" color="az.greyish">
                  {selectedEmail.body}
                </Text>
              </Box>
            </Box>
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export default EmailLogsPage
