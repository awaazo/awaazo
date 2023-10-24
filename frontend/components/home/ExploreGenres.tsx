import { Box, Text, VStack, useColorModeValue, Flex, Image, keyframes, Grid } from "@chakra-ui/react";
import techImage from "../../styles/images/genres/tech.png";
import educationImage from "../../styles/images/genres/ed.png";
import comedyImage from "../../styles/images/genres/comedy.png";
import politicsImage from "../../styles/images/genres/politics.png";
import crimeImage from "../../styles/images/genres/crime.png";
import otherImage from "../../styles/images/genres/crime.png";



const ExploreGenres = () => {
  const genres = [
    { name: "Tech", backgroundImage: techImage },
    { name: "Education", backgroundImage: educationImage },
    { name: "Comedy", backgroundImage: comedyImage },
    { name: "Politics", backgroundImage: politicsImage },
    { name: "Crime", backgroundImage: crimeImage },
    { name: "Other", backgroundImage: otherImage },
  ];

  // Duplicate the genres list for infinite scroll illusion
  const allGenres = [...genres];


  return (
    <>
    <VStack align="center" spacing={5} p={[2, 4, 5]} flex="1" overflow="hidden" > 
      <Grid 
        templateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(6, 1fr)"]}
        gap={4}

        className="no-scrollbar"
        overflowX="hidden"
overflowY="hidden"

      >
        {allGenres.map((genre, index) => (
          <Box 
            key={index} 
            h="100%" 
            borderRadius="lg" 
            overflow="hidden" 
            position="relative" 
            _hover={{ boxShadow: "xl", cursor: "pointer", transform: "scale(1.05)", transition: "all 0.2s ease-in-out", }}
            boxSizing="border-box" 
            border="1px solid"
            
          >
            <Image src={genre.backgroundImage.src} alt={`${genre.name} background`} width="100%" height="100%" objectFit="cover" opacity="0.8" />
            <Text 
              fontWeight="bold" 
              fontSize={["md", "lg", "xl"]} // adjust font size based on screen width
              position="absolute" 
              left="50%" 
              top="50%" 
              transform="translate(-50%, -50%)" 
              color={useColorModeValue("gray.800", "white")} 
              p={1}
            >
              {genre.name}
            </Text>
          </Box>
        ))}
      </Grid>
    </VStack>
    </>
  );
};

export default ExploreGenres;
