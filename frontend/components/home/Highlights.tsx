import { Spinner, VStack, useBreakpointValue, Text, HStack, SimpleGrid } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Highlight } from "../../types/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";



const HighLights: React.FC = () => {
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHighlights = async () => {
            setIsLoading(true);
            try {
                const res = await PodcastHelper.podcastGetHighlights(0, 12);
                if (res.status === 200) {
                    setHighlights(res.highlights);
                } else {
                    throw new Error("Failed to load highlights");
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching highlights");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHighlights();
    }, []);
    
    return (
        <VStack spacing={4} align="stretch">
            {isLoading ? (
                <Spinner size="xl" />
            ) : error ? (
                <Text color="red.500">{error}</Text>
            ) : (
                <HStack
                    spacing={4}
                    overflowX="auto"
                    css={{
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    <SimpleGrid columns={{ base: 3, sm: 4, md: 5, lg: 6, xl: 7 }} spacing={5}>
                        {highlights && highlights.length > 0 ? highlights.map((highlight) => <HighlightTicket key={highlight.id} highlight={highlight} />) : <Text>No highlights available</Text>}
                    </SimpleGrid>
                </HStack>
            )}
        </VStack>
    );
};

export default HighLights;

