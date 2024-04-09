import React from 'react'
import { Box, Flex, HStack } from '@chakra-ui/react'
import { FaCircle } from 'react-icons/fa'
import { AwaazoA } from '../../public/icons' // Assuming this is correctly imported

interface RatingProps {
  rating: number
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const ratingColors = ['white', 'az.blue', 'az.green', 'az.yellow', 'az.red']

  return (
    <Box style={{ position: 'relative', bottom: '-4px' }}>
      <HStack spacing={'0'} >
        <AwaazoA width="16px" height="16px" style={{ position: 'relative', bottom: '3px', left: '2px' }} />
        <Flex>
          {Array.from({ length: rating }, (_, index) => (
            <Box as={FaCircle} key={index} color={ratingColors[index]} size="8px" style={{ marginLeft: '1px' }} />
          ))}
        </Flex>
      </HStack>
    </Box>
  )
}

export default Rating
