import {
  Box,
  Flex,
  IconButton,
  Tag,
  useColorModeValue,
  useColorMode,
  useBreakpointValue,
  Text,
  Image,
} from "@chakra-ui/react";

import { FaPlay } from "react-icons/fa";
import { usePlayer } from "../../utilities/PlayerContext";
import LikeComponent from "../social/likeComponent";
import CommentComponent from "../social/commentComponent";

// Component to display an episode
const Episode = ({ episode }) => {
  const { dispatch } = usePlayer();

  // Handle click on episode
  const handleEpisodeClick = () => {
    dispatch({ type: "SET_EPISODE", payload: episode });
  };

  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Format duration in minutes and seconds
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Flex
      className="hoverEffect"
      paddingTop={5}
      paddingBottom={5}
      mt={3}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      style={{ cursor: "pointer", transition: "transform 0.3s" }}
      onClick={() => handleEpisodeClick()}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <Box position="relative" mr={5}>
        <Image
          boxSize={isMobile ? "0px" : "125px"}
          src={episode.thumbnailUrl}
          borderRadius="10%"
          marginLeft={isMobile ? "0px" : "20px"}
          mt={1}
        />
        {!isMobile && (
          <IconButton
            aria-label="Play"
            icon={<FaPlay />}
            position="absolute"
            left="60%"
            top="50%"
            transform="translate(-50%, -50%)"
            variant="ghost"
            fontSize="25px"
            shadow={"md"}
            _hover={{ boxShadow: "lg" }}
          />
        )}
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {episode.episodeName}
          {episode.isExplicit && (
            <Tag
              size="sm"
              colorScheme="red"
              fontSize={isMobile ? "10px" : "sm"}
            >
              Explicit
            </Tag>
          )}
          <Text fontSize={isMobile ? "md" : "md"}>🎧 {episode.playCount}</Text>
        </Text>
        {/* Episode Details */}
        <Flex
          direction="column"
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
        >
          {isMobile ? null : <Text>{episode.description}</Text>}

          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {formatDuration(episode.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex alignItems="flex-start" style={{ marginRight: "15px" }} data-cy={`comments-on-${episode.episodeName}-${episode.comments.length}`}>
        <CommentComponent
          episodeIdOrCommentId={episode.id}
          initialComments={episode.comments.length}
        />
        <div style={{ marginTop: "4px", marginLeft: "4px" }} data-cy={`likes-on-${episode.episodeName}-${episode.likes}`}>
          <LikeComponent
            episodeOrCommentId={episode.id}
            initialLikes={episode.likes}
          />
        </div>
      </Flex>
    </Flex>
  );
};

export default Episode;
