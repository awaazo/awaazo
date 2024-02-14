import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";

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
