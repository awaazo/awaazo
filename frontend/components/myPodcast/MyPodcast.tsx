import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Tooltip,
  useDisclosure,
  useBreakpointValue,
  Text,
  VStack,
  Wrap,
  WrapItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  Icon,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Link,
  List,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import AddEpisodeForm from "./AddEpisodeForm";
import PodcastInfo from "./PodcastInfo";

export default function MyPodcast({ podcastId }) {
  return (
    <>
      <Box
        p={4}
        mt={"2em"}
        borderWidth="1px"
        borderRadius="1em"
        padding={"1.5em"}
        bg="rgba(255, 255, 255, 0.05)"
        backdropFilter={"blur(50px)"}
        dropShadow={" 0px 4px 4px rgba(0, 0, 0, 0.35)"}
        minHeight={"200px"}
      >
        <Tabs isFitted width={"100%"}>
          <TabList mb="1em" width={"30%"}>
            <Tab>Podcast Info</Tab>
            <Tab>Add Episode</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <List>
                <PodcastInfo podcastId={podcastId} />
              </List>
            </TabPanel>
            <TabPanel>
              <List>
                <AddEpisodeForm podcastId={podcastId} />
              </List>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
