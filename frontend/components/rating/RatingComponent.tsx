import { useState, useEffect } from 'react';
import axios from 'axios';
import EndpointHelper from '../../helpers/EndpointHelper';
import { PodcastRatingRequest, PodcastRatingDeleteRequest } from '../../utilities/Requests';
import { PodcastRatingResponse } from '../../utilities/Responses';
import StarRatingComponent from 'react-star-rating-component'; // This is a hypothetical star rating component library

const RatingComponent = ({ podcastId }) => {
    const [rating, setRating] = useState(0);
    const [podcastRatings, setPodcastRatings] = useState([]);

    

 

    useEffect(() => {
      const fetchRatings = async () => {
          try {
              const response = await axios.get<PodcastRatingResponse>(EndpointHelper.getPodcastEndpoint());
              // Assuming `podcastRating` is the object that contains the ratings array and the average rating.
              const podcastRating = response.data.podcastRating;
  
              // Set the array of ratings.
              // Ensure that `podcastRating.ratings` is indeed an array. The type definition should match this.
              setPodcastRatings(podcastRating.ratings || []);
  
              // Set the average rating.
              // Here we ensure we're updating the average rating state, which should be a number.
              setRating(podcastRating.averageRating || 0);
          } catch (error) {
              console.error('Error fetching podcast ratings', error);
          }
      };
  
      fetchRatings();
  }, [podcastId]);
  
  
  
    // Post a new rating
    const postRating = async newRating => {
        try {
            const requestData: PodcastRatingRequest = {
                podcastId,
                rating: newRating
            };
            await axios.post(EndpointHelper.getPodcastRatingEndpoint(), requestData);
            setRating(newRating); // Update the rating locally
        } catch (error) {
            console.error('Error posting podcast rating', error);
        }
    };

    // Delete a rating
    const deleteRating = async () => {
        try {
            const requestData: PodcastRatingDeleteRequest = {
                podcastId
            };
            await axios.delete(EndpointHelper.getPodcastRatingDeleteEndpoint(), { data: requestData });
            setRating(0); // Reset the rating locally
        } catch (error) {
            console.error('Error deleting podcast rating', error);
        }
    };

    // Handle star click
    const onStarClick = nextValue => {
        postRating(nextValue);
    };

    return (
        <div>
            <h2>Rate this Podcast</h2>
            <StarRatingComponent 
                name="podcastRating"
                starCount={5}
                value={rating}
                onStarClick={onStarClick}
            />
            <button onClick={deleteRating}>Remove My Rating</button>
        </div>
    );
};

export default RatingComponent;
