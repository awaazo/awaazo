import { Spinner, Text, HStack, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import HighlightTicket from "./HighlightTicket";
import HighlightHelper from "../../helpers/HighlightHelper";
// import Episode from "../CreatorHub/MyEpisodes";
import { Episode } from "../../types/Interfaces";
import axios from "axios";

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get('http://localhost:32773/podcast/getRecentEpisodes?page=0&pageSize=20');
        setEpisodes(response.data);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };

    fetchEpisodes();
  }, []);

  useEffect(() => {
    async function fetchHighlights() {
      const quantity = 20; // Define the number of random highlights you want to fetch

      setIsLoading(true);
      try {
        const response = await HighlightHelper.getRandomHighlights(quantity);
        setHighlights(response); // Assuming the response is directly the array of highlight objects
        setError(""); // Clear any previous error
      } catch (err) {
        console.error(err); // It's a good practice to log the actual error for debugging purposes
        setError("Failed to fetch highlights");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHighlights();
  }, []); // This effect does not depend on any changing values

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box overflowX="auto" css={{ width: "100%", maxWidth: "2100px", "&::-webkit-scrollbar": { display: "none" } }}>
      <HStack spacing={4} align="stretch">
        {highlights.length > 0 ? (
          highlights.map((highlight) => {
            // Find the episode corresponding to this highlight's episodeId
            const correspondingEpisode = episodes.find(episode => episode.id === highlight.episodeId);
            
            // Check if correspondingEpisode exists before rendering HighlightTicket
            if (!correspondingEpisode) {
              console.error(`No episode found for highlight ${highlight.id} with episodeId ${highlight.episodeId}`);
              return null; // Or handle this scenario appropriately
            }

            return (
              <HighlightTicket key={highlight.id} highlight={highlight} episode={correspondingEpisode} />
            );
          })
        ) : (
          <Text>No highlights available</Text>
        )}
      </HStack>
    </Box>

  );
};

export default Highlights;
