import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { OneDot, TwoDots, ThreeDots, FourDots, FiveDots } from '../../public/icons';

interface RatingProps {
    rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const ratingIcons = [OneDot, TwoDots, ThreeDots, FourDots, FiveDots];
  const ratingIndex = Math.min(Math.max(0, Math.round(rating) - 1), 4);
  const RatingIcon = ratingIcons[ratingIndex];

  return (
    <Flex position="absolute" bottom="3" left="4" align="start" zIndex={2}>
      <Box width="50px" height="20px" lineHeight="0" display="flex" alignItems="flex-start">
        <RatingIcon width="100%" height="100%" style={{ position: 'absolute' }} />
      </Box>
    </Flex>
  );
};

export default Rating;
