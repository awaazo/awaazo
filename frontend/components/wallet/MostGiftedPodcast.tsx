import  { useEffect, useState } from "react";
import { Flex, IconButton, Tooltip, VStack } from "@chakra-ui/react";
import { Podcast } from "../../types/Interfaces";
import PaymentHelper from "../../helpers/PaymentHelper";
import WalletPodcastCard from "../cards/WalletPodcastCard";
import { ChevronDownIcon } from "@chakra-ui/icons";

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

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1);
  };
  return (
    <>
      <VStack spacing="4">
        {podcast.map((element) => {
          return <WalletPodcastCard podcast={element} />;
        })}
      </VStack>
      {podcast[(page + 1) * pageSize - 1] != null && (
        <Flex justify="center" mt={4} alignSelf={"center"}>
          <Tooltip label="Load More" placement="top">
            <IconButton
              aria-label="Load More"
              icon={<ChevronDownIcon />}
              onClick={handleLoadMoreClick}
              size="lg"
              variant="outline"
            />
          </Tooltip>
        </Flex>
      )}
    </>
  );
};
export default MostGiftedPodcast;
