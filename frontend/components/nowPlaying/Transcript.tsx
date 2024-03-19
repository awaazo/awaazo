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
import { Transcript } from "../../types/Interfaces";

interface TranscriptProps {
  episodeId: string;
}


const TranscriptComp: React.FC<TranscriptProps> = ({ episodeId }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [transcription, setTranscript] = useState<Transcript>();
  const [transcriptLines, setTranscriptLines] = useState([]); 
  const [visibleWords, setVisibleWords] = useState([]);
  const { state, dispatch, audioRef } = usePlayer();
  const [nextSeekTime, setNextSeekTime] = useState(0); // Time to seek to when clicking on a word
  const [minSeekTime, setMinSeekTime] = useState(0); // Time to seek to when clicking on a word
  const transcriptBoxRef = useRef(null);
  var seeking = false;

  useEffect(() => {
    if (episodeId) {
      PodcastHelper.getTranscript(episodeId, 0)
        .then((res) => {
          if (res.status === 200) {

            setTranscript(res.transcript);
            setTranscriptLines(res.transcript.lines);

            setNextSeekTime(res.transcript.lines.map((line) => line.seek).reduce((a, b) => Math.max(a, b)));
            setMinSeekTime(Math.min(res.transcript.lines.map((line) => line.seek).reduce((a, b) => Math.min(a, b)),0));

    
          } else {
            console.error("Error fetching transcripts data:", res.message);
          }
        })
        .catch((error) => console.error("Error fetching transcripts data:", error));
    }
  }, [episodeId]);

  useEffect(() => {
    const updateVisibleWords = () => {

      // If there is a transcript and the audio is playing, update the visible words
      if (transcription && audioRef.current) {
        
        // Re-fetch the transcript if the audio has seeked to a new time
        if (!seeking && (audioRef.current.currentTime > nextSeekTime || audioRef.current.currentTime < minSeekTime)) {
          
          // Set seeking to true before fetching the new transcript
          seeking = true;
          PodcastHelper.getTranscript(episodeId, audioRef.current.currentTime-5)
            .then((res) => {
              if (res.status === 200) {

                // Set the new transcript
                setTranscript(res.transcript);
                
                // Set the new transcript lines
                setTranscriptLines(res.transcript.lines);
                
                // Set the next seek time to the maximum seek time in the new transcript
                setNextSeekTime(res.transcript.lines.map((line) => line.seek).reduce((a, b) => Math.max(a, b)));
                setMinSeekTime(res.transcript.lines.map((line) => line.seek).reduce((a, b) => Math.min(a, b)));

                // Set seeking to false after fetching the new transcript
                seeking = false;

              } else {
                console.error("Error fetching transcripts data:", res.message);
              }
            })
            .catch((error) => console.error("Error fetching transcripts data:", error));

        }

        if (transcriptLines.length > 0) {

          const currentTime = audioRef.current.currentTime;
          let wordsToShow = [];
          // Iterate through each segment of the transcript
          transcriptLines.forEach(segment => {
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

      }
    };

    const interval = setInterval(updateVisibleWords, 10); // Update visible words every 500ms

    return () => {
      clearInterval(interval);
      setVisibleWords([]);
    }
  }, [transcription, audioRef]);

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
        {(transcription !== undefined && transcription.status === "Ready") || visibleWords.length > 0 ? (
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
        ) : (
          <Text fontSize={fontSize} color="white">
            Transcription not available at the moment.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default TranscriptComp;
