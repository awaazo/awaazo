import { Image, Text, Card, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

// Function to navigate to explore podcast page
// const navigateToExplorePodcast = (podcastId) => {
//   const podcastPage = "/Explore/" + podcastId;
//   window.location.href = podcastPage;
// };

// Component to display a podcast card
const PodcastCard = ({ podcast }) => (
  <NextLink href={`/Explore/${podcast.id}`} passHref>
    <Card
      boxShadow="lg"
      rounded="md"
      overflow="hidden"
      background={"transparent"}
      _hover={{
        transform: "scale(1.07)",
        textDecoration: "none",
      }}
      height={"100%"}
      position="relative" // Ensure the card has a relative position for absolute child positioning
      style={{
        outline: "solid 3px rgba(255, 255, 255, 0.15)",
        borderRadius: "1.5em",
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
            background: `url(${podcast.coverArtUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            borderRadius: "inherit", // Inherit the border radius from the parent
          }}
        />
      </div>
      <Image
        src={podcast.coverArtUrl}
        alt={podcast.title}
        height={{
          base: "150px",
          md: "200px",
          lg: "200px",
        }}
        objectFit={"cover"}
      />
      <Flex direction="column" align="center" p={4}>
        <Text
          fontSize="md"
          fontWeight="bold"
          mb={2}
          data-cy={`podcast-card-${podcast.name}`}
        >
          {podcast.name}
        </Text>
        <Text fontSize="sm" textAlign="center" opacity={"0.6"}>
          {podcast.description.length <= 50
            ? podcast.description
            : podcast.description.slice(0, 50) + "..."}
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
      ></div>
    </Card>
  </NextLink>
);

export default PodcastCard;