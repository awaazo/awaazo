//podcastCard.tsx
import { Box, Image, Text, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Podcast } from "../../utilities/Interfaces";
import Logo from "../../public/logo_white.svg";
import { FaPlay, FaStar } from "react-icons/fa";

interface PodcastCardProps {
  podcast: Podcast;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const size = useBreakpointValue({ base: "150px", md: "200px", lg: "220px" });
  return (
    <Box width={size} height={size} position="relative">
      <Link href={`/Explore/${podcast.id}`} passHref>
        <Flex
          direction="column"
          align="center"
          rounded="xl"
          overflow="hidden"
          _hover={{
            bg: "blackAlpha.800",
            textDecoration: "none",
          }}
          pb="100%"
          position="absolute"
          role="group"
          cursor="pointer"
          bg="black"
          transition="transform 0.2s ease-in-out"
          width="full"
          height="full"
        >
          <Image src={podcast.coverArtUrl} alt={podcast.name} objectFit="cover" position="absolute" top={0} w="full" h="full" transition="opacity 0.2s ease-in-out" _groupHover={{ opacity: 0.4 }} />
          <Box position="absolute" bottom="0" left="0" right="0" height="50%" bgGradient="linear(to-t, black, transparent )" zIndex="0" />
          <Flex position="absolute" top="2" left="2" align="center" zIndex="2">
            <Image src={Logo.src} alt="Logo" w={5} />
          </Flex>
          <Flex position="absolute" top="2" right="2" align="center" opacity="0" _groupHover={{ opacity: 1 }}>
            <Icon as={FaStar} color="brand.100" w={4} h={4} />
            <Text fontSize="sm" color="white" ml="2">
              {podcast.averageRating}
            </Text>
          </Flex>
          <Box position="absolute" top={0} right={0} bottom={0} left={0} bgGradient="linear(to-t, blackAlpha.600, transparent)" />
          <Flex position="absolute" justifyContent="center" alignItems="center" top={0} bottom={0} left={0} right={0}>
            <Icon as={FaPlay} color="brand.100" w={8} h={6} opacity="0" _groupHover={{ opacity: 1 }} />
          </Flex>
          <Flex position="absolute" bottom="4" left={0} right={0} px="4" justifyContent="space-between" alignItems="center">
            <Box>
              <Text fontSize="md" fontWeight="bold" color="white" data-cy={`podcast-name:${podcast.name}`}>
                {podcast.name}
              </Text>
              <Text fontSize="xs" color="gray.200" noOfLines={1}>
                {podcast.tags}
              </Text>
            </Box>
            <Text fontSize="xs" color="gray.400">
              {podcast.type}
            </Text>
          </Flex>
        </Flex>
      </Link>
    </Box>
  );
};

export default PodcastCard;
