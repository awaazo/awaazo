import { VStack } from "@chakra-ui/react";
import react, { useEffect, useState } from "react";
import { Podcast } from "../../types/Interfaces";
import PaymentHelper from "../../helpers/PaymentHelper";
import PodcastCard from "../cards/PodcastCard";
import WalletPodcastCard from "../cards/WalletPodcastCard";

const MostGiftedPodcast = () => {
  const [podcast, setPodcast] = useState<Podcast[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 3;

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await PaymentHelper.GetHighestEarningPodcast(
          page,
          pageSize
        );
        if (response.status == 200) {
          setPodcast(response.podcasts);
        } else {
          console.log("Error occured");
        }
      } catch (error) {
        console.log("Error Occured");
      }
    };
    fetchPodcast();
  }, [page]);
  return (
    <VStack spacing="4">
      {podcast.map((element) => {
        return <WalletPodcastCard podcast={element} />;
      })}
    </VStack>
  );
};
export default MostGiftedPodcast;
