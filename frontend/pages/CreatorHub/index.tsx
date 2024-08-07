import { useState, useEffect } from "react";
import { Box, Flex, IconButton, Tooltip, useBreakpointValue, Text, VStack, Image, Wrap, Spinner } from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import MyPodcast from "../../components/CreatorHub/MyPodcast";
import { UserMenuInfo, Podcast } from "../../types/Interfaces";
import AuthHelper from "../../helpers/AuthHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import Link from "next/link";
import withAuth from "../../utilities/authHOC";
import { useTranslation } from 'react-i18next'; // Importing useTranslation

const Creatorhub = () => {
  const { t } = useTranslation(); // Initialize translation

  // Page refs
  const loginPage = "/auth/Login";

  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const [createError, setCreateError] = useState("");
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isLoading, setIsLoading] = useState(false);

  const togglePodcastDetail = (id) => {
    if (selectedPodcastId === id) {
      setSelectedPodcastId(null);
    } else {
      setSelectedPodcastId(id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const authResponse = await AuthHelper.authMeRequest();
        if (authResponse.status === 200) {
          setUser(authResponse.userMenuInfo);
          const podcastsResponse = await PodcastHelper.podcastMyPodcastsGet(page, pageSize);
          if (podcastsResponse.status === 200) {
            setPodcasts((prevPodcasts) => [...prevPodcasts, ...podcastsResponse.myPodcasts]);
            setSelectedPodcastId(podcastsResponse.myPodcasts.length > 0 ? podcastsResponse.myPodcasts[0].id : null);
          } else {
            setCreateError(t('home.fetchError')); // Using translation for error message
          }
        }
      } catch (error) {
        console.error("Error during data fetching", error);
        setCreateError(t('home.fetchError')); // Using translation for error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1);
  };

  return (
    <>
      <Flex direction="column" align="center" justify="center" px={["1em", "2em", "4em"]} py={4}>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {t('creatorhub.title')} {/* Using translation for the title */}
        </Text>
      </Flex>
      <Box px={["1em", "2em", "4em"]} pt={6}>
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" height="100px">
            <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
          </Flex>
        ) : createError ? (
          <Text color="red.500" textAlign="center">
            {createError}
          </Text>
        ) : (
          <>
            <Flex direction="row" wrap="wrap" justifyContent="center" alignItems="center">
              <Wrap spacing={6}>
                {podcasts.map((podcast) => (
                  <VStack key={podcast.id} spacing={2} onClick={() => togglePodcastDetail(podcast.id)} align="center">
                    <Box position="relative" boxSize="150px">
                      <Image
                        borderRadius="15px"
                        boxSize="150px"
                        objectFit="cover"
                        src={podcast.coverArtUrl}
                        alt={podcast.name}
                        boxShadow={selectedPodcastId === podcast.id ? "0 0 10px 2px #FF6A5F" : "none"}
                        cursor="pointer"
                        data-cy={`podcast-image-${podcast.name.replace(/\s+/g, "-").toLowerCase()}`}
                      />
                    </Box>

                    <Text fontSize="lg">{podcast.name.length > 18 ? `${podcast.name.substring(0, 18)}...` : podcast.name}</Text>
                  </VStack>
                ))}
                <Link href="/CreatorHub/CreatePodcast" passHref>
                  <Flex direction="column" alignItems="center" borderRadius="1em" cursor="pointer" outline="none" p={2} m={2} bg="transparent">
                    <Box boxSize="100px" borderRadius="2em" border="2px dashed gray" display="flex" alignItems="center" justifyContent="center">
                      <AddIcon w={10} h={10} />
                    </Box>
                    <Text mt={2}>{t('creatorhub.addPodcast')}</Text> {/* Using translation for button text */}
                  </Flex>
                </Link>
              </Wrap>
            </Flex>
            {podcasts[(page + 1) * pageSize - 1] != null && (
              <Flex justify="center" mt={4}>
                <Tooltip label={t('loadMore')} placement="top"> {/* Using translation for tooltip */}
                  <IconButton aria-label={t('loadMore')} icon={<ChevronDownIcon />} onClick={handleLoadMoreClick} size="lg" variant="outline" />
                </Tooltip>
              </Flex>
            )}

            {selectedPodcastId !== null && <MyPodcast podcastId={selectedPodcastId} />}
          </>
        )}
      </Box>
    </>
  );
};

export default withAuth(Creatorhub);
