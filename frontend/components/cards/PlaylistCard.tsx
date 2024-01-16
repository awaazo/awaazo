import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { convertTime } from "../../utilities/commonUtils";
import { RiPlayList2Fill } from "react-icons/ri";
import Link from "next/link";

const PlaylistCard = ({ playlist }) => {
  return (
    <Flex
      className="hoverEffect"
      p={4}
      mt={3}
      width="100%"
      borderRadius="15px"
      overflow="hidden"
      boxShadow="sm"
      cursor="pointer"
      transition="transform 0.3s"
      _hover={{
        transform: "scale(1.05)",
      }}
    >
      <Flex direction="column" flex={1}>
        <Link href={`/Playlist/${playlist.id}`}>
          <Flex justifyContent="space-between" mb={2} align="center">
            {/* Privacy */}
            <Flex alignItems="center">
              <RiPlayList2Fill size={"25px"} />
              <Text fontWeight="medium" fontSize="xl" ml={2}>
                {playlist.name}
              </Text>
            </Flex>
            {/* Playlist Name */}
            <Text fontWeight="medium" fontSize="sm">
              {playlist.privacy}
            </Text>
          </Flex>
          {/* Playlist Details */}
          <Box fontSize="sm" color="gray.500">
            <Text>{playlist.description}</Text>
            <Flex>
              <Box flex={1}>
                <Text>
                  <strong>Number of Episodes:</strong>{" "}
                  {playlist.numberOfEpisodes}
                </Text>
                <Text>
                  <strong>Duration:</strong> {convertTime(playlist.duration)}
                </Text>
              </Box>
              <Box>
                <Text>
                  <strong>Created At:</strong>{" "}
                  {new Date(playlist.createdAt).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Updated At:</strong>{" "}
                  {new Date(playlist.updatedAt).toLocaleDateString()}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Link>
      </Flex>
    </Flex>
  );
};

export default PlaylistCard;
