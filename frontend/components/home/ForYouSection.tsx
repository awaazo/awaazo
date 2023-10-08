import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import PodcastTicket from "./PodcastTicket";
import { Podcast } from "../../utilities/Types";

interface ForYouProps {
  podcasts: Podcast[];
}

const ForYouSection: React.FC<ForYouProps> = ({ podcasts }) => {
  return (
    <VStack align="start" spacing={4} p={4} m={3} width="100%" flex="1" borderRadius="25px" backdropFilter="blur(35px)" boxShadow="xl">
      <Text fontSize="xl" fontWeight="bold" ml={3} position="sticky">
        For You
      </Text>
      {podcasts.map((podcast) => (
        <PodcastTicket key={podcast.episodeName} coverArt={podcast.coverArt} episodeName={podcast.episodeName} podcaster={podcast.podcaster} duration={podcast.duration} likes={podcast.likes} comments={podcast.comments} isPlaying={podcast.isPlaying} />
      ))}
    </VStack>
  );
};

export default ForYouSection;
