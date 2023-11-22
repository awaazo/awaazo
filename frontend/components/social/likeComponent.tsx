import { useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import SocialHelper from "../../helpers/SocialHelper";

// This component represents a like button for an episode or comment
const LikeComponent = ({
  episodeOrCommentId, // The ID of the episode or comment to like/unlike
  initialLikes, // The initial number of likes
  initialIsLiked, // Whether the episode or comment is initially liked
}) => {
  const [likes, setLikes] = useState(initialLikes); // State to track the number of likes
  const [isLiked, setIsLiked] = useState(initialIsLiked); // State to track whether the episode or comment is liked

  // Function to handle the like/unlike action
  const handleLike = () => {
    // Toggle the like status based on whether the episode or comment is currently liked
    if (isLiked) {
      // Call unlikeEpisode or unlikeComment because the episode or comment is currently liked
      SocialHelper.deleteEpisodeLike(episodeOrCommentId) // This method needs to be implemented in SocialHelper
        .then((response) => {
          if (response.status === 200) {
            // Update the UI to reflect the unlike
            setLikes(likes - 1);
            setIsLiked(false);
          } else {
            console.error("Error unliking episode or comment:", response.message);
          }
        })
        .catch((error) => {
          console.error("Exception when calling unlikeEpisode or unlikeComment:", error.message);
        });
    } else {
      // Call likeEpisode or likeComment because the episode or comment is currently not liked
      SocialHelper.postEpisodeLike(episodeOrCommentId) // This method needs to be implemented in SocialHelper
        .then((response) => {
          if (response.status === 200) {
            // Update the UI to reflect the like
            setLikes(likes + 1);
            setIsLiked(true);
          } else {
            console.error("Error liking episode or comment:", response.message);
          }
        })
        .catch((error) => {
          console.error("Exception when calling likeEpisode or likeComment:", error.message);
        });
    }
  };

  return (
    <>
      {/* Tooltip to display the like/unlike action */}
      <Tooltip
        label={isLiked ? "Unlike this episode or comment" : "Like this episode or comment"}
        aria-label="Like tooltip"
      >
        {/* Button to trigger the like/unlike action */}
        <Button
          p={2}
          leftIcon={
            <Icon as={FaHeart} color={isLiked ? "red.500" : "gray.500"} />
          }
          onClick={() => handleLike()}
        >
          {likes} {/* Display the number of likes */}
        </Button>
      </Tooltip>
    </>
  );
};

export default LikeComponent;
