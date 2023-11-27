import React, { useState, useEffect, FC } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  VStack,
  Text,
  List,
  ListItem,
  Avatar,
  Button,
  HStack,
  IconButton,
  Select,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

import { formatDistanceToNow } from "date-fns";
import NotificationHelper from "../../helpers/NotificationsHelper";
import { Notification, User} from "../../utilities/Interfaces";
import Link from "next/link";
import Pusher from "pusher-js";
import EndpointHelper from "../../helpers/EndpointHelper";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notificationCount: number;
}

const Notifications: FC<NotificationsProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "episode" | "user">("all");
  const [sortByDate, setSortByDate] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await EndpointHelper.getAuthMeEndpoint(); // Call the getAuthMeEndpoint
        if (response && response.id) {
          setUserId(response.id); // Set the user ID from the response
          console.log("User ID:", response.id); // Log the user ID to the console
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []); // Run this effect only once to fetch the user ID

  useEffect(() => {
    if (userId) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      });

      const channel = pusher.subscribe('user-' + userId);
      channel.bind('notification', function(data) {
        // Handle the incoming notification data here
        console.log('Received new notification:', data);
        // You can update the notification state or take other actions based on the incoming data
      });

      return () => {
        // Unsubscribe from the Pusher channel when the component unmounts
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [userId]);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await NotificationHelper.getNotifications();
      if (Array.isArray(response)) {
        setNotifications(response);
      } else {
        console.error("Failed to fetch notifications:", response.message || 'No error message available');
      }
    };
  
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      const response = await NotificationHelper.NotificationCount();
      console.log(response);
      if (response !== null && response !== undefined && typeof response === 'number') {
        setNotificationCount(response);
      } else {
        console.error("Failed to fetch notification count:", response.message || 'No error message available');
      }
    };
  
    fetchNotificationCount();
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    ));
  };

  
  

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(0px)" />
        <ModalContent
          width={"31vw"}
          maxW={"100vw"} 
          boxShadow="dark-lg"
          backdropFilter="blur(40px)"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginTop={"10%"}
          padding={"2em"}
          borderRadius="xl"
          backgroundColor="rgba(255, 255, 255, 0.1)"
        >
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <VStack spacing={5} align="center" >
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as "all" | "episode" | "user")}
                >
                  <option value="all">All Notifications</option>
                  <option value="episode">Episode Interactions</option>
                  <option value="user">User Notifications</option>
                </Select>
                {/* <Button onClick={() => setSortByDate(!sortByDate)}>
                  Sort by {sortByDate ? "Oldest" : "Newest"}
                </Button> */}
                <Box borderRadius="xl" position="absolute" top={2} left={2} backgroundColor="red"  padding={1}>
                  <Text fontWeight="bold"   color="white" fontSize="lg">{notificationCount}</Text>
                </Box>
                <List borderRadius="xl" spacing={4} width="134%" maxHeight="50vh" overflowY="auto">
                  {notifications.map((notification) => (
                    <ListItem
                      key={notification.id}
                      bg={notification.isRead ? "gray.550" : "gray.600"}
                      p={"6"}
                      width={"100%"}
                      boxShadow={" 0px 4px 4px rgba(0, 0, 0, 0.35)"}
                      borderRadius="xl"

                    >
                      <HStack spacing={4}>
                        <Avatar src={notification.media} />
                        <VStack align="start" spacing={1} flex="1">
                          <Link href={`/Explore/${notification.link}`}>  
                              <Text color="blue.400" fontWeight="bold" textDecoration="underline">
                                {notification.title}
                              </Text>
                          </Link>
                          <Text fontWeight="bold">{notification.message}</Text>
                          <Text
                            fontSize="sm"
                            color="gray.400"
                          >{`Created: ${formatDistanceToNow(
                            new Date(notification.createdAt)
                          )} ago`}</Text>
                        </VStack>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};


export default Notifications;
