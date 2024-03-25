import { useState, useEffect } from "react";
import { Box, Button, Flex, FormControl, Input, LinkOverlay, Stack, Text, Textarea } from "@chakra-ui/react";
import TranscriptPlayingBar from "./TranscriptPlayingBar";
import PodcastHelper from "../../helpers/PodcastHelper";
import { editTranscriptLinesRequest } from "../../types/Requests";
import { Transcript, TranscriptLine, TranscriptWord } from "../../types/Interfaces";


const ManageTranscript = ({ episodeId, podcastId }) => {

    const [transcript, setTranscript] = useState<Transcript>(null);
    const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>(null);



    useEffect(() => {
        if (episodeId) {
            PodcastHelper.getTranscriptFull(episodeId)
                .then((res) => {
                    if (res.status === 200) {
                        // Set the transcript and transcript lines
                        setTranscript(res.transcript);
                        setTranscriptLines(res.transcript.lines);
                    } else {
                        console.error("Error fetching transcripts data:", res.message);
                    }
                })
                .catch((error) => console.error("Error fetching transcripts data:", error));
        }
    }, [episodeId]);


    // State to track the currently edited word
    const [editState, setEditState] = useState({ textIndex: null, wordIndex: null, value: '' });

    const handleWordChange = (e, lineIndex, wordIndex) => {
        setEditState({ ...editState, value: e.target.value });
    };

    const saveWord = (lineIndex, wordIndex) => {


        if (transcriptLines) {

            // Update the word in the transcript
            const updatedTranscript = transcriptLines.map((line, lineId) => {

                // If the line is the one being edited, update the word
                if (lineId === lineIndex) {

                    // Split the line into words and update the word at the specified index
                    const updatedWords = line.text.split(' ').map((word, index) => {
                        if (index === wordIndex) {
                            return editState.value;
                        }
                        return word;
                    });

                    // Update the line text based on the modified words
                    line.text = updatedWords.join(' ');
                }
                return line;
            });
            
            // Get the start time of the line being edited
            const startTime = transcriptLines[lineIndex].start;
            console.log("startTime: " + startTime);

            // Get the original text of the line being edited with the words as an array
            PodcastHelper.getTranscript(episodeId,startTime)
                .then((res) => {
                    if (res.status === 200) {

                        // Update the word in the transcript
                        var newLine = res.transcript.lines[lineIndex];
                        newLine.text = updatedTranscript[lineIndex].text;
                        newLine.words[wordIndex].word = editState.value;
                        newLine.words[wordIndex].score = 1;


                        // Save the updated line
                        saveTranscriptLine([newLine]);


                    } else {
                        console.error("Error fetching transcripts data:", res.message);
                    }
                })
                .catch((error) => console.error("Error fetching transcripts data:", error));


        }

    };


    const saveTranscriptLine = (lines) => {
        if (transcript) {

            const request: editTranscriptLinesRequest = lines.map((line) => ({
                id: line.id,
                seek: line.seek,
                start: line.start,
                end: line.end,
                text: line.text,
                speaker: line.speaker,
                words: line.words.map((word) => ({
                    start: word.start,
                    end: word.end,
                    word: word.word,
                    score: word.score,
                    speaker: word.speaker
                }))
            }));

            // Send the request to update transcript
            PodcastHelper.editTranscriptLines(episodeId, request).then((response) => {
                if (response.status === 200) {
                    console.log("transcript updated");
                } else {
                    console.error("Error editing transcript", response.message);
                }
            });
        }
    };

    return (
        <Box>
            <Box
                style={{
                    width: '100vh',
                    height: '70vh',
                    overflowY: 'scroll',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            >
                {transcriptLines && transcriptLines[0].text ?
                    (
                        transcriptLines.map((line, lineIndex) => (
                            <Box key={lineIndex} style={{ marginBottom: '10px' }}>

                                {line.text.split(' ').map((word, wordIndex) => (

                                    editState.textIndex === lineIndex && editState.wordIndex === wordIndex ? (
                                        <Input
                                            value={editState.value}
                                            onChange={(e) => handleWordChange(e, lineIndex, wordIndex)}
                                            onBlur={() => saveWord(lineIndex, wordIndex)}
                                            autoFocus
                                            key={wordIndex}
                                            size="sm"
                                        />
                                    ) : (
                                        <span
                                            onClick={() => setEditState({ textIndex: lineIndex, wordIndex, value: word })}
                                            style={{ marginRight: '5px', cursor: 'pointer', display: 'inline-block' }}
                                            key={wordIndex}
                                        >
                                            {word}
                                        </span>
                                    )
                                ))}
                            </Box>
                        ))) : (
                        <span>No transcript available</span>
                    )
                }
            </Box>
            <Box
                style={{
                    textAlign: 'center',
                    marginTop: '10px'
                }}
            >

            </Box>
        </Box>
    );

};

export default ManageTranscript;
