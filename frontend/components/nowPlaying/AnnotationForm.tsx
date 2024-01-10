import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input, Select, VStack } from '@chakra-ui/react';
import AnnotationHelper from '../../helpers/AnnotationHelper'; // Adjust the path as necessary

const AnnotationForm = ({ episodeId, annotation, onSaveSuccess, onSaveError }) => {
  const [formData, setFormData] = useState({
    timestamp: annotation?.timestamp || '',
    content: annotation?.content || '',
    type: annotation?.type || 'general',
    videoUrl: annotation?.videoUrl || '', 
    imageUrl: annotation?.imageUrl || '', 
    referenceUrl: annotation?.referenceUrl || '', 
    // Add other fields as necessary
  });

  useEffect(() => {
    if (annotation) {
      setFormData(annotation); // Set form data when editing an annotation
    }
  }, [annotation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      let response;
      // Determine the method to call based on the annotation type
      if (formData.type === 'mediaLink') {
        response = await AnnotationHelper.mediaLinkAnnotationCreateRequest(formData, episodeId);
      } else if (formData.type === 'sponsor') {
        response = await AnnotationHelper.sponsorAnnotationCreateRequest(formData, episodeId);
      } else {
        response = await AnnotationHelper.annotationCreateRequest(formData, episodeId);
      }

      if (response.status === 200) {
        onSaveSuccess(response.data);
      } else {
        onSaveError(response.message);
      }
    } catch (error) {
      onSaveError(error.message);
    }
  };

  const renderAdditionalFields = () => {
    // Add additional fields as necessary
    switch (formData.type) {
      case 'mediaLink':
        return (
          <>
            <FormControl>
              <FormLabel>Video URL</FormLabel>
              <Input name="videoUrl" value={formData.videoUrl || ''} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} />
            </FormControl>
          </>
        );
      case 'sponsor':
        return (
          <FormControl>
            <FormLabel>Reference URL</FormLabel>
            <Input name="referenceUrl" value={formData.referenceUrl || ''} onChange={handleChange} />
          </FormControl>
        );
      // Add more cases as necessary
      default:
        return null;
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Timestamp</FormLabel>
        <Input name="timestamp" value={formData.timestamp || ''} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Input name="content" value={formData.content || ''} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Annotation Type</FormLabel>
        <Select name="type" value={formData.type} onChange={handleChange}>
          <option value="general">General</option>
          <option value="mediaLink">Media Link</option>
          <option value="sponsor">Sponsor</option>
          {/* Add other types as needed */}
        </Select>
      </FormControl>
      {renderAdditionalFields()}
      <Button colorScheme="blue" onClick={handleSubmit}>Save</Button>
    </VStack>
  );
};

export default AnnotationForm;
