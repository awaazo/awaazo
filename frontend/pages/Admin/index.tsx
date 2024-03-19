import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import AdminSidebar from '../../components/admin/AdminSidebar'

const AdminPage = () => {
  return (
    <Flex maxHeight={'80vh'}>
      <AdminSidebar />

      <Box flex="1" p="4">
        <h1>Admin Dashboard</h1>
      </Box>
    </Flex>
  )
}

export default AdminPage
