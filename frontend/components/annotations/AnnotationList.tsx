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
import {  DeleteIcon } from '@chakra-ui/icons';

const AnnotationList = ({ annotations, editAnnotation, deleteAnnotation }) => {

  const convertTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
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
              <Td>{convertTime(annotation.timestamp)}</Td>
              <Td>{annotation?.content}</Td>
              <Td>{annotation?.annotationType}</Td>
              <Td>
                <Tooltip label="Delete Annotation" hasArrow>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="lg"
                    colorScheme="black"
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
