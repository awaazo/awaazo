import { Box, Text, VStack, useColorModeValue, Grid, Image } from "@chakra-ui/react";
import techImage from "../../styles/images/genres/tech.png";
import educationImage from "../../styles/images/genres/ed.png";
import comedyImage from "../../styles/images/genres/comedy.png";
import politicsImage from "../../styles/images/genres/politics.png";
import crimeImage from "../../styles/images/genres/crime.png";
import otherImage from "../../styles/images/genres/other.jpg";

const ExploreGenres = () => {
  const genres = [
    { name: "Tech", backgroundImage: techImage },
    { name: "Education", backgroundImage: educationImage },
    { name: "Comedy", backgroundImage: comedyImage },
    { name: "Politics", backgroundImage: politicsImage },
    { name: "Crime", backgroundImage: crimeImage },
    { name: "Other", backgroundImage: otherImage },
  ];

  return (
    <VStack align="start" spacing={5} p={5} m={3} width="100%" flex="1" borderRadius="25px" backdropFilter="blur(35px)" boxShadow="xl">
      <Text fontSize="xl" fontWeight="bold" ml={3} position="sticky">
        Explore Genres
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} width="80%" alignSelf="center">
        {genres.map((genre, index) => (
          <Box key={index} h="100px" w="100%" borderRadius="lg" overflow="hidden" position="relative" _hover={{ transform: "scale(1.03)", boxShadow: "xl" }} transition="all 0.3s ease-in-out">
            <Image src={genre.backgroundImage.src} alt={`${genre.name} background`} width="100%" height="100%" objectFit="cover" opacity="0.8" />
            <Text fontWeight="bold" fontSize="xl" position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)" color={useColorModeValue("gray.800", "white")} p={1}>
              {genre.name}
            </Text>
          </Box>
        ))}
      </Grid>
    </VStack>
  );
};

export default ExploreGenres;
