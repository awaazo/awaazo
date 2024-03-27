import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Button } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import HighlightTicket from './HighlightTicket';

const FullScreenHighlight = ({ highlights, episodes, currentHighlightIndex, onClose, onNext, onPrevious }) => {
    const currentHighlight = highlights[currentHighlightIndex];
    // Find the corresponding episode for the current highlight
    const correspondingEpisode = episodes.find(episode => episode.id === currentHighlight.episodeId);

    // Ensure you handle the case where correspondingEpisode might be undefined
    if (!correspondingEpisode) {
        // Handle error or fallback scenario
        console.error("No corresponding episode found for the current highlight.");
        return null; // or some error/fallback component
    }

    return (
      <Modal isOpen={true} onClose={onClose} size="full" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <HighlightTicket 
                        highlight={currentHighlight} // Pass the current highlight object
                        episode={correspondingEpisode} // Pass the found corresponding episode
                        thumbnailUrl={correspondingEpisode.thumbnailUrl} onOpenFullScreen={undefined}                // Remove the onOpenFullScreen prop if it's not used in this context
            />
            <Button onClick={onPrevious} leftIcon={<FaArrowLeft />} position="absolute" top="50%" left="0">Previous</Button>
            <Button onClick={onNext} rightIcon={<FaArrowRight />} position="absolute" top="50%" right="0">Next</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
};

export default FullScreenHighlight;