import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  IconButton,
  Tag,
  MenuGroup,
  Tooltip,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  useBreakpointValue,
  Text,
  Icon,
  Button,
  Collapse,
  SimpleGrid,
  VStack,
  Image,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

import { FaPlay } from "react-icons/fa";
import PlayingBar from "../player/PlayingBar";
import PodcastHelper from "../../helpers/PodcastHelper";
import LikeComponent from "../social/likeComponent";
import CommentComponent from "../social/commentComponent";

const Episode = ({ episode, onSelectEpisode }) => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Flex
      className="hoverEffect"
      paddingTop={5}
      paddingBottom={5}
      mt={3}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      style={{ cursor: "pointer", transition: "transform 0.3s" }}
      onClick={() => onSelectEpisode(episode)}
    >
      <Box position="relative" mr={5}>
        <Image
          boxSize={isMobile ? "0px" : "125px"}
          src={episode.thumbnailUrl}
          borderRadius="10%"
          marginLeft={isMobile ? "0px" : "20px"}
          mt={1}
        />
        {!isMobile && (
          <IconButton
            aria-label="Play"
            icon={<FaPlay />}
            position="absolute"
            left="60%"
            top="50%"
            transform="translate(-50%, -50%)"
            variant="ghost"
            fontSize="25px"
            shadow={"md"}
            _hover={{ boxShadow: "lg" }}
          />
        )}
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {episode.episodeName}
          {episode.isExplicit && (
            <Tag
              size="sm"
              colorScheme="red"
              fontSize={isMobile ? "10px" : "sm"}
            >
              Explicit
            </Tag>
          )}
          <Text fontSize={isMobile ? "md" : "md"}>🎧 {episode.playCount}</Text>
        </Text>
        {/* Episode Details */}
        <Flex
          direction="column"
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
        >
          {isMobile ? null : <Text>{episode.description}</Text>}

          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {formatDuration(episode.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex alignItems="flex-start" style={{ marginRight: "15px" }}>
        <CommentComponent
          episodeIdOrCommentId={episode.id}
          initialLikes={episode.comments.length}
          initialIsLiked={false}
        />
        <div style={{ marginTop: "4px", marginLeft: "4px" }}>
          <LikeComponent
            episodeOrCommentId={episode.id}
            initialLikes={episode.likes}
            initialIsLiked={false}
          />
        </div>
      </Flex>
    </Flex>
  );
};

export default Episode;
