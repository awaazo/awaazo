import React, { useState, useEffect } from 'react';
import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import HighlightHelper from '../../helpers/HighlightHelper';
import { 
    IconButton, 
    Box, 
    Table, Thead, 
    Th, 
    Tr, 
    Tbody, 
    Td, 
    Input 
} from '@chakra-ui/react';

const HighlightList = ({ episodeId }) => {
    const [highlights, setHighlights] = useState([]);
    const [editingHighlightId, setEditingHighlightId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const fetchedHighlights = await HighlightHelper.getEpisodeHighlights(episodeId);
                setHighlights(fetchedHighlights);
            } catch (error) {
                console.error("Failed to fetch highlights:", error);
            }
        };
        fetchHighlights();
    }, [episodeId]);

    const handleEdit = (highlight) => {
        setEditingHighlightId(highlight.highlightId);
        setEditTitle(highlight.title);
        setEditDescription(highlight.description);
    };

    const handleEditHighlight = async (highlightId) => {
        console.log("Editing highlight with ID:", highlightId);
        if (editingHighlightId !== highlightId) {
            console.error("Editing ID mismatch");
            return;
        }
        console.log("Preparing to edit with title:", editTitle, "and description:", editDescription);
        const editRequestData = {
            HighlightId: highlightId,
            Title: editTitle,
            Description: editDescription,
        };
        try {
            const response = await HighlightHelper.highlightEditRequest(editRequestData, highlightId);
            console.log("Edit request response:", response);

            if (response.status === 200) {
                setHighlights(highlights.map(h => h.highlightId === highlightId ? {...h, title: editTitle, description: editDescription} : h));
                setEditingHighlightId(null); 
            } else {
                console.error("Failed to edit highlight. Response:", response);
            }
        } catch (error) {
            console.error("Error editing highlight:", error);
        }
    };

    const handleDeleteHighlight = async (highlightId) => {
        console.log("Deleting highlight with ID:", highlightId);
        try {
            const response = await HighlightHelper.highlightDeleteRequest(highlightId);
            console.log("Delete request response:", response);
            if (response.status === 200) {
                setHighlights((prevHighlights) => prevHighlights.filter((highlight) => highlight.highlightId !== highlightId));
            } else {
                console.error("Failed to delete highlight. Response:", response);
            }
        } catch (error) {
            console.error("Error deleting highlight:", error);
        }
      };
      

    const handleCancelEdit = () => {
        setEditingHighlightId(null);
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
                    <Tr key={highlight.highlightId}>
                        <Td>
                            {editingHighlightId === highlight.highlightId ? (
                                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            ) : (
                                highlight.title
                            )}
                        </Td>
                        <Td>
                            {editingHighlightId === highlight.highlightId ? (
                                <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                            ) : (
                                highlight.description
                            )}
                        </Td>
                        <Td>
                            {editingHighlightId === highlight.highlightId ? (
                                <>
                                    <IconButton icon={<CheckIcon />} aria-label="Save Changes" onClick={() => handleEditHighlight(highlight.highlightId)}  />
                                    <IconButton icon={<CloseIcon />} aria-label="Cancel" onClick={handleCancelEdit}  />
                                </>
                            ) : (
                                <>
                                    <IconButton icon={<EditIcon />} aria-label="Edit Highlight" onClick={() => handleEdit(highlight)} />
                                    <IconButton icon={<DeleteIcon />} aria-label="Delete Highlight" onClick={() => handleDeleteHighlight(highlight.highlightId)} />
                                </>
                            )}
                        </Td>
                    </Tr>
                ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default HighlightList;
