import React from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Tag,
  IconButton,
  useColorMode,
  useBreakpointValue,
  Icon,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";

const Episode = ({ episode }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Flex
      p={4}
      mt={4}
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
          boxSize={isMobile ? "90px" : "125px"}
          src={episode.thumbnail}
          borderRadius="10%"
          mt={1}
        />
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {episode.name}{" "}
          {episode.isExplicit && (
            <Tag
              size="sm"
              colorScheme="red"
              fontSize={isMobile ? "10px" : "sm"}
            >
              Explicit
            </Tag>
          )}
        </Text>
        {/* Episode Details */}
        <Flex
          direction="column"
          fontSize="sm"
          color={useColorModeValue("gray.500", "gray.400")}
        >
          <Text>{episode.description}</Text>
          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {episode.duration}
          </Text>
          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Release Date: {episode.releaseDate}
          </Text>
          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Play Count: {episode.playCount}
          </Text>
        </Flex>
      </Flex>
      {/* Manage Section */}
      <Flex alignItems="center">
        <Box>
          <Tooltip label="Manage" aria-label="Manage Tooltip">
            <IconButton
              variant="ghost"
              fontSize={isMobile ? "2xl" : "3xl"}
              mr={isMobile ? 1 : 5}
              rounded={"full"}
              opacity={0.7}
              color={colorMode === "dark" ? "white" : "black"}
              aria-label="Manage Episode"
              icon={<Icon as={MdSettings} />}
              onClick={() => console.log(episode.id, episode.name)}
            />
          </Tooltip>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Episode;
