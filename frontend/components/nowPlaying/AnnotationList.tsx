import {
  Box,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const AnnotationList = ({ annotations, editAnnotation, deleteAnnotation }) => {
  
  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead bgColor="gray.100">
          <Tr>
            <Th>Timestamp</Th>
            <Th>Content</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {annotations.map((annotation, index) => (
            <Tr key={index}>
              <Td>{annotation.timestamp}</Td>
              <Td>{annotation.content}</Td>
              <Td>{annotation.type}</Td>
              <Td>
                <Tooltip label="Edit Annotation" hasArrow>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    mr={2}
                    colorScheme="blue"
                    aria-label="Edit Annotation"
                    onClick={() => editAnnotation(index)}
                  />
                </Tooltip>
                <Tooltip label="Delete Annotation" hasArrow>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    aria-label="Delete Annotation"
                    onClick={() => deleteAnnotation(annotation.id)}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AnnotationList;
