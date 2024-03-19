import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import AdminSidebar from '../../components/admin/AdminSidebar'

const ReportsPage = () => {
  return (
    <Flex maxHeight={'80vh'}>
      <AdminSidebar />

      <Box flex="1" p="4">
        <h1>Reports</h1>
      </Box>
    </Flex>
  )
}

export default ReportsPage
