import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useColorMode } from "@chakra-ui/react";

import { AddIcon, DeleteIcon, QuestionOutlineIcon } from "@chakra-ui/icons";

import { MdEdit } from "react-icons/md";

import PodcastOverview from "../../components/explore/PodcastOverview";
import Navbar from "../../components/shared/Navbar";
import PodcastHelper from "../../helpers/PodcastHelper";
import { Podcast } from "../../utilities/Interfaces";
import { useRouter } from "next/router";
import PlayerBar from "../../components/shared/PlayerBar";

export default function MyPodcast() {
  // Get the podcast ID from the link
  const router = useRouter();
  const path = router.asPath;
  const podcastId = path.split("/").pop();

  useEffect(() => {
    console.log(podcastId);
    PodcastHelper.getPodcastById(podcastId).then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setPodcast(res.podcast);
      } else {
        setGetError("Podcasts cannot be fetched");
      }
    });
  }, [podcastId]);
  // Page refs
  const MyPodcastsPage = "/MyPodcasts";
  const CreatePage = "/Create";
  const { colorMode } = useColorMode();

  // Form Values
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [getError, setGetError] = useState("");

  return (
    <>
      <Navbar />
      {podcast && <PodcastOverview podcast={podcast} />}

      {podcast && <PlayerBar {...podcast.episodes[0]} />}
    </>
  );
}
