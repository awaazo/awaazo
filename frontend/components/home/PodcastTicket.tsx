import {
  Box,
  VStack,
  Image,
  Text,
  IconButton,
  useColorModeValue,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FaPlay, FaClock, FaHeart } from "react-icons/fa";
import { Episode } from "../../utilities/Interfaces";
import { usePlayer } from "../../utilities/PlayerContext";
import { convertTime } from "../../utilities/commonUtils";

const PodcastTicket: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { thumbnailUrl, episodeName, podcastName, duration, likes } = episode;
  const { dispatch } = usePlayer();

  const handleEpisodeClick = () => {
    dispatch({ type: "PLAY_NOW_QUEUE", payload: episode });
  };

  return (
    <VStack
      p={2}
      spacing={1}
      alignItems="center"
      borderRadius="26px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      boxShadow="md"
      _hover={{
        bg: useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(0, 0, 0, 0.3)"),
        boxShadow: "lg",
      }}
      transition="all 0.3s ease-in-out"
      onClick={handleEpisodeClick}
      cursor="pointer"
      role="group"
    >
      <Box
        position="relative"
        width="120px"
        height="120px"
        borderRadius="20px"
        overflow="hidden"
      >
        <Image
          src={thumbnailUrl}
          alt={episodeName}
          objectFit="cover"
          boxSize="full"
        />
        <Box position="absolute" top="0" left="0" w="full" h="full">
          <IconButton
            aria-label="Play"
            mb={2}
            icon={<FaPlay />}
            borderRadius={"15px"}
            variant="ghost"
            size="md"
            shadow="md"
            color="white"
            // bg="brand.100"
            bgGradient="linear(to-r, brand.100, brand.200)"
            position="absolute"
            bottom={-6}
            left="50%"
            transform="translateX(-50%) translateY(100%)"
            opacity={0}
            _groupHover={{
              bottom: 0,
              opacity: 1,
              transform: "translateX(-50%) translateY(0%) ",
            }}
            transition="all 0.2s ease-in-out"
          />
          <Box
            display="flex"
            alignItems="center"
            mt={2}
            // bg="brand.100"
            bgGradient="linear(to-r, brand.100, brand.200)"
            p={1}
            rounded="lg"
            position="absolute"
            top={-6}
            left="50%"
            transform="translateX(-50%)"
            opacity={0}
            _groupHover={{ top: 0, opacity: 1 }}
            transition="all 0.2s ease-in-out"
          >
            <Icon as={FaClock} color="white" mr={1} size="md" />
            <Text color="white" fontSize="small">
              {convertTime(duration)}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Bottom: Episode Info */}
      <VStack spacing={0} align="center" w="full">
        <Text
          fontWeight="bold"
          noOfLines={1}
          textAlign="left"
          data-cy={`ticket-episode-${episode.episodeName}`}
        >
          {episodeName}
        </Text>
        <Text fontSize="sm" color="gray.500" noOfLines={1} textAlign="left">
          {podcastName}
        </Text>
      </VStack>
    </VStack>
  );
};

export default PodcastTicket;
