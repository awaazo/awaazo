import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { Episode } from "../../utilities/Interfaces";

interface CoverArtProps {
  imageUrl: Episode["thumbnailUrl"];
  description: Episode["description"];
}

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

      {/* Gradient Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        bgGradient="linear(to-b, rgba(0,0,0,0), rgba(0,0,0,0.4))"
        zIndex={1}
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
          <Text color="white" maxW="70%" noOfLines={6}>
            {description}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default CoverArt;
