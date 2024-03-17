import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Progress, Text, VStack } from '@chakra-ui/react';
import { FaPlay, FaPause } from 'react-icons/fa';

const HighlightPlayer = ({ src, title, description }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current && isPlaying) {
                const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setProgress(currentProgress);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <VStack spacing={4} align="stretch">
            <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
            <Box textAlign="center">
                <IconButton
                    aria-label={isPlaying ? 'Pause highlight' : 'Play highlight'}
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    onClick={togglePlay}
                    size="lg"
                    colorScheme="teal"
                />
            </Box>
            <Progress value={progress} size="xs" colorScheme="teal" />
            <Text fontWeight="bold" textAlign="center">{title}</Text>
            <Text fontSize="sm" textAlign="center">{description}</Text>
        </VStack>
    );
};

export default HighlightPlayer;