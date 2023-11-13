import { Box, Text, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import { IoMicOutline } from "react-icons/io5";
import { TranscriptLine } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils";

interface TranscriptsProps {
  transcripts: TranscriptLine[];
}

const Transcripts: React.FC<TranscriptsProps> = ({ transcripts }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const iconSize = useBreakpointValue({ base: "16px", md: "24px" });

  const opacityLevels = [1, 0.4, 0.1];

  return (
    <Box
      p={4}
      borderRadius="2xl"
      backdropBlur="4px"
      bg="rgba(255, 255, 255, 0.01)"
      width="100%"
      minH="100%"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Flex alignItems="center">
          <Icon as={IoMicOutline} boxSize={iconSize} mr={2} />
          <Text fontWeight="bold" fontSize={fontSize}>
            {transcripts[0]?.speaker}
          </Text>
        </Flex>
        <Text color="gray.500">
          {convertTime(transcripts[0]?.timestamp)}
        </Text>
      </Flex>

      <Text>
        {transcripts.map((transcript, index) => (
          <span key={index} style={{ opacity: opacityLevels[index] || 0.1 }}>
            {transcript.text}{" "}
          </span>
        ))}
      </Text>
    </Box>
  );
};

export default Transcripts;
