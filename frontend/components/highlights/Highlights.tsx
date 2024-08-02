import { Spinner, Text, HStack, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import HighlightTicket from "./HighlightTicket";
import HighlightHelper from "../../helpers/HighlightHelper";
import FullScreenHighlight from "./FullScreenHighlight";
import PodcastHelper from "../../helpers/PodcastHelper";
import { useTranslation } from 'react-i18next';


const Highlights = () => {
  const { t } = useTranslation();
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await PodcastHelper.podcastGetRecentEpisodes(0, 20); 
        if (response && response.episode) {
          setEpisodes(response.episode);
        } else {
          throw new Error('Failed to fetch episodes');
        }
      } catch (error) {
        console.error('Error fetching episodes:', error);
        setError('Failed to fetch episodes'); 
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
                  onOpenFullScreen={() => openFullScreen(index)}
                  isFullScreenMode={false}
                />
              );
            })
          ) : (
            <Text>t('highlight.not_available')</Text>
          )}
        </HStack>
      </Box>
    </>
  );
};

export default Highlights;
