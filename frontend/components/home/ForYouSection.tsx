import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import PodcastTicket from "./PodcastTicket";
import { Episode } from "../../utilities/Interfaces";

const ForYouSection: React.FC<{ episodes: Episode[] }> = ({ episodes }) => {
  return (
    <VStack align="start" spacing={4} p={4} m={3} flex="1">
      <Box  width="100%">
        <VStack spacing={4}>
          {episodes?.map(episode => <PodcastTicket key={episode.id} episode={episode} />)}
        </VStack>
      </Box>
      
    </VStack>
  );
};

export default ForYouSection;
