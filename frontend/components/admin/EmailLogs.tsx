import React from 'react'
import { Table, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react'

const EmailLogs = ({ emails, setSelectedEmail, selectedEmail, inDashboard }) => {
  const handleEmailClick = (email) => {
    setSelectedEmail(email)
  }

  return (
    <Box flex="1" overflow="auto" bg="rgba(129, 137, 144, 0.1)" borderRadius="20px" p="15px" height={inDashboard ? `calc((100vh - 130px) / 2)` : 'calc(100vh - 100px)'}>
      <Table variant="simple" size="sm" borderWidth="0px">
        <thead>
          <Tr borderBottom="2px solid #4F4F4F">
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              From
            </Th>
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              To
            </Th>
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              Subject
            </Th>
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              Date
            </Th>
          </Tr>
        </thead>

        <Tbody>
          {emails.map((email, index) => (
            <Tr
              key={email.id}
              bg={selectedEmail && selectedEmail.id === email.id ? '' : index % 2 === 0 ? 'az.darkGrey' : 'az.darkerGrey'}
              cursor="pointer"
              fontWeight={selectedEmail && selectedEmail.id === email.id ? 'bold' : 'normal'}
              onClick={inDashboard ? null : () => handleEmailClick(email)}
            >
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {email.from}
              </Td>
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {email.to}
              </Td>
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {email.subject}
              </Td>
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {new Date(email.createdAt).toLocaleDateString()}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {emails && emails.length === 0 && (
        <Text textAlign={'center'} fontSize={'24px'} mt={'50px'}>
          No Emails Yet
        </Text>
      )}
    </Box>
  )
}

export default EmailLogs
