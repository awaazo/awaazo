// This component renders the transcripts of an episode
import { Box, Text, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import { IoMicOutline } from "react-icons/io5";
import { TranscriptLine } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils";

// Define the props for the Transcripts component
interface TranscriptsProps {
  transcripts: TranscriptLine[]; // The array of transcript lines
}

// Transcripts component
const Transcripts: React.FC<TranscriptsProps> = ({ transcripts }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" }); // Font size based on breakpoint
  const iconSize = useBreakpointValue({ base: "16px", md: "24px" }); // Icon size based on breakpoint

  const opacityLevels = [1, 0.4, 0.1]; // Opacity levels for different transcript lines

  return (
    <Box
      p={4}
      borderRadius="2xl"
      backdropBlur="4px"
      bg="rgba(255, 255, 255, 0.01)"
      width="100%"
      minH="100%"
    >
      {/* Speaker and timestamp */}
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Flex alignItems="center">
          <Icon as={IoMicOutline} boxSize={iconSize} mr={2} />
          <Text fontWeight="bold" fontSize={fontSize}>
            {transcripts[0]?.speaker} {/* Display the speaker of the first transcript line */}
          </Text>
        </Flex>
        <Text color="gray.500">
          {convertTime(transcripts[0]?.timestamp)} {/* Convert and display the timestamp of the first transcript line */}
        </Text>
      </Flex>

      {/* Transcripts text */}
      <Text>
        {transcripts.map((transcript, index) => (
          <span key={index} style={{ opacity: opacityLevels[index] || 0.1 }}>
            {transcript.text}{" "} {/* Display the text of each transcript line */}
          </span>
        ))}
      </Text>
    </Box>
  );
};

export default Transcripts;
