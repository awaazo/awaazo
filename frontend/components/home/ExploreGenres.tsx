import { Box, Text, Grid, Image } from "@chakra-ui/react";
import { useState } from "react";
import techImage from "../../styles/images/genres/tech.png";
import educationImage from "../../styles/images/genres/ed.png";
import comedyImage from "../../styles/images/genres/comedy.png";
import politicsImage from "../../styles/images/genres/politics.png";
import crimeImage from "../../styles/images/genres/crime.png";
import otherImage from "../../styles/images/genres/other.jpg"; // assuming there's an 'other.png'

const genres = [
  { name: "Tech", image: techImage },
  { name: "Education", image: educationImage },
  { name: "Comedy", image: comedyImage },
  { name: "Politics", image: politicsImage },
  { name: "Crime", image: crimeImage },
  { name: "Other", image: otherImage },
];

const GenreCard = ({ genre, isHovered, onMouseEnter, onMouseLeave }) => {
  return (
    <Box
      key={genre.name}
      h="100%"
      borderRadius="1.2em"
      overflow="hidden"
      position="relative"
      _hover={{ boxShadow: "xl", cursor: "pointer", transform: "scale(1.1)", transition: "all 0.3s ease-in-out" }}
      boxSizing="border-box" 
      border="1px solid"
      onMouseEnter={() => onMouseEnter(genre.name)}
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={genre.image.src}
        alt={`${genre.name} background`}
        width="100%"
        height="100%"
        objectFit="cover"
        opacity="0.8"
      />       
      <Text
        fontWeight="bold"
        fontSize={["md", "lg", "xl"]}
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        textShadow="2px 2px 4px #000000"
        p={1}
      >
        {genre.name}
      </Text>
    </Box>
  );
};

const ExploreGenres = () => {
  const [hoveredGenre, setHoveredGenre] = useState(null);

  return (
    <Box marginLeft="5em" marginRight="5em" marginBottom="3em">
      <Text fontSize="2xl" fontWeight="bold" mb={3}>
        Explore Genres
      </Text>
      <Grid templateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(6, 1fr)"]} gap={4}>
        {genres.map(genre => (
          <GenreCard
            key={genre.name}
            genre={genre}
            isHovered={hoveredGenre === genre.name}
            onMouseEnter={setHoveredGenre}
            onMouseLeave={() => setHoveredGenre(null)}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default ExploreGenres;
