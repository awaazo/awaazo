import React from 'react';
import { Box, VStack, HStack, Text, Image, Icon, Divider } from '@chakra-ui/react';
import { FaHeart, FaBroadcastTower, FaMusic } from 'react-icons/fa';

const MyShelf = () => {
  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <HStack spacing={3}>
          <Icon as={FaHeart} color="purple.500" />
          <VStack align="start">
            <Text fontWeight="bold">Liked Songs</Text>
            <Text fontSize="sm" color="gray.400">Playlist • 193 songs</Text>
          </VStack>
        </HStack>
      </Box>

      <Divider borderColor="gray.700" />

      <Box>
        <HStack spacing={3}>
          <Icon as={FaBroadcastTower} color="green.500" />
          <VStack align="start">
            <Text fontWeight="bold">Your Episodes</Text>
            <Text fontSize="sm" color="gray.400">Saved & downloaded episodes</Text>
          </VStack>
        </HStack>
      </Box>

      <Divider borderColor="gray.700" />

      <Box>
        <HStack spacing={3}>
          <Icon as={FaMusic} color="blue.500" />
          <VStack align="start">
            <Text fontWeight="bold">Playlists</Text>
            <Box>
              <HStack spacing={3}>
                <Image src="/path/to/playlist-cover.jpg" alt="Playlist cover" boxSize="50px" />
                <VStack align="start">
                  <Text fontWeight="bold">Sleep</Text>
                </VStack>
              </HStack>
            </Box>

          </VStack>
        </HStack>
      </Box>
    </VStack>
  );
};

export default MyShelf;
