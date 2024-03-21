import React, { useState } from 'react';
import HighlightHelper from '../../helpers/HighlightHelper';
import { Box, Button, Flex, Text, Input, FormControl,  Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import convertTime from '../../utilities/commonUtils';


const HighlightForm = ({ episodeId }) => {
    const [highlightData, setHighlightData] = useState({
        episodeId: episodeId,
        highlightId: '',
        startTime: '',
        endTime: '',
        description: '',
    });
    const [message, setMessage] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHighlightData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                EpisodeId: highlightData.episodeId, 
                HighlightId: highlightData.highlightId,
                StartTime: highlightData.startTime,
                EndTime: highlightData.endTime,
                description: highlightData.description,
            };
            const response = await HighlightHelper.highlightCreateRequest(formattedData, highlightData.episodeId);
            setMessage(response.message);
            setIsFormVisible(false); // Hide form on successful submission
        } catch (error) {
            setMessage('Failed to create highlight.');
        }
    };

    const handleDelete = async (highlightId) => {
        try {
            const response = await HighlightHelper.highlightDeleteRequest(highlightId);
            setMessage(response.message);
        } catch (error) {
            setMessage('Failed to delete highlight.');
        }
    };

    return (
        <Flex direction="column" alignItems="center" width="100%">
            <Box mt={4} width="100%" alignItems="center">
                {isFormVisible ? (
                    <Box width="100%" p={4} borderWidth="1px" borderRadius="lg">
                        <Text fontSize="xl" fontWeight="bold" mb={6} mt={1} textAlign="center">
                            Add/Edit Highlight
                        </Text>
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <Input
                                    placeholder="Description"
                                    mb={3}
                                    name="description"
                                    value={highlightData.description}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    placeholder="Start Time"
                                    mb={3}
                                    name="startTime"
                                    value={highlightData.startTime}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    placeholder="End Time"
                                    mb={3}
                                    name="endTime"
                                    value={highlightData.endTime}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                            <Flex justifyContent="space-between" mt={4}>
                                <Button colorScheme="blue" type="submit">Submit</Button>
                                <Button colorScheme="red" onClick={() => setIsFormVisible(false)}>Cancel</Button>
                            </Flex>
                        </form>
                    </Box>
                ) : (
                    <Button onClick={() => setIsFormVisible(true)} colorScheme="teal" size="md" mb={4}>
                        Add/Edit Highlight
                    </Button>
                )}
                {message && <Text color="red.500">{message}</Text>}
                {/* Display highlights and delete button here */}
            </Box>
        </Flex>
    );
};

export default HighlightForm;