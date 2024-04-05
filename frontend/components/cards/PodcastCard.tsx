import { Box, Image, Text, Flex,  useBreakpointValue } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { Podcast } from '../../types/Interfaces'
import Rating from '../assets/RatingView';

interface PodcastCardProps {
  podcast: Podcast
}

const CardSize = {
  base: '150px',
  md: '200px',
  lg: '200px',
}

const PodcastImage = ({ coverArtUrl, name }) => (
  <>
    <Image
      src={coverArtUrl}
      alt={name}
      objectFit="cover"
      position="absolute"
      top={0}
      w="full"
      h="full"
      transition="opacity 0.2s ease-in-out"
      _groupHover={{ opacity: 1, filter: 'blur(3px)'}}
    />
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgGradient="linear(180deg, rgba(30, 30, 30, 0.80) 0%, rgba(41.64, 41.64, 41.64, 0.80) 100%)"
      opacity={0}
      transition="opacity 0.2s ease-in-out"
      _groupHover={{ opacity: 0.8 }}
    />
  </>
)


const PodcastNameAndTags = ({ name, description }) => (
  <Flex position="absolute" top="5" left={1} right={1} px="4" justifyContent="space-between" alignItems="center" zIndex={2} opacity="0" _groupHover={{ opacity: 1 }}>
    <Box>
      <Text fontSize="md" fontWeight="bold" color="az.darkGradient" data-cy={`podcast-name:${name}`}>
        {name}
      </Text>
      <Text fontSize="xs" fontWeight="medium" color="gray.200" noOfLines={1}>
        {description}
      </Text>
    </Box>
  </Flex>
)

const PodcastType = ({ type }) => (
  <Text fontSize="xs" color="white" position="absolute" bottom="3" right={4} zIndex={2} textShadow="0px 2px 20px #0000008E">
    {type}
  </Text>
)

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const size = useBreakpointValue(CardSize)

  return (
    <Box width={size} height={size} position="relative" margin="1em">
      <Link href={`/Explore/${podcast.id}`} passHref>
        <Flex
          direction="column"
          align="center"
          rounded="15px"
          overflow="hidden"
          pb="100%"
          position="absolute"
          role="group"
          cursor="pointer"
          transition="transform 0.2s ease-in-out"
          width="full"
          height="full"
          zIndex={0}
        >
          <PodcastImage coverArtUrl={podcast.coverArtUrl} name={podcast.name} />
          {/* Gradient Overlay */}
          <Box position="absolute" top={0} left={0} right={0} bottom={0} bgGradient="linear(to-t, rgba(0, 0, 0, 0.5), transparent)" zIndex="1" />
          <Rating rating={podcast.averageRating} />
          <PodcastNameAndTags name={podcast.name} description={podcast.description} />
          <PodcastType type={podcast.type} />
        </Flex>
      </Link>
    </Box>
  )
}

export default PodcastCard
