import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useColorMode } from "@chakra-ui/react";

import { AddIcon, DeleteIcon, QuestionOutlineIcon } from "@chakra-ui/icons";

import { MdEdit } from "react-icons/md";
import { PodcastByTagsRequest } from "../../../utilities/Requests";
import Navbar from "../../../components/shared/Navbar";
import PodcastHelper from "../../../helpers/PodcastHelper";
import { Podcast } from "../../../utilities/Interfaces";
import { useRouter } from "next/router";
import PlayerBar from "../../../components/shared/PlayerBar";

export default function MyPodcast() {
  // Get the podcast ID from the link
  const router = useRouter();
  const path = router.asPath;
  const genreName = path.split("/").pop();
  const genreNameArray = [genreName];

  useEffect(() => {
    console.log(genreName);
    const data: PodcastByTagsRequest = {
      tags: genreNameArray,
    };
    PodcastHelper.podcastByTagsPodcastsGet(0, 20, data).then((res) => {
      // If logged in, set user, otherwise redirect to login page
      if (res.status == 200) {
        setPodcast(res.podcasts);
      } else {
        setGetError("Podcasts cannot be fetched");
      }
    });
  }, [genreName]);
  // Page refs
  const MyPodcastsPage = "/MyPodcasts";
  const CreatePage = "/Create";
  const { colorMode } = useColorMode();

  // Form Values
  const [podcast, setPodcast] = useState<Podcast[] | null>(null);
  const [getError, setGetError] = useState("");

  return (
    <>
      <Navbar />
    </>
  );
}
