import React, { useEffect, useState } from "react";
import {
  Box,
  Tag,
  Avatar,
  HStack,
  Flex,
  Tooltip,
  Text,
  Icon,
  Link,
  IconButton,
  useColorModeValue,
  Stack,
  VStack,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

// Here we have used react-icons package for the icon
import { FaPlay } from "react-icons/fa";
import { Podcast, Episode } from "../../../types/Interfaces";
import PodcastHelper from "../../../helpers/PodcastHelper";
import { usePlayer } from "../../../utilities/PlayerContext";

// Define the MyEpisodes component
export default function UserPlaylists({ userId }) {
  const [playlists, setPlaylists] = useState([]);

  // TODO: useEFFECT

  return (
    <>
      {/* Render the heading */}
      <h1
        style={{
          fontSize: "1.5em",
          fontWeight: "bold",
        }}
      >
        Playlists:
      </h1>
      {playlists && playlists.length == 0 ? (
        <Text mt={"50px"} fontSize={"18px"} textAlign={"center"}>
          This user has not created any playlists yet
        </Text>
      ) : (
        <>{/* TODO */}</>
      )}
    </>
  );
}
