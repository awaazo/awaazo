import React, { useState, useEffect } from 'react';
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import HighlightHelper from '../../helpers/HighlightHelper';
import { IconButton, Box, Table, Thead, Th, Tr, Tbody, Td } from '@chakra-ui/react';
import { HighlightEditRequest } from '../../types/Requests';

const HighlightList = ({ episodeId }) => {
  const [highlights, setHighlights] = useState([]);

  const fetchHighlights = async () => {
    try {
      const fetchedHighlights = await HighlightHelper.getEpisodeHighlights(episodeId);
      setHighlights(fetchedHighlights);
    } catch (error) {
      console.error("Failed to fetch highlights:", error);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, [episodeId]);

  const handleEditHighlight = async (highlightId) => {
    try {
        const response = await HighlightHelper.highlightEditRequest(HighlightEditRequest, highlightId);
        console.log("Edit request response:", response);

        if (response.status === 200) {
            fetchHighlights();
        } else {
            console.error("Failed to edit highlight. Response:", response);
        }
    } catch (error) {
        console.error("Error editing highlight:", error);
    }

    setHighlights((prevHighlights) => prevHighlights.filter((highlight) => highlight.id !== highlightId));
  };

  const handleDeleteHighlight = async (highlightId) => {
    console.log("Deleting highlight with ID:", highlightId);

    try {
        const response = await HighlightHelper.highlightDeleteRequest(highlightId);
        console.log("Delete request response:", response);

        if (response.status === 200) {
            fetchHighlights();
        } else {
            console.error("Failed to delete highlight. Response:", response);
        }
    } catch (error) {
        console.error("Error deleting highlight:", error);
    }

    setHighlights((prevHighlights) => prevHighlights.filter((highlight) => highlight.id !== highlightId));
};

  return (
    <Box overflowX="auto">
    <Table variant="simple" size="sm">
      <Thead bgColor="gray.100">
        <Tr>
          <Th>Title</Th>
          <Th>Description</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
      {highlights.map((highlight) => (
        <Tr key={highlight.id}>
          <Td>{highlight.title}</Td>
          <Td>{highlight.description}</Td>
          <Td>
             <IconButton icon={<EditIcon />} size="lg" colorScheme="white" color={'white'} aria-label="Edit Highlight" onClick={() => handleEditHighlight(highlight)} />
             <IconButton icon={<DeleteIcon />} size="lg" colorScheme="black" color={'white'} aria-label="Delete Highlight" onClick={() => handleDeleteHighlight(highlight.id)} />
          </Td>        
        </Tr>
      ))}
    </Tbody>
    </Table>
    </Box>
  );
};

export default HighlightList;