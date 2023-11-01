import React, { useCallback, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Box,
  VStack,
  Image,
  Input,
  Grid,
  GridItem,
  Select,
  Flex,
  HStack,
  useColorMode,
  Text,
  Center,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useSession } from "next-auth/react";
import Navbar from '../components/shared/Navbar';
import { AddIcon } from '@chakra-ui/icons';
import router from 'next/router';

// Sample podcasts data (replace with actual data)
const podcasts = [
  { id: 1, name: 'Mystery Tales', image: 'https://source.unsplash.com/random/200x200?sig=1' },
  { id: 2, name: 'Tech Tomorrow', image: 'https://source.unsplash.com/random/200x200?sig=2' },
  { id: 3, name: 'Health Hacks', image: 'https://source.unsplash.com/random/200x200?sig=3' },
  { id: 4, name: 'Eco Enigmas', image: 'https://source.unsplash.com/random/200x200?sig=4' },
  { id: 5, name: 'Market Insights', image: 'https://source.unsplash.com/random/200x200?sig=5' },
  { id: 6, name: 'Space Frontier', image: 'https://source.unsplash.com/random/200x200?sig=6' },
  { id: 7, name: 'Historic Moments', image: 'https://source.unsplash.com/random/200x200?sig=7' },
  { id: 8, name: 'Cooking Secrets', image: 'https://source.unsplash.com/random/200x200?sig=8' },
  // ... add more podcasts as needed
];


const PodcastGenres = [
  "Technology", "Comedy", "Science", "History", "News", "True Crime",
  "Business", "Health", "Education", "Travel", "Music", "Arts", 
  "Sports", "Politics", "Fiction", "Food",
];

const CreateEpisode = () => {
  const [episodeName, setEpisodeName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { colorMode } = useColorMode();

  const handlePodcastSelect = (podcast) => {
    setSelectedPodcast(podcast);
  };
  
    // Function to navigate to create podcast page
  const navigateToCreatePodcast = () => {
    router.push('/createPodcast.tsx');
  };

return (
  <>
      <Navbar />
      <Center>
        <VStack mt={"1em"}>
          <Heading fontWeight={"normal"} fontFamily={"Avenir Next"}>
            Upload Episode
          </Heading>
          <Text mb={"1em"} >Select Episode</Text>
        </VStack>
      </Center>

      <Box display="flex" width="100%" justifyContent="center">
        <Flex direction="row" wrap="wrap" justifyContent="center" alignItems="center">
          {podcasts.map((podcast) => (
            <Flex
              key={podcast.id}
              direction="column"
              alignItems="center"
              bg={selectedPodcast && selectedPodcast.id === podcast.id 
                  ? (colorMode === 'light' ? '#00000010' : '#FFFFFF10')
                  : 'transparent'}
              borderRadius="1em"
              cursor="pointer"
              outline={selectedPodcast && selectedPodcast.id === podcast.id ? '2px solid #3182CE' : 'none'}
              onClick={() => handlePodcastSelect(podcast)}
              p={2}
              m={2}
            >
              <Image
                src={podcast.image}
                alt={podcast.name}
                boxSize="100px"
                borderRadius="2em"
                objectFit="cover"
                boxShadow="lg"
              />
              <Text mt={2}>{podcast.name}</Text>
            </Flex>
          ))}

          {/* Create a Podcast Option */}
          <Flex
            direction="column"
            alignItems="center"
            borderRadius="1em"
            cursor="pointer"
            outline='none'
            onClick={navigateToCreatePodcast}
            p={2}
            m={2}
            bg='transparent'
          >
            <Box
              boxSize="100px"
              borderRadius="2em"
              border="2px dashed gray"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <AddIcon w={8} h={8} />
            </Box>
            <Text mt={2}>Create a Podcast</Text>
          </Flex>
        </Flex>
      </Box>


        
    {/* Form Container */}
    <Box display="flex" justifyContent="center">
      <VStack spacing={5} align="center" p={5}>
        {/* Form Container */}
          {/* Displaying Selected Podcast Title */}
          {selectedPodcast && (
            <Text
              fontSize="xl"
              fontWeight="normal"
              bg={colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'} // Slight transparency
              pl={5} // Padding for better visual spacing
              pr={5} // Padding for better visual spacing
              pt={2} // Padding for better visual spacing
              pb={2} // Padding for better visual spacing
              borderRadius="5em" // Rounded corners
              outline={colorMode === 'light' ? '1px solid #000000' : '1px solid #FFFFFF'} // Black or white border
              fontFamily={'Avenir Next'} 

            >
              {`${selectedPodcast.name}`}
            </Text>
          )}


          {/* Episode Name Input */}
          <FormControl>
            <FormLabel>Episode Name</FormLabel>
            <Input
              value={episodeName}
              onChange={(e) => setEpisodeName(e.target.value)}
              placeholder="Enter episode name..."
              rounded="lg"
            />
          </FormControl>

          {/* Description Textarea */}
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter podcast description..."
            />
          </FormControl>

          {/* Genre Selection */}
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

          {/* File Upload */}
          <Box {...getRootProps()} border="2px dashed gray" borderRadius="md" p={4} textAlign="center" width="300px">
            <input {...getInputProps()} />
            {file ? (
              <p>{file.name}</p>
            ) : (
              <p>Drag & drop a podcast file here, or click to select one</p>
            )}
          </Box>

          {/* Upload Button */}
          <Button colorScheme="blue" onClick={() => {/* handle upload and save */}} style={{
            outline: "solid 2px #3182CE",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "5em",
            width: "50%",
            height: "3em",
            marginTop: "1em",
            marginBottom: "1em",
            

          }}>Upload</Button>
  

      </VStack>
    </Box>
  </>
);

  };

export default CreateEpisode;
