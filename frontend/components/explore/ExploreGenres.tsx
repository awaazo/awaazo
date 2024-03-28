import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import techImage from "../../styles/images/genres/tech.png";
import educationImage from "../../styles/images/genres/Education.png";
import comedyImage from "../../styles/images/genres/comedy.png";
import NewsImage from "../../styles/images/genres/News.png";
import businessImage from "../../styles/images/genres/Business.png";
import sportsImage from "../../styles/images/genres/Sports.png";
import wellnessImage from "../../styles/images/genres/Wellness.png";
import otherImage from "../../styles/images/genres/other.png";
import GenreCard from "../cards/GenreCard";

// Define the genres array with name, image, and link properties
const genres = [
  { name: "Tech", image: techImage, link: "Technology" ,  podcastCount: 43},
  { name: "Education", image: educationImage, link: "Education" ,  podcastCount: 3132},
  { name: "Comedy", image: comedyImage, link: "Comedy", podcastCount: 3412 },
  { name: "News", image: NewsImage, link: "News",  podcastCount: 3112},
  { name: "Business", image: businessImage, link: "Business" , podcastCount: 3122},
  { name: "Sports", image: sportsImage, link: "Sports" , podcastCount: 3122},
  { name: "Wellness", image: wellnessImage, link: "Wellness" , podcastCount: 3122},
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
