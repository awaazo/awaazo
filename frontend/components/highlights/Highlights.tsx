import { Spinner, Text, HStack, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import HighlightTicket from "./HighlightTicket";
import HighlightHelper from "../../helpers/HighlightHelper";
import axios from "axios";
import FullScreenHighlight from "./FullScreenHighlight";

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

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

  const openFullScreen = (index) => {
    setCurrentHighlightIndex(index);
    setIsFullScreen(true);
  };

  const goToNextHighlight = () => {
    setCurrentHighlightIndex(prevIndex => prevIndex < highlights.length - 1 ? prevIndex + 1 : prevIndex);
  };

  const goToPreviousHighlight = () => {
    setCurrentHighlightIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
  };

  return (
    <>
    
      {isFullScreen && (
        <FullScreenHighlight
          highlights={highlights}
          currentHighlightIndex={currentHighlightIndex}
          onClose={() => setIsFullScreen(false)}
          onNext={goToNextHighlight}
          onPrevious={goToPreviousHighlight}     
        />
      )}

      <Box overflowX="auto" css={{ width: "100%", maxWidth: "2100px", "&::-webkit-scrollbar": { display: "none" } }}>
        <HStack spacing={4} align="stretch">
          {highlights.length > 0 ? (
            highlights.map((highlight, index) => {
              const correspondingEpisode = episodes.find(episode => episode.id === highlight.episodeId);
              if (!correspondingEpisode) {
                console.error(`No episode found for highlight ${highlight.id} with episodeId ${highlight.episodeId}`);
                return null;
              }

              return (
                <HighlightTicket 
                  key={highlight.id} 
                  highlight={highlight} 
                  episode={correspondingEpisode} 
                  thumbnailUrl={correspondingEpisode.thumbnailUrl} 
                  onOpenFullScreen={() => openFullScreen(index)}
                  isFullScreenMode={false}
                />
              );
            })
          ) : (
            <Text>No highlights available</Text>
          )}
        </HStack>
      </Box>
    </>
  );
};

export default Highlights;
