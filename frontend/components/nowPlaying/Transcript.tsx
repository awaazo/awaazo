import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { LuBookCopy } from "react-icons/lu";
import PodcastHelper from "../../helpers/PodcastHelper";
import { usePlayer } from '../../utilities/PlayerContext';

interface TranscriptProps {
  episodeId: string;
}


const Transcript: React.FC<TranscriptProps> = ({ episodeId }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [transcript, setTranscript] = useState(null);
  const [visibleWords, setVisibleWords] = useState([]);
  const { state, dispatch, audioRef } = usePlayer();
  const transcriptBoxRef = useRef(null);

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

  useEffect(() => {
    const updateVisibleWords = () => {
      if (transcript.text && audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        let wordsToShow = [];
        // Iterate through each segment of the transcript
        transcript.forEach(segment => {
          // For each segment, check if the current time is past the segment's start time
          if (currentTime >= segment.start) {
            // For each word in the segment, add it if the current time is past the word's start time
            segment.words.forEach(word => {
              if (currentTime >= word.start) {
                wordsToShow.push(word);
              }
            });
          }
        });
        // Update the state to show all words up to the current time
        setVisibleWords(wordsToShow);
      }
    };

    const interval = setInterval(updateVisibleWords, 10); // Update visible words every 500ms

    return () => {
      clearInterval(interval);
      setVisibleWords([]);
    }
  }, [transcript, audioRef]);

  //scrollbar follows down as the text progresses
  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [visibleWords]); // Depend on visibleWords to trigger the scroll

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
      <Box 
        overflowY="auto" 
        mb={4} maxH="15vh" 
        p={3} 
        ref={transcriptBoxRef}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar for Chrome, Safari, and newer Edge
          },
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          '-ms-overflow-style': 'none',  // Hide scrollbar for IE 10+
          pointerEvents: 'none', // Disable pointer events so that user can't scroll up
        }}
      >
        {transcript && visibleWords.length > 0 ? (
        <Text className="transcript-text" fontSize={fontSize} color="white">
    {visibleWords.map((word, index) => (
      <span
        key={index}
        className="text-appear"
      >
        {word.word}{' '}
      </span>
    ))}
    </Text>
        ):(
          <Text fontSize={fontSize} color="white">
          No transcript available.
        </Text>
      )}
      </Box>
    </Box>
  );
};

export default Transcript;
