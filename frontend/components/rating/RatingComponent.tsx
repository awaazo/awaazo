import { useState, useEffect } from 'react';
import ReviewsHelper from '../../helpers/ReviewsHelper';
import { FaTrash, FaStar, FaCheckCircle } from 'react-icons/fa';
import { Box, Button, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { PodcastRatingRequest } from '../../utilities/Requests';

const RatingComponent = ({ podcastId }) => {
  const [podcast, setPodcast] = useState(null);
  const [userRating, setUserRating] = useState(0);

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

  const handleRatingChange = (value) => {
   setUserRating(value);
 };
  const handleRatingSubmit = async (rating) => {
    const request: PodcastRatingRequest = {
        podcastId: podcast.id,
        rating: rating
      };
      // Send the request
      const response = await ReviewsHelper.postPodcastRating(request);
        
  };

  const handleRatingDelete = async () => {
    const response = await ReviewsHelper.deletePodcastRating(podcast.id);
    // Handle response
  };


  return (
   <Box>
     {podcast && (
       <>
         {/* <Text fontSize="2xl" fontWeight="bold">{podcast.name}</Text> */}
         {/* Slider for rating */}
         <Slider
           defaultValue={0}
           min={0}
           max={5}
           step={1}
           onChange={handleRatingChange}
           mb={4}
         >
           <SliderTrack>
             <SliderFilledTrack />
           </SliderTrack>
           <SliderThumb boxSize={6}>
             <Box color="yellow.400" as={FaStar} />
           </SliderThumb>
         </Slider>
         <Button m={1} colorScheme="blue" onClick={() => handleRatingSubmit(userRating)}><Box as={FaCheckCircle} /></Button>
         <Button colorScheme="red" onClick={() => handleRatingDelete()} ml={2}>
           <Box as={FaTrash} />
         </Button>
       </>
     )}
   </Box>
 );
};
export default RatingComponent;