import { Box, IconButton, Table, Thead, Tbody, Tr, Th, Td, Tooltip } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {convertTime} from '../../utilities/commonUtils'

const AnnotationList = ({ annotations, deleteAnnotation }) => {
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
                  <IconButton icon={<DeleteIcon />} size="lg" colorScheme="black" aria-label="Delete Annotation" onClick={() => deleteAnnotation(annotation.id)} />
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
