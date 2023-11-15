import { Box, Image, Text, VStack, Flex, useBreakpointValue } from "@chakra-ui/react";
import { Episode } from "../../utilities/Interfaces";

interface CoverArtProps {
  imageUrl: Episode["coverArt"];
  description: Episode["description"];
}

const CoverArt: React.FC<CoverArtProps> = ({ imageUrl, description }) => {
  // Determine if the view is desktop based on the breakpoint
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const squareSize = useBreakpointValue({ md: '300px', lg: '400px' });
  
  return (
    <Box w="full" h="full" p="4" position="relative" overflow="hidden" rounded="2xl">
      {isDesktop ? (
        <Flex direction="row" align="flex-start">
          <Image
            src={imageUrl}
            alt="Episode Cover Art"
            w={squareSize} // Set square size based on the breakpoint
            h={squareSize} // Equal width and height for square
            objectFit="cover"
            flexShrink={0}
            borderRadius="lg"
            mr="8" // Margin right to separate from the description
          />
          <VStack
            alignItems="flex-start" // Align text to the start of the VStack
            spacing={4}
            justifyContent="center"
            maxW="full" // Use the remaining width for the description
          >
            <Text color="white" fontSize="xl" fontWeight="bold" pb="1">
              About This Episode:
            </Text>
            <Text color="white" noOfLines={[6, null, 10]} pr="4">
              {description}
            </Text>
          </VStack>
        </Flex>
      ) : (
        // Original code for mobile view
        <>
          <Image src={imageUrl} alt="Episode Cover Art" position="absolute" top={0} left={0} w="full" h="full" objectFit="cover" />
          <Box position="absolute" bottom={0} left={0} w="full" bgGradient="linear(to-t, rgba(0,0,0,0.8), rgba(0,0,0,0))" p="4" zIndex={2}>
            <VStack alignItems="start" spacing={4} justifyContent="center" py="8">
              <Text color="white" fontSize="xl" fontWeight="bold" pb="1">
                About This Episode:
              </Text>
              <Text color="white" maxW="100%" noOfLines={6}>
                {description}
              </Text>
            </VStack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CoverArt;
