import React, { useState } from "react";
import { Text } from "@chakra-ui/react";

export default function UserPlaylists({ userId }) {
  const [playlists, setPlaylists] = useState([]);

  return (
    <>
      {/* Render the heading */}
      <Text fontSize="1.5em" fontWeight="bold">
        Playlists:
      </Text>
      {playlists && playlists.length === 0 ? (
        <Text mt={"50px"} fontSize={"18px"} textAlign={"center"}>
          This user has not created any playlists yet
        </Text>
      ) : (
        <>{/* TODO */}</>
      )}
    </>
  );
}
