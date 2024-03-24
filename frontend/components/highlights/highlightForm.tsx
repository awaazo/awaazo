import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  NumberInput,
  NumberInputField,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import HighlightHelper from '../../helpers/HighlightHelper';
import { HighlightEditRequest } from '../../types/Requests';

const HighlightForm = ({ episodeId, highlightId, fetchHighlights }) => {
  const [formData, setFormData] = useState({
    StartTime: '',
    EndTime: '',
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
        StartTime: parseFloat(formData.StartTime), // Convert string to number
        EndTime: parseFloat(formData.EndTime), // Convert string to number
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
        <FormLabel>Start Time (seconds)</FormLabel>
        <NumberInput min={0} onChange={(valueString) => setFormData((prev) => ({ ...prev, StartTime: valueString }))}>
          <NumberInputField name="StartTime" value={formData.StartTime} />
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>End Time (seconds)</FormLabel>
        <NumberInput min={0} onChange={(valueString) => setFormData((prev) => ({ ...prev, EndTime: valueString }))}>
          <NumberInputField name="EndTime" value={formData.EndTime} />
        </NumberInput>
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
