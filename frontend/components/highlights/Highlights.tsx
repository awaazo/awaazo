import { Spinner, Text, HStack, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import HighlightTicket from "./HighlightTicket";
import HighlightHelper from "../../helpers/HighlightHelper";
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
      const quantity = 20;

      setIsLoading(true);
      try {
        const response = await HighlightHelper.getRandomHighlights(quantity);
        setHighlights(response); 
        setError(""); 
      } catch (err) {
        console.error(err); 
        setError("Failed to fetch highlights");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHighlights();
  }, []); 

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
            const correspondingEpisode = episodes.find(episode => episode.id === highlight.episodeId);
            if (!correspondingEpisode) {
              console.error(`No episode found for highlight ${highlight.id} with episodeId ${highlight.episodeId}`);
              return null;
            }

            return (
              <HighlightTicket key={highlight.id} highlight={highlight} episode={correspondingEpisode} thumbnailUrl={correspondingEpisode.thumbnailUrl}/>
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
