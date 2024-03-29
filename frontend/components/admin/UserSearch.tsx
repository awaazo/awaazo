import React, { useState, useEffect } from 'react'
import { Box, Text, Input, Button, Icon, InputRightElement, InputGroup, Spinner, Flex } from '@chakra-ui/react'
import UserProfileHelper from '../../helpers/UserProfileHelper'
import { Search, User } from '../../public/icons'

const UserSearch = ({ onSelectUser, selectedUser }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [showNoUsersMessage, setShowNoUsersMessage] = useState(false)
  const [searchTermDisplay, setSearchTermDisplay] = useState('')

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        fetchUsers()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [searchTerm])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    setShowNoUsersMessage(false)
    try {
      const res = await UserProfileHelper.profileSearchProfilesGet(0, 9, searchTerm)
      if (res.status === 200) {
        setSearchResults(res.users)
        setSearchTermDisplay(searchTerm) // Update searchTermDisplay only when the search is initiated
        if (res.users.length === 0) {
          setShowNoUsersMessage(true)
        }
      } else {
        console.error('Users cannot be fetched')
      }
    } catch (error) {
      console.error('Error fetching users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSelectUser = (user) => {
    onSelectUser(user)
  }

  return (
    <Box flex="1" bg="rgba(129, 137, 144, 0.1)" borderRadius="20px" p="15px" height={'85vh'}>
      <InputGroup maxWidth={'350px'} bg="az.darkGrey" borderRadius={'15px'} border={'none'} mb={4}>
        <Input
          borderRadius={'15px'}
          border={'none'}
          placeholder="Search for a User"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              fetchUsers()
            }
          }}
        />
        <InputRightElement>{loadingUsers ? <Spinner size="sm" color="gray.400" /> : <Icon as={Search} color="gray.400" />}</InputRightElement>
      </InputGroup>

      {searchTermDisplay && searchTermDisplay.length > 0 && (
        <Text color="white" textAlign="left" mb={2} fontSize={'24px'} fontWeight={'bold'} ml={'15px'}>
          Showing Results for "{searchTermDisplay}"
        </Text>
      )}

      <Box overflow="auto" width={'100%'}>
        {showNoUsersMessage && (
          <Text color="white" textAlign="center" mt={'20%'} fontSize={'24px'}>
            No users found
          </Text>
        )}
        {searchResults.map((user) => (
          <Box
            ml={'20px'}
            mr={'20px'}
            p={'10px'}
            borderRadius="15px"
            key={user.id}
            mb={2}
            bg={selectedUser && selectedUser.id === user.id ? 'az.blackish' : 'az.darkGrey'}
            display="flex"
            alignItems="center"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.05)' }}
            onClick={() => {
              handleSelectUser(user)
              onSelectUser(user)
            }}
          >
            {/* Avatar */}
            <Box flex="0 0 auto" mr={4}>
              <img src={user.avatarUrl} alt="Avatar" style={{ borderRadius: '50%', width: '60px', height: '60px' }} />
            </Box>

            {/* Username and Display Name */}
            <Box flex="1">
              <Text fontWeight="bold">{user.username}</Text>
              <Text>{user.displayName}</Text>
            </Box>

            <Box flex="0 0 auto" display="flex" flexDirection="column">
              <Text>{user.email}</Text>
              <Flex justifyContent="flex-end">
                {user.isAdmin && (
                  <Text fontWeight={'bold'} textAlign={'right'}>
                    Admin <Icon as={User} color="white" />
                  </Text>
                )}
              </Flex>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default UserSearch
