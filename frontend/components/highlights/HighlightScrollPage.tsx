// pages/highlightScroll/[episodeId].jsx

import React, {useState} from 'react';
import { Box, VStack, useBreakpointValue, Text } from '@chakra-ui/react';
import HighlightTicket from '../highlights/HighlightTicket';

const HighlightScrollPage = ({ highlights }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
   const [episodes, setEpisodes] = useState([]);

  return (
    <VStack overflowY="scroll" height="100vh" spacing={0}>
      {highlights.length > 0 ? (
          highlights.map((highlight) => {
            const correspondingEpisode = episodes.find(episode => episode.id === highlight.episodeId);
            if (!correspondingEpisode) {
              console.error(`No episode found for highlight ${highlight.id} with episodeId ${highlight.episodeId}`);
              return null;
            }

            return (
              <HighlightTicket key={highlight.id} highlight={highlight} episode={correspondingEpisode} thumbnailUrl={correspondingEpisode.thumbnailUrl} onOpenFullScreen={undefined} isFullScreenMode={undefined}/>
            );
          })
        ) : (
          <Text>No highlights available</Text>
        )}
    </VStack>
  );
};

export async function getStaticProps(context) {

  const res = await fetch('http://localhost:32773/podcast/GetRandomHighlights?quantity=20');
  const highlights = await res.json();

  return { props: { highlights } };
}

export default HighlightScrollPage;
