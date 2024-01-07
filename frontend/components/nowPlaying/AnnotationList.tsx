import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from '@chakra-ui/react';
  
  const AnnotationList = ({ annotations, editAnnotation, deleteAnnotation }) => {
    
    return (
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Start Time</Th>
              <Th>End Time</Th>
              <Th>Content</Th>
              <Th>Type</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {annotations.map((annotation, index) => (
              <Tr key={index}>
                <Td>{annotation.startTime}</Td>
                <Td>{annotation.endTime}</Td>
                <Td>{annotation.content}</Td>
                <Td>{annotation.type}</Td>
                <Td>
                  <Button size="sm" mr={3} onClick={() => editAnnotation(index)}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => deleteAnnotation(index)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default AnnotationList;
  