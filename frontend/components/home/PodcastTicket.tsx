import {
  Box,
  Flex,
  Image,
  Text,
  IconButton,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FaPlay, FaHeart } from "react-icons/fa";
import { Episode } from "../../utilities/Interfaces";

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const remainingSeconds = seconds - hours * 3600 - minutes * 60;

  const hoursString = hours > 0 ? String(hours) : "";
  const minutesString = String(minutes).padStart(2, "0");
  const formattedDuration = `${hoursString}${
    hours > 0 ? "h " : ""
  }${minutesString}m`;
  return formattedDuration.trim();
};

const PodcastTicket: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { coverArt, episodeName, podcaster, duration, likes } = episode;
  const likedColor = likes?.isLiked
    ? "red.500"
    : useColorModeValue("gray.400", "gray.600");

  return (
    <Flex
      p={4}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.3s"
    >
      {/* Left: Cover Art with Play Button */}
      <Box
        position="relative"
        mr={"1em"}
        boxSize={{
          base: "60px",
        }}
      >
        <Image boxSize="60px" src={coverArt} borderRadius="10%" />
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
              <Text>{formatDuration(duration)}</Text>
            </Text>
          </VStack>
        </Flex>
      </Flex>

      {/* Right: Like button */}
      <VStack>
        <IconButton
          aria-label="Like"
          icon={<FaHeart />}
          variant="ghost"
          color={likedColor}
          size="md"
          _hover={{
            color: "red.500",
          }}
        />
        <Text marginTop={"-1em"} fontSize={"0.8em"} fontWeight={"Bold"}>
          {likes?.count >= 1000
            ? `${(likes?.count / 1000).toFixed(1)}k`
            : likes?.count}
        </Text>
      </VStack>
    </Flex>
  );
};

export default PodcastTicket;
