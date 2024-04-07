import React, { useEffect, useState } from 'react'
import { Box, Flex, Avatar, Text, Textarea, FormControl, Button, VStack, HStack, IconButton } from '@chakra-ui/react'
import { FaCircle } from 'react-icons/fa6'
import ReviewsHelper from '../../helpers/ReviewsHelper'
import { PodcastRatingRequest, PodcastReviewRequest } from '../../types/Requests'
import AuthPrompt from '../auth/AuthPrompt'
import AuthHelper from '../../helpers/AuthHelper'
import { AwaazoA, Send } from '../../public/icons'
import { IoClose } from 'react-icons/io5'
import Rating from '../assets/RatingView'

// Component for displaying and adding reviews
const Reviews = ({ podcast, currentUserID, updatePodcastData }) => {
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newReviewText, setNewReviewText] = useState('')
  const [reviewCharacterCount, setReviewCharacterCount] = useState<number>(0)
  const [reviewError, setReviewError] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const ratingColors = ['white', 'az.blue', 'az.green', 'az.yellow', 'az.red']
  const [hoverRating, setHoverRating] = useState(null)

  const fetchAndUpdateReviews = async () => {
    try {
      const response = await ReviewsHelper.getPodcastById(podcast.id)
      if (response.status === 200 && response.podcast) {
        updatePodcastData(response.podcast)
      } else {
        // Handle errors or unexpected response
        console.error('Failed to fetch or parse reviews:', response)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleAddReview = async (event) => {
    console.log('Yo')
    event.preventDefault()
    if (newRating == 0) {
      setReviewError('You must submit a rating')
    } else {
      setReviewError('')
      const reviewRequest: PodcastReviewRequest = {
        podcastId: podcast.id,
        review: newReviewText,
      }
      // Send the request to add the review
      const res1 = await ReviewsHelper.postPodcastReview(reviewRequest)

      if (res1.status === 200) {
        fetchAndUpdateReviews()

        const updatedPodcast = { ...podcast, ratings: [...podcast.ratings, res1] }
        updatePodcastData(updatedPodcast)
        setIsAddingReview(false)
      } else {
        setReviewError('Cannot add review')
      }

      const ratingRequest: PodcastRatingRequest = {
        podcastId: podcast.id,
        rating: newRating,
      }

      // Send the request to add the rating
      const res2 = await ReviewsHelper.postPodcastRating(ratingRequest)
      if (res2.status === 200) {
        fetchAndUpdateReviews()
        setIsAddingReview(false)
      } else {
        setReviewError('Cannot add rating')
      }
    }
    await fetchAndUpdateReviews()
  }

  useEffect(() => {
    fetchAndUpdateReviews()
  }, [])

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value
    if (newDesc.length <= 150) {
      setNewReviewText(newDesc)
      setReviewCharacterCount(newDesc.length)
    }
  }

  return (
    <VStack align="start" spacing={4}>
      <Flex justify="space-between" w="100%" alignItems="center">
        {!isAddingReview && podcast.podcasterId !== currentUserID && (
          <>
            <Button
              onClick={() => {
                AuthHelper.authMeRequest().then((response) => {
                  if (response.status == 401) {
                    setShowLoginPrompt(true)
                    return
                  } else {
                    setIsAddingReview(true)
                  }
                })
              }}
              variant={'mini'}
            >
              {podcast.ratings.some((rating) => rating.user.id === currentUserID) ? 'Edit Review' : 'Add Review'}
            </Button>
          </>
        )}
      </Flex>

      {isAddingReview && (
        <Box w="100%" p={4} py={6} bg={'az.darkestGrey'} borderRadius="15px">
          <Flex direction="column" mt={0}>
            <HStack justifyContent={'space-between'} width={'full'}>
              <IconButton onClick={() => setIsAddingReview(false)} icon={<IoClose />} aria-label="Close Review" variant={'minimal'} size="lg" style={{ position: 'relative', top: '-8px' }} />
              <Flex justify="center" direction="row">
                <AwaazoA width="18px" height="18px" style={{ position: 'relative', zIndex: 2, bottom: '7px', left: '1px' }} />
                {[1, 2, 3, 4, 5].map((index) => {
                  const userRating = podcast.ratings.find((rating) => rating.user.id === currentUserID) || {}
                  const currentRating = hoverRating !== null ? hoverRating : newRating || userRating.rating || 0
                  return (
                    <Box
                      key={index}
                      as={FaCircle}
                      onClick={() => setNewRating(index)}
                      onMouseEnter={() => setHoverRating(index)}
                      onMouseLeave={() => setHoverRating(null)}
                      cursor="pointer"
                      color={currentRating >= index ? ratingColors[index - 1] : 'az.darkGrey'}
                      _hover={{ color: ratingColors[index - 1] }}
                      data-cy={`star-icon-${index}`}
                      size="10px"
                      marginLeft="2px"
                    />
                  )
                })}
              </Flex>
              <IconButton onClick={handleAddReview} icon={<Send />} aria-label="Submit Review" variant={'minimalColor'} size="lg" />
            </HStack>
            <FormControl position="relative">
              <Textarea
                placeholder="Write your review here..."
                value={newReviewText || (podcast.ratings.find((rating) => rating.user.id === currentUserID) || {}).review}
                onChange={handleReviewChange}
                mt={4}
              />
              <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                {reviewCharacterCount}/150
              </Text>
            </FormControl>
            {reviewError && (
              <Text color="red.500" textAlign="center" fontSize="sm" fontWeight="medium" mt={4}>
                {reviewError}
              </Text>
            )}
          </Flex>
        </Box>
      )}

      {podcast.ratings && podcast.ratings.length > 0 ? (
        podcast.ratings.map(
          (rating) =>
            rating &&
            rating.user && (
              <Box key={rating.id} w="100%" p={4} bg={'az.darkerGrey'} borderRadius="15px">
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    <Avatar size="md" name={rating.user.username} src={rating.user.avatarUrl} />
                    <Text ml={2}>{rating.user.username}</Text>
                  </Flex>
                  <Rating rating={rating.rating} /> {/* Use the Rating component here */}
                </Flex>
                <Flex justify="flex-start" align="center" mt={2}>
                  <Text color="gray.300">{rating.review}</Text>
                </Flex>
                <Box mt={2}>
                  <Text>{rating.text}</Text>
                </Box>
              </Box>
            )
        )
      ) : (
        <Flex justify="center" align="center" mt={8} width="100%">
          <Text>(No reviews have been posted yet)</Text>
        </Flex>
      )}

      {showLoginPrompt && <AuthPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage="You must be logged in to write a Review. Please log in or create an account." />}
    </VStack>
  )
}

export default Reviews
