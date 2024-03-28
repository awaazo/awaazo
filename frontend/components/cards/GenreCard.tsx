import React from "react";
import { Box, Text, Image, IconButton, Icon, Flex, VStack, HStack } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "../../public/logos/logo_white.svg";
import { ArrowR } from "../../public/icons";
import genreBackdropShape from "../../public/svgs/genreBackdropShape.svg";
interface GenreCardProps {
  genre: {
    link: string;
    name: string;
    podcastCount: number;
    image: {
      src: string;
      alt?: string;
    };
    logo: {
      src: string;
      alt?: string;
    };
  };
  onMouseEnter: (name: string) => void;
  onMouseLeave: () => void;
}

const GenreCard: React.FC<GenreCardProps> = ({
  genre,
  onMouseEnter,
  onMouseLeave,
}) => {
  const LogoTopRight = () => (
    <Flex position="absolute" top="5" right="6" align="center" zIndex="2">
      <Image src={Logo.src} alt="Logo" w={4} />
    </Flex>
  );
  return (
    <Link href={`/Explore/Genre/${genre.link}`} passHref>
      <Box
        position="relative"
        h="240px"
        w="165px"
        overflow="hidden"
        onMouseEnter={() => onMouseEnter(genre.name)}
        onMouseLeave={onMouseLeave}
        _hover={{
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
        }}
      >
       {/* Layer z=0: Shape and shadow */}
       <Image
          src={genreBackdropShape.src}
          alt="Backdrop shape"
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          zIndex={0}
        />

        {/* Layer z=1: Genre Image with Logo */}
        <Box position="relative" zIndex={1}>
          <Image
            src={genre.image.src}
            alt={genre.image.alt || "Genre background"}
            width="150px"
            height="150px"
            objectFit="cover"
            roundedTopLeft={"57px"}
            roundedTopRight={"10px"}
            roundedBottomLeft={"10px"}
            roundedBottomRight={"10px"}
          />
          <LogoTopRight />
        </Box>

        {/* Text and Button */}
        <Box position="absolute" bottom="4" zIndex={1} w="full" p="4">
          <HStack>
          <VStack align="left"  spacing={0}>
          <Text fontSize="lg" fontWeight="bold" color="White">
            {genre.name}
          </Text>
          <Text fontSize="xs" color="az.darkGrey">
            {`${genre.podcastCount} podcasts`}
          </Text>
          </VStack>
          <IconButton
            mt="2"
            bg="az.greyish"
            aria-label="Button label"
            size="sm"
            borderRadius="full"
            _hover={{
              boxShadow: "0 0 10px 1px rgba(255, 255, 255, 0.5)",
            }}
            icon={<Icon as={ArrowR} boxSize={4} />}
          />
          </HStack>
        </Box>
        
      </Box>
    </Link>
  );
};

export default GenreCard;
