import { Box, VStack, Image, Text, IconButton, useColorModeValue, HStack, Icon } from "@chakra-ui/react";
import { FaPlay, FaClock, FaHeart } from "react-icons/fa";
import { Episode } from "../../utilities/Interfaces";
import { usePlayer } from "../../utilities/PlayerContext";
import { convertTime } from "../../utilities/commonUtils";

const PodcastTicket: React.FC<{ episode: Episode }> = ({ episode }) => {
  const { thumbnailUrl, episodeName, podcaster, duration, likes } = episode;
  const { dispatch } = usePlayer();

  const handleEpisodeClick = () => {
    dispatch({ type: "PLAY_NOW_QUEUE", payload: episode });
  };

  const bg = useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)");
  const hoverBg = useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(0, 0, 0, 0.3)");

  return (
    <VStack
      p={3}
      spacing={2}
      alignItems="center"
      borderRadius="15px"
      bg={bg}
      backdropFilter="blur(10px)"
      boxShadow="md"
      _hover={{
        bg: hoverBg,
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
        borderRadius="md"
        overflow="hidden"
      >
        <Image src={thumbnailUrl} alt={episodeName} objectFit="cover" boxSize="full" />
        <Box position="absolute" top="0" left="0" w="full" h="full">
          <IconButton
            aria-label="Play"
            mb={2}
            icon={<FaPlay />}
            variant="ghost"
            size="md"
            isRound={true}
            shadow="md"
            color="white"
            bg="brand.100"
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
            transition="all 0.3s ease-in-out"
          />
          <Box
            display="flex"
            alignItems="center"
            mt={2}
            
            bg="brand.100"
            p={1}
            rounded="lg"
            position="absolute"
            top={-6}
            left="50%"
            transform="translateX(-50%)"
            opacity={0}
            _groupHover={{ top: 0, opacity: 1 }}
            transition="all 0.3s ease-in-out"
          >
            <Icon as={FaClock} color="white" mr={1} size="md" />
            <Text color="white" fontSize="small">
              {convertTime(duration)}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Bottom: Episode Info */}
      <VStack spacing={0} align="stretch" w="full">
        <Text fontWeight="bold" noOfLines={1} textAlign="left">
          {episodeName}
        </Text>
        <Text fontSize="sm" color="gray.500" noOfLines={1} textAlign="left">
          {podcaster}vv
        </Text>
       
      </VStack>
    </VStack>
  );
};

export default PodcastTicket;
