import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import RecentlyUploaded from "./RecentlyUploaded";
import ForYou from "./ForYou";
import HighLights from "../highlights/Highlights";
import { any } from "cypress/types/bluebird";

const Home = () => {

 
  return (
    <Box px={["1em", "2em", "4em"]} minH="100vh">
      <Box mb={4}>
        <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
          Recently Uploaded
        </Text>
        <RecentlyUploaded />
      </Box>
      <Box mb={4}>
        <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
          Podcasts For You
        </Text>
        <ForYou />
      </Box>
      <Box mb={4}>
        <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
          Podcasts Highlights
        </Text>
        <HighLights />
      </Box>
    </Box>
  );
};

export default Home;
