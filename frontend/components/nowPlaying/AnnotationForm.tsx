import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select
} from '@chakra-ui/react';

const AnnotationForm = ({ isOpen, onClose, annotation, saveAnnotation }) => {
  const [formData, setFormData] = useState(annotation || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    saveAnnotation(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{annotation ? 'Edit Annotation' : 'New Annotation'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Start Time</FormLabel>
            <Input name="startTime" value={formData.startTime} onChange={handleChange} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>End Time</FormLabel>
            <Input name="endTime" value={formData.endTime} onChange={handleChange} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Content</FormLabel>
            <Input name="content" value={formData.content} onChange={handleChange} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Type</FormLabel>
            <Select name="type" value={formData.type} onChange={handleChange}>
              <option value="definition">Definition</option>
              <option value="video">Video</option>
              <option value="ad">Ad</option>
              {/* Add more types as needed */}
            </Select>
          </FormControl>

          {/* Add more fields as needed */}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AnnotationForm;
