import React from "react";
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  useBreakpointValue,
  Card,
  Flex,
  Link,
} from "@chakra-ui/react";

// Dummy podcast data
const podcasts = [
  {
    title: "The Daily Education",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,education",
    description: "The Daily Education is a podcast about education.",
  },
  {
    title: "Tech Talk",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,technology",
    description: "Tech Talk is a podcast about technology.",
  },
  {
    title: "History Uncovered",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,history",
    description: "History Uncovered is a podcast about history.",
  },
  {
    title: "Science Explorers",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,science",
    description: "Science Explorers is a podcast about science.",
  },
  {
    title: "Business Insights",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,business",
    description: "Business Insights is a podcast about business.",
  },
  {
    title: "Health and Wellness",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,health",
    description: "Health and Wellness is a podcast about health.",
  },
  {
    title: "Sports Talk",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,sports",
    description: "Sports Talk is a podcast about sports.",
  },
  {
    title: "True Crime Stories",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,truecrime",
    description: "True Crime Stories is a podcast about true crime.",
  },
  {
    title: "Comedy Central",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,comedy",
    description: "Comedy Central is a podcast about comedy.",
  },
  {
    title: "Art and Culture",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,art",
    description: "Art and Culture is a podcast about art.",
  },
  {
    title: "Personal D",
    imageUrl:
      "https://source.unsplash.com/random/300x300?podcast,personaldevelopment",
    description: "Its a podcast about personal development.",
  },
  {
    title: "New Podcast",
    imageUrl: "https://source.unsplash.com/random/300x300?podcast,new",
    description: "New Podcast is a podcast about something new.",
  },
];

const PodcastCard = ({ podcast }) => (
  <Card
    as={Link}
    href="#"
    boxShadow="lg"
    rounded="md"
    overflow="hidden"
    background={"transparent"}
    _hover={{
      transform: "scale(1.05)",
      textDecoration: "none",
    }}
    height={"100%"}
    position="relative" // Ensure the card has a relative position for absolute child positioning
    style={{
      outline: "solid 1px rgba(255, 255, 255, 0.1)",
      borderRadius: "1.2em",
      transition: "all 0.4s ease-in-out",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
    }}
  >
    {/* Background layer */}
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
        borderRadius: "1.2em", // Make sure this matches the borderRadius of the card
      }}
    >
      {/* Dark opacity layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 99,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderRadius: "inherit",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: `url(${podcast.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px)",
          borderRadius: "inherit", // Inherit the border radius from the parent
        }}
      />
    </div>
    <Image
      src={podcast.imageUrl}
      alt={podcast.title}
      height={{
        base: "150px",
        md: "200px",
        lg: "200px",
      }}
      objectFit={"cover"}
    />
    <Flex direction="column" align="center" p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {podcast.title}
      </Text>
      <Text fontSize="sm" textAlign="center" opacity={"0.6"}>
        {podcast.description}
      </Text>
    </Flex>
    {/* button */}
    <div
      style={{
        position: "absolute",
        top: "50%", // Center vertically
        left: "50%", // Center horizontally
        transform: "translate(-50%, 50%)", // This ensures the center of the button is exactly in the middle
        zIndex: 999,
      }}
    >
      <button
        style={{
          backgroundColor: "rgba(30, 215, 96, 0.45)",
          border: "none",
          borderRadius: "1.5rem",
          boxShadow: "0 1px 16px rgba(0, 0, 0, 0.7)",
          cursor: "pointer",
          padding: "0.4em 2em 0.4em 2em",
          backdropFilter: "blur(10px)",
          outline: "2px solid rgba(255, 255, 255, .5)",
        }}
      >
        View
      </button>
    </div>
  </Card>
);

const ForYou: React.FC = () => {
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 6 });

  return (
    <>
      <Box
        bgGradient="linear(to-r, #6a39c4, transparent)"
        w={{ base: "70%", md: "20%" }}
        top={0}
        left={0}
        zIndex={-99}
        borderRadius={"0.5em"}
        boxShadow={"lg"}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={"1em"} ml={"0.7em"}>
          Podcasts For You
        </Text>
      </Box>
      <SimpleGrid columns={columns} spacing={7} marginBottom={"4em"}>
        {podcasts.map((podcast, index) => (
          <PodcastCard key={index} podcast={podcast} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default ForYou;
