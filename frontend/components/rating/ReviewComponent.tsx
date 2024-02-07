import { useState, useEffect } from "react";
import ReviewsHelper from "../../helpers/ReviewsHelper";
import { FaTrash } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { PodcastReviewRequest } from "../../types/Requests";

// This component represents the review section for a podcast
const ReviewComponent = ({ podcastId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [podcast, setPodcast] = useState(null);
  const [userReview, setUserReview] = useState("");

  useEffect(() => {
    // Fetch the podcast by its ID
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

  // Handle the change in the user's review input
  const handleReviewChange = (event) => {
    setUserReview(event.target.value);
  };

  // Handle the submission of the user's review
  const handleReviewSubmit = async (review) => {
    const request: PodcastReviewRequest = {
      podcastId: podcast.id,
      review: review,
    };
    // Send the request to post the review
    const response = await ReviewsHelper.postPodcastReview(request);
  };

  // Handle the deletion of the user's review
  const handleReviewDelete = async () => {
    const response = await ReviewsHelper.deletePodcastReview(podcast.id);
    // Handle the response
  };

  return (
    <>
      <Box>
        {podcast && (
          <>
            <Box>
              <Text cursor="pointer" onClick={onOpen} color={"blue.500"}>
                Reviews
              </Text>
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
