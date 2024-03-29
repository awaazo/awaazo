import { Box, Image, Text, Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Podcast } from "../../types/Interfaces";
import Logo from "../../public/logos/logo_white.svg";
import { OneDot, TwoDots, ThreeDots,FourDots, FiveDots} from "../../public/icons";


interface PodcastCardProps {
  podcast: Podcast;
}

const CardHoverEffects = {
  bg: "blackAlpha.800",
  textDecoration: "none",
};

const CardSize = {
  base: "150px",
  md: "200px",
  lg: "220px",
};

const PodcastImage = ({ coverArtUrl, name }) => (
  <Image src={coverArtUrl} alt={name} objectFit="cover" position="absolute" top={0} w="full" h="full" transition="opacity 0.2s ease-in-out" _groupHover={{ opacity: 0.4 }} />
);

const LogoTopLeft = () => (
  <Flex position="absolute" top="5" left="5" align="center" zIndex="2">
    <Image src={Logo.src} alt="Logo" w={5} />
  </Flex>
);

const RatingTopRight = ({ averageRating }) => {
  const roundRating = Math.round(averageRating);
  let ratingIcon;
  switch (roundRating) {
    case 1:
      ratingIcon = oneDot;
      break;
    case 2:
      ratingIcon = twoDots;
      break;
    case 3:
      ratingIcon = threeDots;
      break;
    case 4:
      ratingIcon = fourDots;
      break;
    case 5:
      ratingIcon = fiveDots;
      break;
    default:
      ratingIcon = oneDot;
  }
  return (
    <Flex position="absolute" top="5" right="5" align="center" opacity="0" _groupHover={{ opacity: 1 }} zIndex={2} >
      {ratingIcon}
      <Text fontSize="sm" color="white" ml="2" textShadow="0px 2px 20px #0000008E">
        {averageRating}
      </Text>
    </Flex>
  );
}

const PodcastNameAndTags = ({ name, tags }) => (
  <Flex position="absolute" bottom="5" left={1} right={1} px="4" justifyContent="space-between" alignItems="center" zIndex={2} >
    <Box>
      <Text fontSize="md" fontWeight="bold" color="white" textShadow="0px 2px 20px #0000008E" data-cy={`podcast-name:${name}`} >
        {name}
      </Text>
      <Text fontSize="xs" color="gray.200" noOfLines={1} textShadow="0px 2px 20px #0000008E">
        {tags}
      </Text>
    </Box>
  </Flex>
);

const PodcastType = ({ type }) => (
  <Text fontSize="xs" color="gray.400" position="absolute" bottom="5" right={4} zIndex={2} textShadow="0px 2px 20px #0000008E" >
    {type}
  </Text>
);

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const size = useBreakpointValue(CardSize);

  return (
    <Box width={size} height={size} position="relative" margin="1em">
      <Link href={`/Explore/${podcast.id}`} passHref>
        <Flex
          direction="column"
          align="center"
          rounded="25px"
          overflow="hidden"
          _hover={CardHoverEffects}
          pb="100%"
          position="absolute"
          role="group"
          cursor="pointer"
          transition="transform 0.2s ease-in-out"
          width="full"
          height="full"
          outline="2px solid #FFFFFF14"
          zIndex={0}
        >
          <PodcastImage coverArtUrl={podcast.coverArtUrl} name={podcast.name} />
          {/* Gradient Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient="linear(to-t, rgba(0, 0, 0, 0.7), transparent)"
            zIndex="1" // Ensure this is above the image but below the text content
          />
          <LogoTopLeft />
          <RatingTopRight averageRating={podcast.averageRating} />
          <PodcastNameAndTags name={podcast.name} tags={podcast.tags} />
          <PodcastType type={podcast.type} />
          <Icon as={oneDot} />
        </Flex>
      </Link>
    </Box>
  );
};



export default PodcastCard;
