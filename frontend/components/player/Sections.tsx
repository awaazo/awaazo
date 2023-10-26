import React from "react";
import { Box, Text, VStack, Flex, useBreakpointValue } from "@chakra-ui/react";
import { Episode } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils";

interface SectionsProps {
  sections: Episode["sections"];
}

const Sections: React.FC<SectionsProps> = ({ sections }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Box p={4} borderRadius="2xl" boxShadow="xl" backdropBlur="4px" bg="rgba(255, 255, 255, 0.01)" width="100%" minH="100%">
      <Text fontSize={fontSize} fontWeight="bold" mb={4}>  {/* added margin bottom */}
        Sections
      </Text>
      <VStack spacing={3} align="start">
        {sections?.map((section, index) => (
          <Box 
            key={index} 
            bg="rgba(255, 255, 255, 0.02)" 
            borderRadius="2xl"
            p={4}
            _hover={{ bg: "rgba(255, 255, 255, 0.05)" }} 
            w="100%"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="white">
                {section.sectionName}
              </Text>
              <Text color="gray.400">
                {convertTime(section.startTime)}
              </Text>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Sections;
