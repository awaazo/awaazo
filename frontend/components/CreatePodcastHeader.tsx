import { Box, Image, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function CreatePodcastHeader() {
  const [podcasts, setPodcasts] = useState([]);
  const totalRows = 4.5;
  const totalColumns = 8;

  useEffect(() => {
    const newPodcasts = [];
    for (let i = 0; i < totalRows * totalColumns; i++) {
      newPodcasts.push({
        id: i,
        title: `Podcast ${i + 1}`,
        imageUrl: `https://source.unsplash.com/random/200x200?sig=${i}`,
        blur: calculateBlur(i, totalColumns, totalRows),
        opacity: calculateOpacity(i, totalColumns, totalRows),
      });
    }
    setPodcasts(newPodcasts);
  }, []);

  const calculateBlur = (index, columns, rows) => {
    const rowPosition = Math.floor(index / columns);
    const blurIntensity = (rowPosition / (rows - 1)) * 20; // Increase '10' to increase max blur
    return `${blurIntensity}px`;
  };

  const calculateOpacity = (index, columns, rows) => {
    const rowPosition = Math.floor(index / columns);
    const opacityIntensity = 0.9 - rowPosition / (rows - 1); // Decrease '10' to decrease max opacity
    return `${opacityIntensity}`;
  };

  return (
    <>
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
