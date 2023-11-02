import React from "react";
import { Box, VStack } from "@chakra-ui/react";
import Slider from "react-slick";
import PodcastTicket from "./PodcastTicket";
import { Episode } from "../../utilities/Interfaces";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Slick carousel settings
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4, // Adjust the number of slides to show based on your design
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 600, // Larger mobile devices
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: function (index) {
          const slider = document.querySelector(".slick-list") as HTMLElement; // Type assertion
          if (slider) {
            slider.style.height = `${slider.offsetWidth}px`; // Now TypeScript knows slider is an HTMLElement
          }
        },
      },
    },
  ],
};

const ForYouSection: React.FC<{ episodes: Episode[] }> = ({ episodes }) => {
  return (
    <VStack align="start" spacing={4} p={4} m={3} flex="1">
      <Box width="100%">
        <Slider {...settings}>
          {episodes?.map((episode) => (
            <Box
              key={episode.id}
              px={4}
              py={2}
              display="flex"
              justifyContent="center"
            >
              <PodcastTicket episode={episode} />
            </Box>
          ))}
        </Slider>
      </Box>
    </VStack>
  );
};

export default ForYouSection;
