import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  useColorMode,
  useBreakpointValue,
  Text,
  Textarea,
  FormControl,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import ReviewsHelper from "../../helpers/ReviewsHelper";
import {
  PodcastRatingRequest,
  PodcastReviewRequest,
} from "../../types/Requests";
import LoginPrompt from "../auth/AuthPrompt";
import AuthHelper from "../../helpers/AuthHelper";

// Component for displaying and adding reviews
const Reviews = ({ podcast , currentUserID, updatePodcastData }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewCharacterCount, setReviewCharacterCount] = useState<number>(0);
  const [reviewError, setReviewError] = useState("");
  const [reviews, setReviews] = useState(podcast.ratings);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const fetchAndUpdateReviews = async () => {
    try {
      const response = await ReviewsHelper.getPodcastById(podcast.id);
      if (response.status === 200 && response.podcast) {
        updatePodcastData(response.podcast);
      } else {
        // Handle errors or unexpected response
        console.error("Failed to fetch or parse reviews:", response);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  // Function to handle adding a review
  const handleAddReview = async (event) => {
    console.log("Yo");
    event.preventDefault();
    if (newRating == 0) {
      setReviewError("You must submit a rating");
    } else {
      setReviewError("");
      const reviewRequest: PodcastReviewRequest = {
        podcastId: podcast.id,
        review: newReviewText,
      };
      // Send the request to add the review
      const res1 = await ReviewsHelper.postPodcastReview(reviewRequest);

      if (res1.status === 200) {
        fetchAndUpdateReviews();
     
      const updatedPodcast = { ...podcast, ratings: [...podcast.ratings, res1] };
      updatePodcastData(updatedPodcast);
        setIsAddingReview(false);
      } else {
        setReviewError("Cannot add review");
      }

      const ratingRequest: PodcastRatingRequest = {
        podcastId: podcast.id,
        rating: newRating,
      };

      // Send the request to add the rating
      const res2 = await ReviewsHelper.postPodcastRating(ratingRequest);
      if (res2.status === 200) {
        fetchAndUpdateReviews();
        setIsAddingReview(false);
      } else {
        setReviewError("Cannot add rating");
      }
    }
    await fetchAndUpdateReviews();
  };

  useEffect(() => {
    fetchAndUpdateReviews();
  }, []);

  //  handle changes in the review text
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value.slice(0, 150);
    setNewReviewText(newDesc);
    setReviewCharacterCount(newDesc.length);
  };

  return (
    <VStack align="start" spacing={4} marginTop={4}>
      <Flex justify="space-between" w="100%" alignItems="center">
        {!isAddingReview && podcast.podcasterId !== currentUserID && (
          <>
            <Text
              ml={3}
              style={{
                fontSize: isMobile ? "18px" : "25px",
                fontWeight: "bold",
              }}
            >
              Reviews
            </Text>
            <Button
               onClick={() => {
                AuthHelper.authMeRequest().then((response) => {
                  if(response.status == 401){
                    //Not logged in, prompt user to sign in.
                    setShowLoginPrompt(true);
                    return;
                  } else{
                    setIsAddingReview(true);
                  }
                });
              }}
            borderRadius = "30px" 
            >
              Add Your Review
            </Button>
          </>
        )}
      </Flex>
      {isAddingReview && (
        <Box w="100%" p={4} borderWidth="1px" borderRadius="1.2em">
          <Flex direction="column" mt={0}>
            <Flex justify="center">
              {[1, 2, 3, 4, 5].map((index) => (
                <StarIcon
                  key={index}
                  color={newRating >= index ? "yellow.400" : "gray.300"}
                  cursor="pointer"
                  onClick={() => setNewRating(index)}
                  boxSize={5}
                  margin={2}
                  data-cy={`star-icon-${index}`}
                />
              ))}
              {reviewError && <Text color="red.500">{reviewError}</Text>}
            </Flex>
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
            <HStack justifyContent="space-between" mt={"5"}>
              {/* Add a submit button */}
              <Button
                onClick={handleAddReview}
                width="50%"
                borderRadius="7px"
                colorScheme="blue"
              >
                Submit Review
              </Button>
              <Button
                onClick={() => setIsAddingReview(false)}
                width="50%"
                borderRadius="7px"
                colorScheme="red"
              >
                Cancel
              </Button>
            </HStack>
          </Flex>
        </Box>
      )}
      {podcast.ratings && podcast.ratings.length > 0 ? (
        podcast.ratings.map((rating) => (
          rating && rating.user && (
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
          )
        ))
      ) : (
        <Flex justify="center" align="center" mt={8} width="100%">
          <Text>(No reviews have been posted yet)</Text>
        </Flex>
      )} {showLoginPrompt && (
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="You must be logged in to write a Review. Please log in or create an account."
        />
      )}
    </VStack>
  );
};

export default Reviews;
