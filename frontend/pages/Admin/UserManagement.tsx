import React, { useState } from 'react'
import {
  Flex,
  Box,
  Text,
  VStack,
  Avatar,
  Button,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { AwaazoLogo } from '../../public/icons'
import AdminSidebar from '../../components/admin/AdminSidebar'
import UserSearch from '../../components/admin/UserSearch'
import BannedUsers from '../../components/admin/BannedUsers'

import Link from 'next/link'
import AdminHelper from '../../helpers/AdminHelper'
import { data } from 'cypress/types/jquery'

const UserManagementPage = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const { isOpen: isEmailModalOpen, onOpen: onEmailModalOpen, onClose: onEmailModalClose } = useDisclosure()
  const { isOpen: isBanModalOpen, onOpen: onBanModalOpen, onClose: onBanModalClose } = useDisclosure()

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  const handleSendEmail = async () => {
    try {
      const data = {
        title: 'Test Email',
        emailBody: 'This is a test email',
        isHtmlBody: false,
      }
      const res = await AdminHelper.adminEmailRequest(selectedUser.id, data)
      onEmailModalClose()
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  const handlePermabanUser = async () => {
    try {
      const res = await AdminHelper.adminBanUserRequest(selectedUser.id)
      onBanModalClose()
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  return (
    <Flex maxHeight={'80vh'}>
      <AdminSidebar />

      <Box flex="1" p="4" ml={'15px'}>
        <Text fontSize={'32px'} fontWeight={'bold'} mb={'15px'}>
          User Management
        </Text>
        <Flex height={'85vh'}>
          <Box flexBasis="55%" mr="15px">
            <UserSearch onSelectUser={handleUserSelect} selectedUser={selectedUser} />
          </Box>
          <VStack flexBasis="45%" ml="15px">
            {selectedUser && (
              <Box mb={4} display="flex" alignItems="left" width={'100%'}>
                <VStack width={'100%'}>
                  <Flex width={'100%'}>
                    <Box mr={4} justifyContent="left">
                      <Avatar name={selectedUser.name} src={selectedUser.avatarUrl} boxSize={'175px'} />
                    </Box>
                    <Box>
                      <Text fontWeight="bold" mt={'10px'} mb={'5px'} fontSize={'24px'}>
                        {selectedUser.username}
                      </Text>
                      <Text>{selectedUser.bio}</Text>
                      <Link href={`/profile/${selectedUser.id}`} passHref>
                        <Button as="a" bg="az.red" borderRadius="15px" mt="10px" mb="10px" fontSize="15px" height="30px" width="150px">
                          Visit Profile
                        </Button>
                      </Link>
                    </Box>

                    <Box ml="auto" mr={4} mt={'10px'}>
                      <Icon as={AwaazoLogo} color="white" boxSize={'24px'} />
                    </Box>
                  </Flex>

                  <Flex mt={4} alignItems="center" justifyContent="space-between" width={'100%'}>
                    <Button bg={'az.blue'} borderRadius={'13px'} onClick={onEmailModalOpen}>
                      Send Email
                    </Button>
                    <Button bg={'az.darkGrey'} color={'az.red'} borderRadius={'13px'} onClick={onBanModalOpen}>
                      Permaban User
                    </Button>
                  </Flex>
                </VStack>
              </Box>
            )}
            <BannedUsers />
          </VStack>
        </Flex>
      </Box>
      {selectedUser && (
        <>
          {/* Email Modal */}
          <Modal isOpen={isEmailModalOpen} onClose={onEmailModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Send Email</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input placeholder="Subject" mb="4" />
                <Textarea placeholder="Message" />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={onEmailModalClose}>
                  Cancel
                </Button>
                <Button colorScheme="teal" mr={3} onClick={handleSendEmail}>
                  Send
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Ban Confirmation Modal */}
          <Modal isOpen={isBanModalOpen} onClose={onBanModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Permaban User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Are you sure you want to permaban {selectedUser.username}? This action cannot be undone.</ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={onBanModalClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" mr={3} onClick={handlePermabanUser}>
                  Ban User
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>{' '}
        </>
      )}
    </Flex>
  )
}

export default UserManagementPage
