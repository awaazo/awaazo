import { Spinner, Text, HStack, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import HighlightTicket from "./HighlightTicket"; // Ensure this component exists and is imported correctly

// Mock Data for demonstration
const mockHighlights = [
    { id: 1, title: "Highlight 1", description: "This is the first highlight" },
    { id: 2, title: "Highlight 2", description: "This is the second highlight" },
    { id: 3, title: "Highlight 3", description: "This is the third highlight" },
    { id: 4, title: "Highlight 4", description: "This is the fourth highlight" },
    { id: 5, title: "Highlight 5", description: "This is the fifth highlight" },
    { id: 6, title: "Highlight 6", description: "This is the sixth highlight" },
    { id: 7, title: "Highlight 7", description: "This is the seventh highlight" },
    { id: 8, title: "Highlight 8", description: "This is the eighth highlight" },
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
        <Box overflowX="auto" css={{ width: "100%", maxWidth: "2100px", "&::-webkit-scrollbar": { display: "block" } }}>
            <HStack spacing={4} align="stretch" css={{ width: "fit-content" }}>
                {highlights && highlights.length > 0 ? (
                    highlights.map((highlight) => (
                        <HighlightTicket key={highlight.id} highlight={highlight} />
                    ))
                ) : (
                    <Text>No highlights available</Text>
                )}
            </HStack>
        </Box>
    );    
};

export default HighLights;
