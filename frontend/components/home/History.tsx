import React, { useState, useEffect, useCallback } from 'react';
import { Episode, EpisodeWatchHistory } from '../../types/Interfaces';
import { 
  VStack, Text, Spinner, Button, Flex, useToast, 
  Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure 
} from '@chakra-ui/react';
import EpisodeHistoryCard from '../cards/EpisodeHistoryCard';
import PodcastHelper from '../../helpers/PodcastHelper';

import { MdDelete } from 'react-icons/md';

const POLLING_INTERVAL = 5000; // 5 seconds

const UserWatchHistory: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchUserWatchHistory = useCallback(async () => {
    try {
      const res = await PodcastHelper.getUserWatchHistory(0, 20);
      if (res.status === 200 && res.history) {
        const episodeIds = res.history.map((ewh: EpisodeWatchHistory) => ewh.episodeId);
        const episodesDetails = await Promise.all(
          episodeIds.map((id) => PodcastHelper.getEpisodeById(id))
        );
        const newEpisodes = episodesDetails.map((response) => response.episode).filter(Boolean);
        setEpisodes(newEpisodes);
      } else {
        throw new Error('Failed to load watch history');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching watch history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserWatchHistory();

    const intervalId = setInterval(() => {
      fetchUserWatchHistory();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchUserWatchHistory]);

  const handleHistoryUpdate = useCallback(() => {
    fetchUserWatchHistory();
  }, [fetchUserWatchHistory]);

  const handleClearAllHistory = async () => {
    try {
      const response = await PodcastHelper.deleteAllWatchHistory();
      if (response.status === 200) {
        setEpisodes([]);
        onClose();
        toast({
          title: "Watch history cleared",
          status: "success",
          position: "bottom-right",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to clear watch history');
      }
    } catch (error) {
      console.error("Error clearing watch history:", error);
      onClose();
      toast({
        title: "Failed to clear watch history",
        status: "error",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch" width="100%">
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Text fontSize="2xl" fontWeight="bold">Watch History</Text>
        <Button
          leftIcon={<MdDelete />}
          colorScheme="whiteAlpha"
          variant="outline"
          size="sm"
          onClick={onOpen}
          isDisabled={episodes.length === 0}
          _hover={{
            bg: "rgba(255, 255, 255, 0.1)",
          }}
          sx={{
            borderColor: "rgba(255, 255, 255, 0.8)",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Clear All History
        </Button>
      </Flex>
      {isLoading && episodes.length === 0 ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <VStack
          spacing={"12px"}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {episodes && episodes.length > 0 ? (
            episodes.map((episode) => (
              <EpisodeHistoryCard 
                key={episode.id} 
                episode={episode}
                showLike={true}
                showComment={true}
                showMore={true} 
                onHistoryUpdate={handleHistoryUpdate}
              />
            ))
          ) : (
            <Text>No episodes in watch history</Text>
          )}
        </VStack>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px)"
        />
        <ModalContent
          bg="rgba(50, 50, 50, 0.8)"
          backdropFilter="blur(4px)"
        >
          <ModalHeader color="white">Clear Watch History</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody color="white">
            Are you sure you want to clear your entire watch history? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleClearAllHistory}>
              Clear History
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default UserWatchHistory;