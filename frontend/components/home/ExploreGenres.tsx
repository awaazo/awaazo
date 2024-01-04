import { Box, Text, Grid, Image } from "@chakra-ui/react";
import { useState } from "react";
import techImage from "../../styles/images/genres/tech.png";
import educationImage from "../../styles/images/genres/ed.png";
import comedyImage from "../../styles/images/genres/comedy.png";
import politicsImage from "../../styles/images/genres/politics.png";
import crimeImage from "../../styles/images/genres/crime.png";
import otherImage from "../../styles/images/genres/other.jpg";
import GenreCard from "../cards/GenreCard"

// Define the genres array with name, image, and link properties
const genres = [
  { name: "Tech", image: techImage, link: "Technology" },
  { name: "Education", image: educationImage, link: "Education" },
  { name: "Comedy", image: comedyImage, link: "Comedy" },
  { name: "Politics", image: politicsImage, link: "Politics" },
  { name: "Crime", image: crimeImage, link: "Crime" },
  { name: "Other", image: otherImage, link: "Other" },
];

const ExploreGenres = () => {
  const [hoveredGenre, setHoveredGenre] = useState(null);

  return (
    <Box marginBottom="3em">
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
