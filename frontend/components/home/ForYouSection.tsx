import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import PodcastTicket from "./PodcastTicket";
import { Episode } from "../../utilities/Interfaces";

const ForYouSection: React.FC<{ episodes: Episode[] }> = ({ episodes }) => {
  return (
    <VStack align="start" spacing={4} p={4} m={3} width="100%" flex="1" borderRadius="25px" backdropFilter="blur(35px)" boxShadow="xl">
     <Text fontSize="xl" fontWeight="bold" ml={3} position="sticky">For You</Text>
    {episodes?.map(episode => <PodcastTicket key={episode.id} episode={episode} />)}
  </VStack>
  );
};

export default ForYouSection;
