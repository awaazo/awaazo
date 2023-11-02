import React, { useRef } from "react";
import { Box, IconButton, VStack, Text } from "@chakra-ui/react";
import Slider from "react-slick";
import PodcastTicket from "./PodcastTicket";
import { Episode } from "../../utilities/Interfaces";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Slick carousel settings
const settings = {
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 4, // Adjust the number of slides to show based on your design
  slidesToScroll: 2,
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

const RecentlyUploaded: React.FC<{ episodes: Episode[] }> = ({ episodes }) => {
  const sliderRef = useRef<Slider>(null);

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb={3}>
        Recently Uploaded
      </Text>
      <VStack align="start" spacing={3} p={1} m={3} flex="1">
        <Box width="100%" position="relative" px={{ base: "50px", md: "50px" }}>
          <IconButton
            aria-label="Previous"
            icon={<FiChevronLeft />}
            position="absolute"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onMouseOver={previous} // Trigger previous slide on hover
          />
          <Slider ref={sliderRef} {...settings}>
            {episodes?.map((episode) => (
              <Box
                key={episode.id}
                px={2}
                py={2}
                display="flex"
                justifyContent="center"
              >
                <PodcastTicket episode={episode} />
              </Box>
            ))}
          </Slider>
          {/* Custom Next Arrow */}
          <IconButton
            aria-label="Next"
            icon={<FiChevronRight />}
            position="absolute"
            right="-4"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onMouseOver={next} // Trigger next slide on hover
            // Add additional styling as needed
          />
        </Box>
      </VStack>
    </>
  );
};

export default RecentlyUploaded;
