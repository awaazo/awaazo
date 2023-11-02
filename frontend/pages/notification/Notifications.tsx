import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, List, ListItem, Avatar, Button, HStack, IconButton, Select, Badge } from '@chakra-ui/react';
import Navbar from '../../components/shared/Navbar';
import { UserEpisodeInteraction, User, Episode } from '../../utilities/Interfaces';
import { FaPlay, FaCheck, FaList, FaPlus } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';



const Notifications = () => {
   
   const [notifications, setNotifications] = useState<(UserEpisodeInteraction | User)[]>([]);
   const [episodes, setEpisodes] = useState<Episode[]>([]);
   const [filter, setFilter] = useState<'all' | 'episode' | 'user'>('all');
   const [sortByDate, setSortByDate] = useState(false);
   const [notificationSettings, setNotificationSettings] = useState({
      channels: 'in-app', // default to in-app notifications
      followedPodcasts: [] // an array of podcast IDs the user follows
   });
 
   const episodeInteractions = notifications.filter((notification): notification is UserEpisodeInteraction => 
    'episodeId' in notification && notificationSettings.followedPodcasts.includes(notification.episodeId)
   );
   const sortedEpisodeInteractions = sortByDate 
    ? [...episodeInteractions].sort((a, b) => a.dateListened.getTime() - b.dateListened.getTime())
    : [...episodeInteractions].sort((a, b) => b.dateListened.getTime() - a.dateListened.getTime());


  const userNotifications = notifications.filter((notification): notification is User => 'username' in notification);
  // Fetch notifications (replace with real API call)
  useEffect(() => {
   // Simulate fetching data from an API
   setEpisodes([
    {
      id: 'episode_777',
      podcastId: 'podcast_1',
      podcaster: 'Elon Musk',
      coverArt: "https://d.newsweek.com/en/full/1962972/spacex-owner-tesla-ceo-elon-musk.jpg",
      episodeName: 'Sample Episode',
      description: 'This is a sample episode description.',
      duration: 60,
      releaseDate: new Date(),
      likes: {
        count: 10,
        isLiked: false,
      },
      comments: {
        count: 5,
        isCommented: false,
      },
      annotations: [],
      sponsors: [],
    },
    {
      id: 'episode_888',
      podcastId: 'podcast_2',
      podcaster: "Oprah Winfrey",
      coverArt: "https://www.amacad.org/sites/default/files/person/headshots/oprah.jpg",
      episodeName: 'Another Sample Episode',
      description: 'This is another sample episode description.',
      duration: 90,
      releaseDate: new Date(),
      likes: {
        count: 104,
        isLiked: false,
      },
      comments: {
        count: 5,
        isCommented: false,
      },
      annotations: [],
      sponsors: [],
    },
    {
      id: 'episode_999',
      podcastId: 'podcast_3',
      podcaster: 'John Doe',
      coverArt: 'path_to_cover_art',
      episodeName: 'Yet Another Sample Episode',
      description: 'This is yet another sample episode description.',
      duration: 120,
      releaseDate: new Date(),
      likes: {
        count: 104,
        isLiked: false,
      },
      comments: {
        count: 5,
        isCommented: false,
      },
      annotations: [],
      sponsors: [],
    },
    // ... add more episodes as needed
  ]);
   setNotifications([
     {
      id: 'episode_1',
      userId: '666',
      episodeId: '777',
      hasListened: false,
      lastListenedPosition: 23,
      dateListened: new Date(),
     },
     {
      id: 'user_1',
      username: 'john_doe',
      displayName: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'hashed_password',
      salt: 'salt',
      avatar: 'path_to_avatar',
      interests: ['music', 'podcasts'],
      dateOfBirth: new Date(),
      gender: 'male',
      isPodcaster: false,
    },
    {
      id: 'interaction_1',
      userId: 'user_1',
      episodeId: 'episode_1',
      hasListened: true,
      lastListenedPosition: 10,
      dateListened: new Date(),
    },

     
   ]);
 }, []);
 
 

 return (
  <>
    <Navbar />
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh" width="100%">
      <VStack spacing={5} align="center" p={5} bg="gray.700" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold">Notifications</Text>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
           <option value="all">All Notifications</option>
           <option value="episode">Episode Interactions</option>
           <option value="user">User Notifications</option>
        </Select>
        <Button onClick={() => setSortByDate(!sortByDate)}>
           Sort by {sortByDate ? 'Oldest' : 'Newest'}
        </Button>
          <List spacing={4} width="100%" maxHeight="50vh" overflowY="auto">
            {episodes.map((episode, index) => (
                <ListItem key={index} bg="gray.600" p={4} borderRadius="md" boxShadow="sm">
                    <HStack spacing={4} width="100%">
                        <Avatar src={episode.coverArt} />
                        <VStack align="start" spacing={1} flex="1"> {/* Added flex="1" here */}
                            <Text color="blue.400" fontWeight="bold">{episode.podcaster}</Text>
                            <Text fontWeight="bold">{`New episode: ${episode.episodeName}`}</Text>
                            <Text fontSize="sm" color="gray.400">{`Released: ${formatDistanceToNow(episode.releaseDate)} ago`}</Text>
                            <HStack>
                                <Badge colorScheme="green">{`${episode.duration} minutes`}</Badge>
                                <Badge colorScheme="red">{`${episode.likes.count} likes`}</Badge>
                            </HStack>
                        </VStack>
                        <HStack spacing={4}> {/* Enclosed buttons in an HStack */}
                            <IconButton 
                                icon={<FaPlay />} 
                                aria-label="Play episode" 
                                colorScheme="blue" 
                                _hover={{ bg: "blue.600" }} 
                                _active={{ bg: "blue.700" }}
                            />
                            <IconButton 
                                icon={<FaList />} 
                                aria-label="Play List" 
                                colorScheme="blue" 
                                _hover={{ bg: "blue.600" }} 
                                _active={{ bg: "blue.700" }}
                            />
                        </HStack>
                    </HStack>
                </ListItem>
            ))}
        </List>

      </VStack>
    </Box>
  </>
);
};

export default Notifications;
