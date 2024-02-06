import { useEffect, useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import SocialHelper from "../../helpers/SocialHelper";
import LoginPrompt from "../auth/AuthPrompt";

const Likes = ({ episodeOrCommentId, initialLikes, showCount }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

  const handleLike = async () => {
    try {
      const response = isLiked
        ? await SocialHelper.deleteEpisodeLike(episodeOrCommentId)
        : await SocialHelper.postLike(episodeOrCommentId);

      if (response.status === 200) {
        setLikes(isLiked ? likes - 1 : likes + 1);
        setIsLiked(!isLiked);
      }else if (response.status === 401) {
        setShowLoginPrompt(true);
      } 
      else {
        console.error(`Error ${isLiked ? "unliking" : "liking"}:`, response.message);
      }
    } catch (error) {
      console.error(`Error ${isLiked ? "unliking" : "liking"}:`, error);
    }
  };

  return (
    <>
    <Tooltip label={isLiked ? "Unlike" : "Like"} aria-label="Like tooltip">
      <Button
        variant="ghost"
        p={2}
        onClick={handleLike}
        data-cy="like-button-index:"
        leftIcon={showCount ? <Icon as={FaHeart} color={isLiked ? "brand.100" : "white"} /> : null}
      >
        {showCount ? likes : <Icon as={FaHeart} color={isLiked ? "brand.100" : "white"} />}
      </Button>
    </Tooltip>
    {showLoginPrompt && (
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        infoMessage="To like an Episode, you must be logged in. Please log in or create an account."
      />
    )}
    </>
  );
};

export default Likes;
