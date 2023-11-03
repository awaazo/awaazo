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
  const scale = isHovered ? "scale(1.1)" : "scale(0.9)";

  return (
    <Box
      key={genre.name}
      h="100%"
      borderRadius="1.2em"
      overflow="hidden"
      position="relative"
      _hover={{
        boxShadow: "xl",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
      }}
      transform={scale} // Apply the calculated scale
      transition="all 0.3s ease-in-out" // Ensure the transition is smooth for both hover and unhover events
      boxSizing="border-box"
      border="1px solid"
      onMouseEnter={() => onMouseEnter(genre.name)}
      onMouseLeave={onMouseLeave}
      zIndex={isHovered ? 1 : 0} // Ensure the hovered item stacks on top
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
    <Box marginBottom="3em">
      <Box
        bgGradient="linear(to-r, #ad602d, transparent)"
        w={{ base: "70%", md: "20%" }}
        top={0}
        left={0}
        zIndex={-99}
        borderRadius={"0.5em"}
        boxShadow={"lg"}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={"1em"} ml={"0.7em"}>
          Explore Genres
        </Text>
      </Box>
      <Grid
        templateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(6, 1fr)"]}
        gap={4}
      >
        {genres.map((genre) => (
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
