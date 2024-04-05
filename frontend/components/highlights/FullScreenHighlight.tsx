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
    const [lastScrollTime, setLastScrollTime] = useState(0);
    const scrollDebounceTime = 1000;
    const [nextImageLoaded, setNextImageLoaded] = useState(false);

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

    useEffect(() => {
      const preloadImages = () => {
        const nextIndex = currentHighlightIndex + 1 < highlights.length ? currentHighlightIndex + 1 : 0;
        const prevIndex = currentHighlightIndex - 1 >= 0 ? currentHighlightIndex - 1 : highlights.length - 1;
    
        const loadImage = (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
          });
        };
    
        const nextImageUrl = highlights[nextIndex]?.imageUrl;
        const prevImageUrl = highlights[prevIndex]?.imageUrl;
    
        Promise.all([nextImageUrl && loadImage(nextImageUrl), prevImageUrl && loadImage(prevImageUrl)])
          .then(() => setNextImageLoaded(true))
          .catch((error) => console.error("Error preloading images", error));
      };
    
      preloadImages();
    }, [currentHighlightIndex, highlights]);
    
    

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
  const now = Date.now();
  if (isAnimating || now - lastScrollTime < scrollDebounceTime) {
    return;
  }
  setLastScrollTime(now);
  if ((deltaY < 0 && currentHighlightIndex === 0) || (deltaY > 0 && currentHighlightIndex === highlights.length - 1)) {
    return;
  }
  setIsAnimating(true);
  setShowHighlight(false); 
  const direction = deltaY > 0 ? 'forward' : 'backward';
  setAnimationDirection(direction);
  setTimeout(() => {
      if (deltaY > 0) {
          onNext();
      } else if (deltaY < 0) {
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
      transition: 'opacity 0.50s ease-in-out, transform 0.50s ease-in-out',
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