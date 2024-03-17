import React from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const EngagementControls = () => {
    return (
        <HStack spacing={4}>
            <IconButton aria-label="Like highlight" icon={<FaHeart />} />
            <IconButton aria-label="Comment on highlight" icon={<FaComment />} />
            <IconButton aria-label="Share highlight" icon={<FaShare />} />
            {/* Implement onClick handlers to handle interactions */}
        </HStack>
    );
};

export default EngagementControls;