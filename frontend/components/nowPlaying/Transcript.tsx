import React from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LuBookCopy } from "react-icons/lu";
import PodcastHelper from "../../helpers/PodcastHelper";

interface TranscriptProps {
  episodeId: string;
}

const Transcript: React.FC<TranscriptProps> = ({ episodeId }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [transcript, setTranscript] = useState(null);

  useEffect(() => {
    if (episodeId) {
      PodcastHelper.getTranscript(episodeId)
        .then((res) => {
          if (res.status === 200) {
            setTranscript(res.transcript);
          } else {
            console.error("Error fetching transcripts data:", res.message);
          }
        })
        .catch((error) => console.error("Error fetching transcripts data:", error));
    }
  }, [episodeId]);

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
          Transcript
        </Text>
      </Flex>
      <VStack spacing={3} align="start" overflowY="auto" mb={4} maxH="100vh">
          <Box
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="2xl"
            p={4}
            _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
            w="100%"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize={fontSize} color="white">
                {transcript && transcript.text ? transcript.text : 'This episode has no transcript text available.'}
              </Text>
              <Text color="gray.400">{transcript && transcript.speaker ? transcript.speaker : 'no speaker available'}</Text>
            </Flex>
          </Box>

      </VStack>
    </Box>
  );
};

export default Transcript;