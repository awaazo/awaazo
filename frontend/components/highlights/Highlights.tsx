import { Spinner, Text, HStack, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import HighlightTicket from "./HighlightTicket";
import HighlightHelper from "../../helpers/HighlightHelper";

const Highlights = ({ episodeId }) => {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHighlights() {
      if (!episodeId) {
        // If no episodeId is provided, don't attempt to fetch highlights
        setError("No episode selected");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Assuming getEpisodeHighlights returns an array of highlight objects
        const response = await HighlightHelper.getEpisodeHighlights(episodeId);
        // Update based on actual response structure:
        setHighlights(response); // This might need adjustment depending on your API response structure
        setError(""); // Clear any previous error
      } catch (err) {
        setError("Failed to fetch highlights");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHighlights();
  }, [episodeId]); // Re-fetch when episodeId changes

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
          highlights.map((highlight) => (
            <HighlightTicket key={highlight.id} highlight={highlight} fetchHighlights={function (): void {
                  throw new Error("Function not implemented.");
              } } />
          ))
        ) : (
          <Text>No highlights available</Text>
        )}
      </HStack>
    </Box>
  );
};

export default Highlights;
