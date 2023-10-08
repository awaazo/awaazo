import { Box, Flex, Image, Text, IconButton, Badge, useColorModeValue } from "@chakra-ui/react";
import { FaPlay, FaHeart, FaCommentAlt } from "react-icons/fa";
import { Podcast } from "../../utilities/Types";

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const remainingSeconds = seconds - hours * 3600 - minutes * 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const PodcastTicket: React.FC<Podcast> = ({ coverArt, episodeName, podcaster, duration, likes, comments }) => {
  const likedColor = likes.isLiked ? "red.500" : useColorModeValue("gray.900", "gray.100");
  const commentedColor = comments.isCommented ? "blue.500" : useColorModeValue("gray.900", "gray.100");
  return (
    <Flex p={2} width="100%" flex="1" borderRadius="25px" backdropFilter="blur(35px)" boxShadow="sm">
      {/* Left: Cover Art with Play Button */}
      <Box position="relative" mr={4}>
        <Image boxSize="60px" src={coverArt} borderRadius="20%" />
        <IconButton aria-label="Play" icon={<FaPlay />} position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" variant="ghost" />
      </Box>

      {/* Middle: Episode details */}
      <Flex direction="column" flex={1}>
        <Text fontWeight="bold">{episodeName}</Text>
        <Text fontSize="sm" color="gray.500">
          {podcaster} | {formatDuration(duration)}
        </Text>
      </Flex>

      {/* Right: Like and Comment buttons */}
      <Flex alignItems="center">
        <Box position="relative" mr={3}>
          <IconButton aria-label="Like" icon={<FaHeart />} variant="ghost" color={likedColor} />
          <Badge position="absolute" top="0" right="0" variant="solid" colorScheme="red" borderRadius="100%">
            {likes.count}
          </Badge>
        </Box>

        <Box position="relative">
          <IconButton aria-label="Comment" icon={<FaCommentAlt />} variant="ghost" color={commentedColor} />
          <Badge position="absolute" top="0" right="0" variant="solid" colorScheme="blue" borderRadius="100%">
            {comments.count}
          </Badge>
        </Box>
      </Flex>
    </Flex>
  );
};

export default PodcastTicket;
