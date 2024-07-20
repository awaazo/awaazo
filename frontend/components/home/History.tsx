import React, { useState, useEffect } from 'react';
import { Episode, EpisodeWatchHistory } from '../../types/Interfaces';
import { VStack, Text, Spinner, SimpleGrid } from '@chakra-ui/react';
import PodcastHelper from '../../helpers/PodcastHelper';
import EpisodeCard from '../cards/EpisodeCard';
import { useTranslation } from 'react-i18next';

const UserWatchHistory: React.FC = () => {
  const { t } = useTranslation();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserWatchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await PodcastHelper.getUserWatchHistory(0, 20);
        if (res.status === 200 && res.history) {
            const episodeIds = res.history.map((ewh: EpisodeWatchHistory) => ewh.episodeId);
            const episodesDetails = await Promise.all(
            episodeIds.map((id) => PodcastHelper.getEpisodeById(id))
          );
          setEpisodes(episodesDetails.map((response) => response.episode));
        } else {
          throw new Error(t('home.failedToLoadPodcasts'));
        }
      } catch (err) {
        setError(err.message || t('home.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserWatchHistory();
  }, [t]);

  return (
    <VStack spacing={4} align="stretch">
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <VStack
          spacing={"12px"}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {episodes && episodes.length > 0 ? (
            episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} showLike={true} showComment={true} showMore={true} />
            ))
          ) : (
            <Text>{t('home.noEpisodesAvailable')}</Text>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default UserWatchHistory;