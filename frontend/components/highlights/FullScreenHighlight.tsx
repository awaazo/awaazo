import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, IconButton, Text } from "@chakra-ui/react";
import HighlightTicket from './HighlightTicket';
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import PodcastHelper from '../../helpers/PodcastHelper';

const FullScreenHighlight = ({ highlights, currentHighlightIndex, onClose, onNext, onPrevious }) => {
    const [episodes, setEpisodes] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
      const fetchEpisodes = async () => {
        try {
          const response = await PodcastHelper.podcastGetRecentEpisodes(0, 20); 
          if (response && response.episode) {
            setEpisodes(response.episode);
          } else {
            throw new Error('Failed to fetch episodes');
          }
        } catch (error) {
          console.error('Error fetching episodes:', error);
          setError('Failed to fetch episodes'); 
        }
      };
      fetchEpisodes();
    }, []);

    if (error) {
      return <Text color="red.500">{error}</Text>;
    }

  const currentHighlight = highlights[currentHighlightIndex];
    const correspondingEpisode = episodes.find(episode => episode.id === currentHighlight.episodeId);

    if (!correspondingEpisode) {
        console.error("No corresponding episode found for the current highlight.");
        return null; 
    }


    const handleScroll = (deltaY) => {
      if (isAnimating) return; 

      setIsAnimating(true); 
      if (deltaY > 0) {
          onNext();
      } else if (deltaY < 0) {
          onPrevious();
      }


      setTimeout(() => {
          setIsAnimating(false);
      }, 350); 
  };

  const handleWheel = (e) => {
      handleScroll(e.deltaY);
  };


    return (
      <Modal isOpen={true} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="transparent"/>
        <ModalContent>
        <IconButton
          aria-label="Close full screen"
          icon={<FaTimes />}
          size="lg"
          position="absolute"
          top={4}
          right={4}
          zIndex={10} 
          onClick={onClose}
          colorScheme="whiteAlpha"
        />
        <ModalBody onWheel={handleWheel}>
            <HighlightTicket
                        key={currentHighlightIndex} 
                        highlight={currentHighlight}
                        onOpenFullScreen={undefined}      
                        isFullScreenMode={true}   
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
};

export default FullScreenHighlight;