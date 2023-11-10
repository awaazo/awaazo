import { useState, useEffect } from "react";
import ReviewsHelper from "../../helpers/ReviewsHelper";
import { FaTrash, FaStar, FaCheckCircle } from "react-icons/fa";
import {
  Box,
  Button,
  Text,
  IconButton,
  Icon
} from "@chakra-ui/react";
import { PodcastRatingRequest, PodcastReviewRequest } from "../../utilities/Requests";


const ReviewComponent = ({ podcastId }) => {
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
     <Box>
       {podcast && (
         <>
           {/* <Text fontSize="2xl" fontWeight="bold">{podcast.name}</Text> */}
           {/* Slider for rating */}
           <Box>
             <Box>
               <Box>
                 <Text>Review</Text>
               </Box>
               <Box>
                 <textarea
                   placeholder="Write a review..."
                   value={userReview}
                   onChange={handleReviewChange}
                 />
               </Box>
               <Box>
                 <Button onClick={() => handleReviewSubmit(userReview)}>
                   Submit
                 </Button>
                 <Button onClick={() => handleReviewDelete()}>
                   Delete
                 </Button>
               </Box>
             </Box>
           </Box>
         </>
       )}
     </Box>
   );
   };
export default ReviewComponent;
