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
  HStack,
  Wrap,
  WrapItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

import PodcastHelper from "../../helpers/PodcastHelper";
import LikeComponent from "../social/likeComponent";
import CommentComponent from "../social/commentComponent";

const Episode = ({ episode }) => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Edit Episode Modal
  //----------------------------------------------------------------------

  // State for managing modal visibility and the current episode
  const [isModalEpisodeOpen, setIsModalEpisodeOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  const openEditEpisodeModal = (episode) => {
    setCurrentEpisode(episode);
    setIsModalEpisodeOpen(true);
  };
  const closeEditEpisodeModal = () => {
    setIsModalEpisodeOpen(false);
    setCurrentEpisode(null);
  };
  //----------------------------------------------------------------------

  // For delete pop up
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setDeleting] = useState(false);

  // Form errors
  const [episodeError, setEpisodeError] = useState("");
  // Handle Deletion of podcast
  const handleDelete = async (episodeId) => {
    setDeleting(true);
    // Create request object
    const response = await PodcastHelper.deleteEpisode(episode.id);
    console.log(response);
    if (response.status == 200) {
      window.location.reload();
    } else {
      setEpisodeError("Episode cannot be deleted");
    }
    onClose();
    setDeleting(false);
  };

  return (
    <Flex
      paddingTop={5}
      paddingBottom={5}
      mt={3}
      width="100%"
      borderRadius="15px"
      bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
      backdropFilter="blur(4px)"
      boxShadow="sm"
      style={{ cursor: "pointer" }}
      onClick={() => console.log(episode.id, episode.name)}
    >
      <Box position="relative" mr={5}>
        <Image
          boxSize={isMobile ? "0px" : "125px"}
          src={episode.thumbnailUrl}
          borderRadius="10%"
          marginLeft={isMobile ? "0px" : "20px"}
          mt={1}
        />
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
            initialIsLiked={episode.likes}
          />
        </div>
      </Flex>
    </Flex>
  );
};

export default Episode;
