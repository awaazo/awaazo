import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { Episode } from "../../utilities/Interfaces";

// Define the props for the CoverArt component
interface CoverArtProps {
  imageUrl: Episode["thumbnailUrl"]; // The URL of the episode's thumbnail image
  description: Episode["description"]; // The description of the episode
}

// Define the CoverArt component
const CoverArt: React.FC<CoverArtProps> = ({ imageUrl, description }) => {
  return (
    <Box
      w="full"
      h="full"
      p="4"
      position="relative"
      overflow="hidden"
      rounded="2xl"
    >
      <Image
        src={imageUrl}
        alt="Episode Cover Art"
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        objectFit="cover"
      />

      <Box
        position="absolute"
        bottom={0}
        left={0}
        w="full"
        bgGradient="linear(to-t, rgba(0,0,0,0.8), rgba(0,0,0,0))"
        p="4"
        zIndex={2}
      >
        <VStack alignItems="start" spacing={4} justifyContent="center" py="8">
          <Text color="white" fontSize="xl" fontWeight="bold" pb="1">
            About This Episode:
          </Text>
          <Text color="white" maxW="100%" noOfLines={6}>
            {description}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default CoverArt;
