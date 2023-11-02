import { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Icon, Tooltip } from "@chakra-ui/react";
import { FaHeart } from 'react-icons/fa';

const LikeComponent = ({ initialLikes = 0, initialIsLiked = false }: { initialLikes?: number, initialIsLiked?: boolean }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [likes, setLikes] = useState(initialLikes);
   const [isLiked, setIsLiked] = useState(initialIsLiked);

   const handleLike = () => {
       if (isLiked) {
           setLikes(prevLikes => prevLikes - 1);
           setIsLiked(false);
       } else {
           setLikes(prevLikes => prevLikes + 1);
           setIsLiked(true);
           onOpen(); // Open the modal when a new like is added
       }
   };

   const modalMessage = likes === 1 ? "1 person has liked this." : `${likes} people have liked this.`;

    return (
        <>
            <Tooltip label="Like this podcast" aria-label="Like tooltip">
                <Button 
                    p={2}  
                    leftIcon={<Icon as={FaHeart} color={isLiked ? "red.500" : "gray.500"} />} 
                    onClick={handleLike}
                >
                    {likes}
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Total Likes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {modalMessage}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default LikeComponent;
