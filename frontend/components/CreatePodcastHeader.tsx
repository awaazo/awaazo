import { Box, Image, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// This component represents the header section of the create podcast page
export default function CreatePodcastHeader() {
  const [podcasts, setPodcasts] = useState([]); // State to store the podcasts
  const totalRows = 4.5; // Total number of rows in the grid
  const totalColumns = 8; // Total number of columns in the grid

  useEffect(() => {
    const newPodcasts = [];
    for (let i = 0; i < totalRows * totalColumns; i++) {
      newPodcasts.push({
        id: i,
        title: `Podcast ${i + 1}`,
        imageUrl: `https://source.unsplash.com/random/200x200?sig=${i}`,
        blur: calculateBlur(i, totalColumns, totalRows), // Calculate the blur intensity based on the index, columns, and rows
        opacity: calculateOpacity(i, totalColumns, totalRows), // Calculate the opacity intensity based on the index, columns, and rows
      });
    }
    setPodcasts(newPodcasts); // Update the podcasts state with the newPodcasts array
  }, []);

  const calculateBlur = (index, columns, rows) => {
    const rowPosition = Math.floor(index / columns);
    const blurIntensity = (rowPosition / (rows - 1)) * 20; 
    return `${blurIntensity}px`;
  };

  // Function to calculate the opacity intensity based on the index, columns, and rows
  const calculateOpacity = (index, columns, rows) => {
    const rowPosition = Math.floor(index / columns);
    const opacityIntensity = 0.9 - rowPosition / (rows - 1); 
    return `${opacityIntensity}`;
  };

  return (
    <>
      {/* Box to contain the grid of podcast images */}
      <Box
        display="flex"
        justifyContent="space-evenly"
        textAlign="center"
        p={4}
        borderRadius="md"
        width="100%"
        overflow="hidden"
        position="absolute"
        top={"0em"}
        left={0}
        right={0}
        zIndex={-2}
      >
        {/* Grid to display the podcast images */}
        <SimpleGrid columns={totalColumns} spacing={4}>
          {podcasts.map((podcast) => (
            <Box
              key={podcast.id}
              m={2}
              borderRadius="2em"
              overflow="hidden"
              boxShadow="md"
              style={{
                filter: `blur(${podcast.blur})`, 
                opacity: podcast.opacity, 
              }}
            >
              {/* Image of the podcast */}
              <Image
                src={podcast.imageUrl}
                alt={podcast.title}
                borderRadius="lg"
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
