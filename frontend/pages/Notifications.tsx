import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, List, ListItem, Avatar, Button, HStack, IconButton } from '@chakra-ui/react';
import Navbar from '../components/shared/Navbar';
import { UserEpisodeInteraction, User } from '../utilities/Interfaces';
import { FaPlay, FaCheck } from 'react-icons/fa';

const Notifications = () => {
   const [notifications, setNotifications] = useState<(UserEpisodeInteraction | User)[]>([]);
  // Fetch notifications (replace with real API call)
  useEffect(() => {
   // Simulate fetching data from an API
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
         <List spacing={3} width="100%">
           {notifications.map((notification, index) => {
             if ('episodeId' in notification) {
               // This is a UserEpisodeInteraction notification
               return (
                 <ListItem key={index} bg="gray.600" p={4} borderRadius="md" boxShadow="sm">
                   <HStack spacing={4}>
                     <Avatar /> {/* Placeholder Avatar, replace with episode's coverArt when available */}
                     <Text flex={1}>
                       {notification.hasListened
                         ? `You listened to episode ${notification.episodeId} on ${notification.dateListened?.toLocaleDateString()}`
                         : `You haven't listened to episode ${notification.episodeId} yet.`}
                     </Text>
                     <IconButton icon={<FaPlay />} aria-label="Play episode" colorScheme="blue" />
                     {notification.hasListened && <IconButton icon={<FaCheck />} aria-label="Mark as listened" colorScheme="green" />}
                   </HStack>
                 </ListItem>
               );
             } else if ('username' in notification) {
               // This is a User notification
               return (
                 <ListItem key={index} bg="gray.600" p={4} borderRadius="md" boxShadow="sm">
                   <HStack spacing={4}>
                     <Avatar src={notification.avatar} />
                     <Text flex={1}>{`Hello, ${notification.displayName}! Check out new episodes based on your interests.`}</Text>
                   </HStack>
                 </ListItem>
               );
             }
           })}
         </List>
       </VStack>
     </Box>
   </>
 ); 
};

export default Notifications;
