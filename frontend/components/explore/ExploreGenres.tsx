import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import techImage from "../../styles/images/genres/tech.png";
import medImage from "../../styles/images/genres/med.png";
import comedyImage from "../../styles/images/genres/comedy.png";
import politicsImage from "../../styles/images/genres/politics.png";
import crimeImage from "../../styles/images/genres/crime.png";
import otherImage from "../../styles/images/genres/other.png";
import GenreCard from "../cards/GenreCard";

// Define the genres array with name, image, and link properties
const genres = [
  { name: "Tech", image: techImage, link: "Technology" ,  podcastCount: 43},
  { name: "Medical", image: medImage, link: "Medical" ,  podcastCount: 3132},
  { name: "Comedy", image: comedyImage, link: "Comedy", podcastCount: 3412 },
  { name: "Politics", image: politicsImage, link: "Politics",  podcastCount: 3112},
  { name: "Crime", image: crimeImage, link: "Crime" , podcastCount: 3122},
  { name: "Other", image: otherImage, link: "Other",  podcastCount: 3123 },
];

const ExploreGenres = () => {
  const [hoveredGenre, setHoveredGenre] = useState(null);

  return (
    <Flex
      justifyContent="flex-start"
      flexWrap="wrap"
      maxWidth={{ base: "100%", md: "1500px" }}
    >
      {genres.map((genre) => (
        <Box
          key={genre.name}
          width={{
            base: "50%",
            md: "31%",
            lg: "23%",
            xl: "16%",
          }}
          marginBottom={{ base: "1.5em", md: "1.5em", lg: "3em" }}
        >
          <GenreCard
            genre={genre}
            onMouseEnter={setHoveredGenre}
            onMouseLeave={() => setHoveredGenre(null)}
          />
        </Box>
      ))}
    </Flex>
  );
};

export default ExploreGenres;
