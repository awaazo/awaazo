import { Box, Text, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import { IoMicOutline } from "react-icons/io5";

type TranscriptProps = {
  timestamp: number;
  text: string;
};

const formatTimestamp = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const Transcripts: React.FC<TranscriptProps> = ({ timestamp, text }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const iconSize = useBreakpointValue({ base: "16px", md: "24px" });

  return (
    <Box
      p={4}
      borderRadius="2xl"
      boxShadow="xl"
      backdropBlur="4px"
      bg="rgba(255, 255, 255, 0.01)"
      width="100%"
      minH="100%"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Icon as={IoMicOutline} boxSize={iconSize} mr={2} />
          <Text fontWeight="bold" fontSize={fontSize}>Joe Rogan</Text>
        </Flex>
        <Text color="gray.500">{formatTimestamp(timestamp)}</Text>
      </Flex>

      <Text mt={2} opacity="0.9">
        {text}
      </Text>
    </Box>
  );
};

export default Transcripts;
