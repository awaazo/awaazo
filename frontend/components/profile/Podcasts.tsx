import { useState } from "react";
import {
  Box,
  Avatar,
  Button,
  Link,
  Stack,
  Grid,
  useBreakpointValue,
} from "@chakra-ui/react";

const podcasts = [
  {
    id: 1,
    tags: ["News", "Product", "AI Generated"],
    title: "Modern UI with Chakra UI",
    description: `A podcast discussing modern user interface designs and development.`,
    podcastImage:
      "https://d.newsweek.com/en/full/1962972/spacex-owner-tesla-ceo-elon-musk.jpg",
  },
  {
    id: 2,
    tags: ["Web Development", "Video", "AI Generated"],
    title: "Ruby on Rails Deep Dive",
    description: `Exploring the depths of Ruby on Rails and its features.`,
    podcastImage:
      "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
  },
  {
    id: 3,
    tags: ["Web Development", "Audio", "AI Generated"],
    title: "The Future of Web",
    description: `Predictions and discussions about the future of web development.`,
    podcastImage:
      "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
  },
  {
    id: 4,
    tags: ["Web Development", "Audio", "AI Generated"],
    title: "The Future of Web",
    description: `Predictions and discussions about the future of web development.`,
    podcastImage:
      "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
  },
  {
    id: 5,
    tags: ["Web Development", "Audio", "AI Generated"],
    title: "The Future of Web",
    description: `Predictions and discussions about the future of web development.`,
    podcastImage:
      "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
  },
];

export default function Podcasts({ childToParent }) {
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 3 });

  // State to maintain the selected podcast ID
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);
  // const [subscribed, setSubscribe] = useState(false);

  let subscribed = false;
  let subscribedText = "Subscribe";

  function setSubscribe() {
    // if (!subscribed){
    //   subscribed = true;
    //   subscribedText = "Subscribe";
    // } else {
    //   subscribed = false;
    //   subscribedText = "UnSubscribe";
    // }
  }

  return (
    <>
      <h1
        style={{
          marginBottom: "1em",
          fontSize: "1.5em",
          fontWeight: "bold",
        }}
      >
        My Podcasts
      </h1>
      <Grid
        templateColumns={`repeat(${columns}, 1fr)`}
        gap={6}
        placeItems="center"
      >
        {podcasts.map((podcast, index) => (
          <Stack spacing={4} direction="column" align="center">
            <Link key={index} href="#" _hover={{ textDecoration: "none" }}>
              <Box
                position="relative"
                display="inline-block"
                onClick={() => {
                  childToParent(podcast.id); //Pass the podcast ID to MyProfile
                  setSelectedPodcastId(podcast.id); // Set the selected podcast ID
                }}
                // Conditionally put styling if the podcast is selected
                borderWidth={podcast.id === selectedPodcastId ? "3px" : "0"}
                borderColor="white"
                borderRadius="100em"
                shadow={podcast.id === selectedPodcastId ? "xl" : "none"}
                cursor="pointer"
              >
                {/* Main Avatar */}
                <Avatar
                  size="2xl"
                  title={podcast.title}
                  src={podcast.podcastImage}
                  _hover={{ opacity: 0.7, outline: "solid 3px #FFFFFF" }}
                />
                {/* Shadow Avatar */}
                <Avatar
                  outline={"solid 1px #CC748C"}
                  size="1xl"
                  title={podcast.title}
                  src={podcast.podcastImage}
                  boxShadow="0 0 20px rgba(0, 0, 0, 0.9)"
                  filter="blur(10px)"
                  position="absolute"
                  top="2%"
                  left="0%"
                  zIndex="-1"
                />
              </Box>
            </Link>
            <Button
              colorScheme="blue"
              onClick={() => {
              }}
            >
              {"Edit"}
            </Button>
          </Stack>
        ))}
      </Grid>
    </>
  );
}
