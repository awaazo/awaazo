import {
  Box,
  Flex,
  Image,
  Text,
  IconButton,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { Episode } from "../../utilities/Interfaces";
import LikeComponent from "../social/likeComponent";
import { usePlayer } from "../../utilities/PlayerContext";
import { convertTime } from "../../utilities/commonUtils";

const PodcastTicket: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { thumbnailUrl, episodeName, podcaster, duration, likes } = episode;
  const likedColor = likes?.isLiked
    ? "red.500"
    : useColorModeValue("gray.400", "gray.600");

  const { dispatch } = usePlayer();

  // Function to handle episode click
  const handleEpisodeClick = () => {
    dispatch({ type: "PLAY_NOW_QUEUE", payload: episode });
  };

  return (
    <Flex
      p={4}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      outline={"2px solid rgba(255, 255, 255, .1)"}
      style={{ cursor: "pointer", transition: "transform 0.3s" }}
      onClick={() => handleEpisodeClick()}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* Left: Cover Art with Play Button */}
      <Box
        position="relative"
        mr={"1em"}
        boxSize={{
          base: "60px",
        }}
      >
        <Image boxSize="60px" src={thumbnailUrl} borderRadius="10%" />
        <IconButton
          aria-label="Play"
          icon={<FaPlay />}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          variant="ghost"
          size="md"
          shadow={"md"}
          _hover={{ boxShadow: "lg" }}
        />
      </Box>

      {/* Middle: Episode details */}
      <Flex direction="column" flex={1}>
        <Text fontWeight="medium">{episodeName}</Text>
        <Flex fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
          <VStack>
            <Text>
              {podcaster}
              {convertTime(duration)}
            </Text>
          </VStack>
        </Flex>
      </Flex>

      {/* Right: Like button */}
      <VStack>
        <LikeComponent
          episodeOrCommentId={episode.id}
          initialLikes={episode.likes}
        />
      </VStack>
    </Flex>
  );
};

export default PodcastTicket;
