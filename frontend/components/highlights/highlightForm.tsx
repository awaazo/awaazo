import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  useToast,
  Box,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  HStack,
} from '@chakra-ui/react';
import HighlightHelper from '../../helpers/HighlightHelper';
import { HighlightEditRequest } from '../../types/Requests';
import {convertTime} from '../../utilities/commonUtils'

const HighlightForm = ({ episodeId, highlightId, fetchHighlights, episodeLength }) => {
  const [formData, setFormData] = useState({
    StartTime: 0,
    EndTime: episodeLength,
    Title: '',
    Description: '',
  });
  const toast = useToast();

  useEffect(() => {
    if (highlightId) {
    }
  }, [highlightId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRangeChange = ([start, end]) => {
    setFormData((prev) => ({
      ...prev,
      StartTime: start.toString(),
      EndTime: end.toString(),
    }));
  };

  const handleDirectInputChange = (name, value) => {
    // Ensure the value is within the allowed range before updating
    const timeValue = Math.max(0, Math.min(episodeLength, Number(value)));
    setFormData((prev) => ({ ...prev, [name]: timeValue.toString() }));
  };

  const handleSubmit = async () => {
    let response;
  
    if (highlightId) {
      // Preparing data for editing highlight
      const editData: HighlightEditRequest = {
        Title: formData.Title,
        Description: formData.Description,
      };
      // Editing highlight
      response = await HighlightHelper.highlightEditRequest(editData, highlightId);
    } else {
      // Preparing data for adding new highlight
      const addData = {
        StartTime: formData.StartTime, // Convert string to number
        EndTime: formData.EndTime, // Convert string to number
        Title: formData.Title,
        Description: formData.Description,
      };
      // Adding new highlight
      response = await HighlightHelper.highlightCreateRequest(addData, episodeId);
    }
  
    if (response.status === 200) {
      toast({
        title: 'Success',
        description: highlightId ? 'Highlight updated successfully.' : 'Highlight added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchHighlights(); // Refresh highlights list
    } else {
      toast({
        title: 'Error',
        description: response.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  const handleDelete = async () => {
    if (highlightId) {
      const response = await HighlightHelper.highlightDeleteRequest(highlightId);
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Highlight deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchHighlights(); // Refresh highlights list
      } else {
        toast({
          title: 'Error',
          description: response.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
          <FormLabel>Highlight Time Range (seconds)</FormLabel>
          
          <HStack spacing={2}>
            {/* <Input
              type="number"
              value={formData.StartTime}
              onChange={(e) => handleDirectInputChange('StartTime', e.target.value)}
              max={episodeLength}
              min={0}
              step={1}
              width="24%"
            /> */}
          
            <RangeSlider
              aria-label={['start-time', 'end-time']}
              id="highlight-time-range"
              min={0}
              max={episodeLength}
              defaultValue={[0, 15]}
              value={[Number(formData.StartTime), Number(formData.EndTime)]}
              onChange={handleRangeChange}
              step={1} // Setting the step to 1 second for easier adjustments
              onChangeEnd={(val) => {
                if (val[1] - val[0] > 15) {
                  // Adjust the range to not exceed 15 seconds
                  const adjustedEnd = val[0] + 15 > episodeLength ? episodeLength : val[0] + 15;
                  handleRangeChange([val[0], adjustedEnd]);
                }
              }}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            
{/*   
            <Input
              type="number"
              value={formData.EndTime}
              onChange={(e) => handleDirectInputChange('EndTime', e.target.value)}
              max={episodeLength}
              min={0}
              step={1}
              width="24%"
            /> */}
          </HStack>
            <Text mt={2}>
              Start: {convertTime(Number(formData.StartTime))}, End: {convertTime(Number(formData.EndTime))}
            </Text>
            <Text color="gray.500" fontSize="sm">   Max duration 15 seconds</Text>
        </FormControl>

      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input name="Title" value={formData.Title} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea name="Description" value={formData.Description} onChange={handleChange} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        {highlightId ? 'Edit Highlight' : 'Add Highlight'}
      </Button>
      {highlightId && (
        <Button colorScheme="red" onClick={handleDelete}>
          Delete Highlight
        </Button>
      )}
    </VStack>
  );
};

export default HighlightForm;
