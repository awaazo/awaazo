import React, { useState, useEffect } from "react";
import PodcastOverview from "../../components/explore/PodcastOverview";
import PodcastHelper from "../../helpers/PodcastHelper";
import type { Podcast, UserMenuInfo } from "../../types/Interfaces";
import { useRouter } from "next/router";


export default function Podcast() {
  const router = useRouter();
  const path = router.asPath;
  const podcastId = path.split("/").pop();

  useEffect(() => {
    console.log(podcastId);
    PodcastHelper.getPodcastById(podcastId).then((res) => {
      if (res.status == 200) {
        setPodcast(res.podcast);
      } else {
        setGetError("Podcasts cannot be fetched");
      }
    });
  }, [podcastId]);

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [getError, setGetError] = useState("");
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);

  return (
    <>
      {podcast  && <PodcastOverview podcast={podcast}  User={user}/>}
    </>
  );
}
