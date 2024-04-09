import React from "react";
import { Box, Text, VStack, Flex, useBreakpointValue, Icon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SectionHelper from "../../../helpers/SectionHelper";
import { convertTime } from "../../../utilities/commonUtils";
import { LuBookCopy } from "react-icons/lu";

interface SectionsProps {
  episodeId: string;
}

const Sections: React.FC<SectionsProps> = ({ episodeId }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [sections, setSections] = useState(null);

  useEffect(() => {
    if (episodeId) {
      SectionHelper.sectionGetRequest(episodeId)
        .then((res) => {
          if (res.status === 200) {
            setSections(res.sections);
          } else {
            console.error("Error fetching section data:", res.message);
          }
        })
        .catch((error) => console.error("Error fetching section data:", error));
    }
  }, [episodeId]);

  return (
    <Box bg={"az.darkestGrey"} width="100%" height="100%" p={2} borderRadius="1.1em">
      <Flex justifyContent="flex-start" alignItems="center" m={3}>
        <Icon as={LuBookCopy} boxSize={5} />
        <Text fontSize={fontSize} fontWeight="bold" ml={2}>
          Sections
        </Text>
      </Flex>
      <VStack spacing={3} align="start" overflowY="auto" mb={4} maxH="100vh">
        {sections?.map((section, index) => (
          <Box key={index} bg="rgba(255, 255, 255, 0.02)" borderRadius="2xl" p={4} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }} w="100%">
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="white">
                {section.title}
              </Text>
              <Text color="gray.400">{convertTime(section.start)}</Text>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Sections;
