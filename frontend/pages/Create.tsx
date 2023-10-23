import React, { useCallback, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Select,
  Box,
  VStack
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/shared/Navbar';

const PodcastGenres = [
    "Technology",
    "Comedy",
    "Science",
    "History",
    "News",
    "True Crime",
    "Business",
    "Health",
    "Education",
    "Travel",
    "Music",
    "Arts",
    "Sports",
    "Politics",
    "Fiction",
    "Food",
];

const CreatePodcast = () => {
  const [episodeName, setEpisodeName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropAccepted(files, event) {
        console.log(files);
    },
  });

  return (
    <>
    <Navbar />
    <VStack spacing={5} align="center" p={5}>
      <FormControl>
        <FormLabel>Episode Name</FormLabel>
        <Textarea
          value={episodeName}
          onChange={(e) => setEpisodeName(e.target.value)}
          placeholder="Enter episode name..."
        />
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter podcast description..."
        />
      </FormControl>

      <FormControl>
        <FormLabel>Podcast Genre</FormLabel>
        <Select 
          placeholder="Select genre" 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {PodcastGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </Select>
      </FormControl>

      <Box {...getRootProps()} border="2px dashed gray" borderRadius="md" p={4} textAlign="center" width="300px">
        <input {...getInputProps()} />
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag & drop a podcast file here, or click to select one</p>
        )}
      </Box>

      <Button colorScheme="blue" onClick={() => {/* handle upload and save */}}>Upload</Button>
    </VStack>
    </>
  );
};

export default CreatePodcast;
