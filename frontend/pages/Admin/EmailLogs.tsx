import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import AdminSidebar from '../../components/admin/AdminSidebar'

const EmailLogsPage = (props) => {
  return (
    <Flex maxHeight={'80vh'}>
      <AdminSidebar />

      <Box flex="1" p="4">
        <h1>Email Logs</h1>
      </Box>
    </Flex>
  )
}

export default EmailLogsPage
