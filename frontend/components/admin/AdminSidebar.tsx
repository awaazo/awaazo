import React from 'react'
import { Box, Flex, Icon, VStack, Image } from '@chakra-ui/react'
import Link from 'next/link'
import { MdSpaceDashboard } from 'react-icons/md'
import { GoReport } from 'react-icons/go'
import { FaUsersCog } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

import Logo from '../../public/logos/logo_white.svg'
import { useRouter } from 'next/router'

const AdminSidebar = () => {
  const router = useRouter()

  return (
    <Box bg="rgba(255, 255, 255, 0.04)" w="80px" h="100vh" px={4} py={8} position="sticky" zIndex={10} outline={'2px solid rgba(255, 255, 255, 0.06)'}>
      <VStack align="center" spacing={4}>
        <Flex justify="center" align="center" mb={7}>
          <Image src={Logo.src} alt="Logo" w="40px" />
        </Flex>
        <Link href="/Admin/">
          <Flex align="center" p={2} color={router.pathname === '/Admin' ? 'blue.500' : 'white'}>
            <Icon as={MdSpaceDashboard} boxSize={'30px'} />
          </Flex>
        </Link>

        <Link href="/Admin/Reports">
          <Flex align="center" p={2} color={router.pathname === '/Admin/Reports' ? 'blue.500' : 'white'}>
            <Icon as={GoReport} boxSize={'30px'} />
          </Flex>
        </Link>

        <Link href="/Admin/UserManagement">
          <Flex align="center" p={2} color={router.pathname === '/Admin/UserManagement' ? 'blue.500' : 'white'}>
            <Icon as={FaUsersCog} boxSize={'30px'} />
          </Flex>
        </Link>

        <Link href="/Admin/EmailLogs">
          <Flex align="center" p={2} color={router.pathname === '/Admin/EmailLogs' ? 'blue.500' : 'white'}>
            <Icon as={MdEmail} boxSize={'30px'} />
          </Flex>
        </Link>
      </VStack>
    </Box>
  )
}

export default AdminSidebar
