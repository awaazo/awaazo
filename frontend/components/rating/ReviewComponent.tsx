import { useState, useEffect } from "react";
import ReviewsHelper from "../../helpers/ReviewsHelper";
import { FaTrash, FaStar, FaCheckCircle } from "react-icons/fa";
import { FaComments, FaClock, FaPaperPlane, FaHeart, FaReply } from 'react-icons/fa';
import {
  Box,
  Button,
  Text,
  IconButton,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  VStack,
  useDisclosure,
  Avatar,
  HStack,
  Flex,
  Tooltip,
  Input,
  Spacer

} from "@chakra-ui/react";
import { PodcastRatingRequest, PodcastReviewRequest } from "../../utilities/Requests";


const ReviewComponent = ({ podcastId }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [podcast, setPodcast] = useState(null);
   const [userReview, setUserReview] = useState("");

   useEffect(() => {
     const fetchPodcast = async () => {
       const response = await ReviewsHelper.getPodcastById(podcastId);
       if (response.status === 200) {
         setPodcast(response.podcast);
       } else {
         // Handle error
         console.error(response.message);
       }
     };

     fetchPodcast();
   }, [podcastId]);

   const handleReviewChange = (event) => {
     setUserReview(event.target.value);
   };

   const handleReviewSubmit = async (review) => {
     const request: PodcastReviewRequest = {
       podcastId: podcast.id,
       review: review,
     };
     // Send the request
     const response = await ReviewsHelper.postPodcastReview(request);
   };

   const handleReviewDelete = async () => {
     const response = await ReviewsHelper.deletePodcastReview(podcast.id);
     // Handle response
   };

   return (
    <>
      <Box>
        {podcast && (
          <>
            <Box>
              <Text cursor="pointer" onClick={onOpen} color={"blue.500"}>Reviews</Text>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader ml={5}>Add a Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Textarea
                    placeholder="Write a review..."
                    value={userReview}
                    onChange={handleReviewChange}
                    mb={3}
                  />
                  <Button mr={2} onClick={() => handleReviewSubmit(userReview)}>
                    <FaPaperPlane />
                  </Button>
                  <Button onClick={() => handleReviewDelete()}>
                    <FaTrash />
                  </Button>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Box>
    </>
  );
};

export default ReviewComponent;
