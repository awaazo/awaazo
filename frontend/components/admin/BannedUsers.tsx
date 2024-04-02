import React, { useState, useEffect } from 'react'
import { Box, Table, Tbody, Td, Text, Th, Tr, Avatar } from '@chakra-ui/react'
import AdminHelper from '../../helpers/AdminHelper'
import UserProfileHelper from '../../helpers/UserProfileHelper'

const BannedUsers = ({ inDashboard, refresh }) => {
  const [bannedUsers, setBannedUsers] = useState([])

  useEffect(() => {
    fetchBannedUsers()
  }, [refresh])

  const fetchBannedUsers = async () => {
    try {
      const response = await AdminHelper.adminGetUsers(true)
      const filteredBannedUsers = response.users.filter((user) => user.deletedAt !== null)
      const updatedBannedUsers = await Promise.all(
        filteredBannedUsers.map(async (user) => {
          const deletedBy = await getUsername(user.deletedBy)
          return { ...user, deletedBy }
        })
      )
      setBannedUsers(updatedBannedUsers)
    } catch (error) {
      console.error('Error fetching banned users:', error)
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
    <Box flex="1" overflow="auto" bg="rgba(129, 137, 144, 0.1)" borderRadius="20px" p="15px" height={inDashboard ? `calc((100vh - 100px) / 2)` : 'calc(100vh - 100px)'}>
      <Text fontWeight="bold" fontSize="24px">
        Banned Users
      </Text>
      <Table variant="simple" size="sm" borderWidth="0px">
        <thead>
          <Tr borderBottom="2px solid #4F4F4F">
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px"></Th>
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              Name
            </Th>
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              Email
            </Th>
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              Delete Date
            </Th>
            <Th textAlign="center" fontWeight="bold" fontSize="18px" color="white" pb="20px" style={{ textTransform: 'capitalize' }}>
              Deleted By
            </Th>
          </Tr>
        </thead>

        <Tbody>
          {bannedUsers.map((user, index) => (
            <Tr key={user.id} bg={index % 2 === 0 ? '' : 'az.darkerGrey'}>
              <Td borderBottom="none" textAlign="center" fontSize="14px" color="white" pb="15px" pt="15px">
                <Avatar src={user.avatarUrl} name={user.displayName} boxSize={'30px'} />
              </Td>
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {user.username}
              </Td>
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {user.email}
              </Td>
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {new Date(user.deletedAt).toLocaleDateString()}
              </Td>
              <Td borderBottom="none" textAlign="center" fontSize="16px" color="white" pb="15px" pt="15px">
                {user.deletedBy}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {bannedUsers && bannedUsers.length === 0 && (
        <Text textAlign={'center'} fontSize={'24px'} mt={'50px'}>
          No Banned Users
        </Text>
      )}
    </Box>
  )
}

export default BannedUsers
