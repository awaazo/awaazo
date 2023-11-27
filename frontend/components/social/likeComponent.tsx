import { useEffect, useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import SocialHelper from "../../helpers/SocialHelper";

// This component represents a like button for an episode or comment
const LikeComponent = ({ episodeOrCommentId, initialLikes }) => {
  // Component Values
  const [likes, setLikes] = useState(initialLikes);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likeResponse = await SocialHelper.isLiked(episodeOrCommentId);
        setIsLiked(likeResponse.isLiked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchData();
  }, [episodeOrCommentId]);

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
            console.error(
              "Error unliking episode or comment:",
              response.message,
            );
          }
        });
    } else {
      // Call likeEpisode or likeComment because the episode or comment is currently not liked
      SocialHelper.postLike(episodeOrCommentId) // This method needs to be implemented in SocialHelper
        .then((response) => {
          if (response.status === 200) {
            // Update the UI to reflect the like
            setLikes(likes + 1);
            setIsLiked(true);
          } else {
            console.error("Error liking episode or comment:", response.message);
          }
        });
    }
  };

  return (
    <>
      {/* Tooltip to display the like/unlike action */}
      <Tooltip label={isLiked ? "Unlike" : "Like"} aria-label="Like tooltip">
        {/* Button to trigger the like/unlike action */}
        <Button
            variant={"ghost"}
            p={2}
            leftIcon={
              <Icon as={FaHeart} color={isLiked ? "red.500" : "gray.500"} />
            }
            onClick={() => handleLike()}
            data-cy={`playerbar-like-button`}
          >
          {likes}
          
        </Button>
      </Tooltip>
    </>
  );
};

export default LikeComponent;
