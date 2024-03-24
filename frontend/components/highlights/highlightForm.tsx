import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  useToast,
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

  const handleSubmit = async () => {
    let response;
  
    if (highlightId) {
      const editData: HighlightEditRequest = {
        Title: formData.Title,
        Description: formData.Description,
      };
  
      response = await HighlightHelper.highlightEditRequest(editData, highlightId);
    } else {
     
      const addData = {
        StartTime: formData.StartTime, 
        EndTime: formData.EndTime, 
        Title: formData.Title,
        Description: formData.Description,
      };
      
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
      fetchHighlights(); 
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
        fetchHighlights(); 
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
