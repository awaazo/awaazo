import React, { useRef, useEffect, useState } from "react";
import { Box, IconButton, VStack, Text } from "@chakra-ui/react";
import Slider from "react-slick";
import PodcastTicket from "./PodcastTicket";
import { Episode } from "../../utilities/Interfaces";
import { Podcast } from "../../utilities/Interfaces";
import PodcastHelper from "../../helpers/PodcastHelper";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Component to display recently uploaded podcasts
const RecentlyUploaded: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);

  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1, // Adjust the number of slides to show based on your design
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 600, // Larger mobile devices
        settings: {
          slidesToShow: 2,
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

  useEffect(() => {
    // Fetch recently uploaded podcasts
    PodcastHelper.podcastAllPodcastsGet(0, 12).then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setPodcasts(res.podcasts);
      } else {
        setPodcasts(null);
      }
    });
  }, []);

  useEffect(() => {
    const extractEpisodes = () => {
      const allEpisodesArray: Episode[] = [];
      if (podcasts != null) {
        podcasts.forEach((podcast) => {
          if (podcast.episodes && podcast.episodes.length > 0) {
            allEpisodesArray.push(...podcast.episodes);
          }
        });
      }

      setAllEpisodes(allEpisodesArray);
    };

    extractEpisodes();
  }, [podcasts]);

  // Update slidesToShow based on the length of allEpisodes
  if (allEpisodes.length === 1) {
    settings.slidesToShow = 1;
  } else if (allEpisodes.length === 2) {
    settings.slidesToShow = 2;
  } else if (allEpisodes.length === 3) {
    settings.slidesToShow = 3;
  } else {
    settings.slidesToShow = 4;
  }

  const sliderRef = useRef<Slider>(null);

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <>
      <Box
        w={{ base: "70%", md: "20%" }}
        top={0}
        left={0}
        zIndex={-99}
        borderRadius={"0.5em"}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={"1em"} ml={"0.7em"}>
          Recently Uploaded
        </Text>
      </Box>
      <VStack
        align="start"
        spacing={3}
        p={1}
        m={3}
        flex="1"
        marginBottom={"2em"}
      >
        {allEpisodes && allEpisodes.length > 0 ? (
          <Box
            width="100%"
            position="relative"
            px={{ base: "50px", md: "50px" }}
          >
            <IconButton
              aria-label="Previous"
              icon={<FiChevronLeft />}
              position="absolute"
              left="0"
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              borderRadius={"1.5em"}
              onMouseOver={previous} // Trigger previous slide on hover
            />
            <Slider ref={sliderRef} {...settings}>
              {allEpisodes.map((episode) => (
                <Box
                  key={episode.id}
                  px={2}
                  py={2}
                  display="flex"
                  justifyContent="center"
                  data-cy={`episode-card-${episode.episodeName}`}
                >
                  {/* Assuming PodcastTicket is a valid component */}
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
              borderRadius={"1.5em"}
              onMouseOver={next} // Trigger next slide on hover
            />
          </Box>
        ) : (
          <Text
            style={{
              marginTop: "50px",
              marginBottom: "50px",
              marginLeft: "20px",
            }}
          >
            (No episodes available)
          </Text>
        )}
      </VStack>
    </>
  );
};

export default RecentlyUploaded;
