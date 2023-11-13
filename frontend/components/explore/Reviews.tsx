import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  IconButton,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  useBreakpointValue,
  Text,
  Textarea,
  FormControl,
  Button,
  VStack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { MdEdit, MdClose, MdDelete } from "react-icons/md";
import ReviewsHelper from "../../helpers/ReviewsHelper";
import {
  PodcastRatingRequest,
  PodcastReviewRequest,
} from "../../utilities/Requests";

const Reviews = ({ podcast }) => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewCharacterCount, setReviewCharacterCount] = useState<number>(0);
  const [reviewError, setReviewError] = useState("");

  const handleAddReview = async () => {
    if (newRating == 0) {
      setReviewError("You must submit a rating");
    } else {
      setReviewError("");
      const reviewRequest: PodcastReviewRequest = {
        podcastId: podcast.id,
        review: newReviewText,
      };
      // Send the request
      const res1 = await ReviewsHelper.postPodcastReview(reviewRequest);
      console.log(res1);

      if (res1.status === 200) {
        console.log("Review: " + newReviewText);
      } else {
        // Handle error here
        setReviewError("Cannot add review");
      }

      const ratingRequest: PodcastRatingRequest = {
        podcastId: podcast.id,
        rating: newRating,
      };

      // Send the request
      const res2 = await ReviewsHelper.postPodcastRating(ratingRequest);
      if (res2.status === 200) {
        setIsAddingReview(false);
        window.location.href = window.location.href;
      } else {
        // Handle error here
        setReviewError("Cannot add rating");
      }
    }
  };

  // Ensures review text is not longer than 150 characters
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value.slice(0, 150);
    setNewReviewText(newDesc);
    setReviewCharacterCount(newDesc.length);
  };

  return (
    <VStack align="start" spacing={4} marginTop={4}>
      <Flex justify="space-between" w="100%" alignItems="center">
        {!isAddingReview && (
          <>
            <Text
              ml={3}
              style={{
                fontSize: isMobile ? "18px" : "25px",
                fontWeight: "bold",
              }}
            >
              Reviews:
            </Text>
            <Button
              onClick={() => setIsAddingReview(true)}
              style={{ borderRadius: "30px" }}
            >
              Add Your Review
            </Button>
          </>
        )}
      </Flex>
      {isAddingReview && (
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold">Add Your Review</Text>
            <IconButton
              icon={<MdClose />}
              onClick={() => setIsAddingReview(false)}
              aria-label="Cancel"
            />
          </Flex>
          <Flex direction="column" mt={4}>
            <Box ml={5}>
              {[1, 2, 3, 4, 5].map((index) => (
                <StarIcon
                  key={index}
                  color={newRating >= index ? "yellow.400" : "gray.300"}
                  cursor="pointer"
                  onClick={() => setNewRating(index)}
                />
              ))}
              {reviewError && <Text color="red.500">{reviewError}</Text>}
            </Box>
            <FormControl position="relative">
              <Textarea
                placeholder="Write your review here..."
                value={newReviewText}
                onChange={handleReviewChange}
                mt={4}
              />
              <Text
                position="absolute"
                right="8px"
                bottom="8px"
                fontSize="sm"
                color="gray.500"
              >
                {reviewCharacterCount}/150
              </Text>
            </FormControl>
            {/* Add a submit button */}
            <Button mt={4} onClick={handleAddReview}>
              Submit Review
            </Button>
          </Flex>
        </Box>
      )}
      {podcast.ratings &&
        podcast.ratings.map((rating) => (
          <Box
            key={rating.id}
            w="100%"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
          >
            <Flex justify="space-between" align="center">
              <Flex align="center">
                <Avatar
                  size="md"
                  name={rating.user.username}
                  src={rating.user.avatarUrl}
                />
                <Text ml={2}>{rating.user.username}</Text>
              </Flex>
              <Box>
                {Array.from({ length: rating.rating }, (_, index) => (
                  <StarIcon key={index} color="yellow.400" />
                ))}
              </Box>
            </Flex>
            <Flex justify="flex-start" align="center" mt={2}>
              <Text color="gray.300">{rating.review}</Text>
            </Flex>
            <Box mt={2}>
              <Text>{rating.text}</Text>
            </Box>
          </Box>
        ))}
    </VStack>
  );
};

export default Reviews;
