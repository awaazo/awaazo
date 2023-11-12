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

const Reviews = ({ podcast }) => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <VStack align="start" spacing={4}>
      {podcast.ratings &&
        podcast.ratings.map((rating) => (
          <Box
            key={rating.id}
            w="100%"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
          >
            <HStack justify="space-between" align="center">
              <Text color="gray.500">{rating.userId}</Text>
              <Text color="gray.500">{rating.rating}</Text>
              <Text color="gray.500">{rating.review}</Text>
            </HStack>
            <Text mt={2}>{rating.text}</Text>
            {/* Include other components or information related to the rating */}
          </Box>
        ))}
    </VStack>
  );
};

export default Reviews;
