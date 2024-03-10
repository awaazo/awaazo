import { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import TranscriptPlayingBar from "./TranscriptPlayingBar";
import PodcastHelper from "../../helpers/PodcastHelper";

const ManageTranscript = ({ episodeId, podcastId }) => {
    
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



const handleTranscript = async () => {
    const request = {
        id: 0,
        seek: 0,
        start: 0,
        end: 0,
        text: "string",
        speaker: "string",
        words: [
        {
            start: 0,
            end: 0,
            word: "string",
            score: 0,
            speaker: "string"
        }
        ]
    };

    try {
        const response = await PodcastHelper.editTranscriptLines(episodeId, request);
        if (response.status === 200) {
          console.log("Updated Transcript");
        } else {
          console.error("Error editing transcript:", response.message);
        }
      } catch (error) {
        console.error("Error editing transcript:", error);
      }

  };


return (
    <>
     <Flex direction="column" alignItems={"center"} width="100%">
         <TranscriptPlayingBar episodeId={episodeId} podcastId={podcastId} />
         <Box mt={4} width="100%" alignItems={"center"}>
            <Flex justify="space-between" w="100%" alignItems="center">
              <Text fontSize="xl" fontWeight="bold" mb={1} mt={1}>
                Transcript
              </Text>
            </Flex>
          {transcript && transcript.text ? (
              <Flex align="center" justify="space-between" p={2} border="1px" borderColor="gray.200" borderRadius="md" mt={2} width="100%" bg="rgba(0, 0, 0, 0.1)">
                <Box>
                  <Text fontWeight="bold">{transcript.text}</Text>
                </Box>
              </Flex>
          ) : (
            <Text textAlign="center" mt={4}>
              This episode has no transcript yet.
            </Text>
          )}
        </Box>
        <Button variant="gradient" onClick={handleTranscript}>
        Update Transcript
      </Button>
     </Flex>
    </>
    );
};

export default ManageTranscript;
