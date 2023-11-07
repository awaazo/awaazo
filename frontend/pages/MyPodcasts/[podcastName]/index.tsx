import { useRouter } from "next/router";

import Navbar from "../../../components/shared/Navbar";
import PodcastManager from "../../../components/myPodcast/PodcastManager";

const PodcastManageScreen = () => {
  const router = useRouter();
  const { podcastName } = router.query;

  return (
    <>
      <Navbar />
      <PodcastManager name={podcastName} />
    </>
  );
};

export default PodcastManageScreen;
