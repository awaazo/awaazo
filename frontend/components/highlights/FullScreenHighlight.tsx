import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, IconButton, Text } from "@chakra-ui/react";
import HighlightTicket from './HighlightTicket';
import { FaTimes } from "react-icons/fa";
import PodcastHelper from '../../helpers/PodcastHelper';

const FullScreenHighlight = ({ highlights, currentHighlightIndex, onClose, onNext, onPrevious }) => {
    const [episodes, setEpisodes] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState("");
    const [animationDirection, setAnimationDirection] = useState('forward');
    const [showHighlight, setShowHighlight] = useState(false);

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
      setShowHighlight(true);
    }, [currentHighlightIndex, episodes]);

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
      setShowHighlight(false); 

      setTimeout(() => {
          if (deltaY > 0) {
              setAnimationDirection('forward');
              onNext();
          } else if (deltaY < 0) {
              setAnimationDirection('backward');
              onPrevious();
          }
          setShowHighlight(true); 
          setIsAnimating(false);
      }, 530);
  };

    const handleWheel = (e) => {
        handleScroll(e.deltaY);
    };

    const modalBodyStyle = {
      transition: 'opacity 0.50s ease-out, transform 0.50s ease-out',
      opacity: showHighlight ? 1 : 0, 
      transform: `translateY(${animationDirection === 'forward' ? '100%' : '-100%'})`,
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
        <ModalBody onWheel={handleWheel} style={!isAnimating ? {} : modalBodyStyle}>
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