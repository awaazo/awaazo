import React from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { Episode } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils";
import { LuBookCopy } from "react-icons/lu";

interface SectionsProps {
  sections: Episode["sections"];
}

const Sections: React.FC<SectionsProps> = ({ sections }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Box
      border="3px solid rgba(255, 255, 255, 0.05)"
      width="100%"
      height="100%"
      p={2}
      borderRadius="1.1em"
    >
      <Flex justifyContent="flex-start" alignItems="center" m={3}>
        <Icon as={LuBookCopy} boxSize={5} />
        <Text fontSize={fontSize} fontWeight="bold" ml={2}>
          Sections
        </Text>
      </Flex>
      <VStack spacing={3} align="start" overflowY="auto" mb={4} maxH="100vh">
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
                {section.title}
              </Text>
              <Text color="gray.400">{convertTime(section.timestamp)}</Text>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Sections;
