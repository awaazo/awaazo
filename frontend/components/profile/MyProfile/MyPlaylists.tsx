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
import { Podcast, Episode } from "../../../utilities/Interfaces";
import PodcastHelper from "../../../helpers/PodcastHelper";
import { usePlayer } from "../../../utilities/PlayerContext";

// Define the MyEpisodes component
export default function MyPlaylists() {
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
        My Playlists
      </h1>
      {playlists && playlists.length == 0 ? (
        <Text mt={"50px"} fontSize={"18px"} textAlign={"center"}>
          You have not created any playlists yet
        </Text>
      ) : (
        <>{/* TODO */}</>
      )}
    </>
  );
}
