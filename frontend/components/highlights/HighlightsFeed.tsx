import React, { useState } from 'react';
import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import HighlightPlayer from './HighlightPlayer';
import mockHighlights from '../highlights/mockHighLights'; // Assume this is an array of highlight objects
import { Highlight } from '../../types/Interfaces';
import { any } from 'cypress/types/bluebird';

const HighlightsFeed = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextHighlight = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mockHighlights.length);
    };

    const highlight: Highlight = mockHighlights[currentIndex];

    return (
        <Flex direction="column" align="center" justify="center" py={8}>
            <HighlightPlayer src={any} title={highlight.highlightName} description={highlight.description} />
            <Flex mt={4} justify="space-between" w="60%">
                <IconButton aria-label="Like highlight" icon={<FaHeart />} />
                <IconButton aria-label="Comment on highlight" icon={<FaComment />} />
                <IconButton aria-label="Share highlight" icon={<FaShare />} />
            </Flex>
            <Button onClick={goToNextHighlight} mt={4} colorScheme="teal">Next Highlight</Button>
        </Flex>
    );
};

export default HighlightsFeed;