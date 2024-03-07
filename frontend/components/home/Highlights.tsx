import { Spinner, VStack, Text, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import HighlightTicket from "./HighlightTicket"; // Ensure this component exists and is imported correctly

// Mock Data for demonstration
const mockHighlights = [
    { id: 1, title: "Highlight 1", description: "This is the first highlight" },
    { id: 2, title: "Highlight 2", description: "This is the second highlight" },
    // Add more mock data as needed
];

const HighLights: React.FC = () => {
    const [highlights, setHighlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHighlights = async () => {
            setIsLoading(true);
            try {
                // Simulate fetching data
                setTimeout(() => {
                    setHighlights(mockHighlights);
                    setIsLoading(false);
                }, 1000); // Simulated network request delay
            } catch (err) {
                setError("An error occurred while fetching highlights");
                setIsLoading(false);
            }
        };

        fetchHighlights();
    }, []);

    if (isLoading) {
        return <Spinner size="xl" />;
    }

    if (error) {
        return <Text color="red.500">{error}</Text>;
    }

    return (
        <VStack spacing={4} align="stretch">
            <Box
                overflowX="auto"
                css={{
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                {highlights && highlights.length > 0 ? (
                    highlights.map((highlight) => (
                        <HighlightTicket key={highlight.id} highlight={highlight} />
                    ))
                ) : (
                    <Text>No highlights available</Text>
                )}
            </Box>
        </VStack>
    );
};

export default HighLights;
