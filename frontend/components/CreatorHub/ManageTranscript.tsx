import { useState, useEffect } from "react";
import { Box, Button, Flex, FormControl, Stack, Text, Textarea } from "@chakra-ui/react";
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
      <Box
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* <form onSubmit={handleCreate}> */}
          <Stack spacing={6} align={"center"}>
            {/* {createError && <Text color="red.500">{createError}</Text>} */}

            <FormControl position="relative">
              <Textarea
                id="description"
                placeholder="What's the Podcast about?"
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit convallis turpis, in dignissim dui. Phasellus maximus a dui vitae vestibulum. Nam odio dui, fringilla sit amet condimentum eget, euismod rhoncus tortor. Fusce ornare scelerisque libero. Pellentesque dictum euismod imperdiet. Maecenas tempor fermentum neque ac ultrices. Suspendisse ultricies ultrices nibh at dapibus. Nam com"
                // onChange={handleDescriptionChange}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "18px",
                }}
                resize="vertical"
              />
              <Text
                position="absolute"
                right="8px"
                bottom="8px"
                fontSize="sm"
                color="gray.500"
              >
                {/* {descriptionCharacterCount}/250 */}
              </Text>
            </FormControl>

      
            <Button
              variant="gradient"
              id="createBtn"
              type="submit"
              minWidth={"200px"}
              marginTop={"3"}
              w={"12rem"}
            >
              Start Broadcasting
            </Button>
          </Stack>
        {/* </form> */}
      </Box>
    </>
);

};

export default ManageTranscript;
