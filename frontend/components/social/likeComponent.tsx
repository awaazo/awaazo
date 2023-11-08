import { useState } from 'react';
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { FaHeart } from 'react-icons/fa';
import SocialHelper from '../../helpers/SocialHelper';

const LikeComponent = ({ episodeId, initialLikes = 0, initialIsLiked = false }) => {
   const [likes, setLikes] = useState(initialLikes);
   const [isLiked, setIsLiked] = useState(initialIsLiked);

   const handleLike = (episodeOrCommentId) => {
    // Toggle the like status based on whether the episode is currently liked
    if (isLiked) {
      // Call unlikeEpisode because the episode is currently liked
      SocialHelper.unlikeComment(episodeOrCommentId) // This method needs to be implemented in SocialHelper
        .then(response => {
          if (response.status === 200) {
            // Update the UI to reflect the unlike
            setLikes(likes - 1);
            setIsLiked(false);
          } else {
            console.error("Error unliking episode:", response.message);
          }
        })
        .catch(error => {
          console.error("Exception when calling unlikeEpisode:", error.message);
        });
    } else {
      // Call likeEpisode because the episode is currently not liked
      SocialHelper.likeComment(episodeOrCommentId) // This method needs to be implemented in SocialHelper
        .then(response => {
          if (response.status === 200) {
            // Update the UI to reflect the like
            setLikes(likes + 1);
            setIsLiked(true);
          } else {
            console.error("Error liking episode:", response.message);
          }
        })
        .catch(error => {
          console.error("Exception when calling likeEpisode:", error.message);
        });
    }
  };

    return (
        <>
            <Tooltip label={isLiked ? "Unlike this episode" : "Like this episode"} aria-label="Like tooltip">
                <Button 
                    p={2}  
                    leftIcon={<Icon as={FaHeart} color={isLiked ? "red.500" : "gray.500"} />} 
                    onClick={handleLike}
                >
                    {likes}
                </Button>
            </Tooltip>
        </>
    );
};

export default LikeComponent;
