import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  Avatar,
  HStack,
  VStack,
  Text,
  Box,
  Badge,
  Button,
  Divider,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import NotificationHelper from "../../helpers/NotificationsHelper";
import AuthHelper from "../../helpers/AuthHelper";
import { Notification } from "../../utilities/Interfaces";
import Link from "next/link";
import Pusher from "pusher-js";

const Notifications = ({ initialNotifcationCount }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(
    initialNotifcationCount,
  );
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userResponse = await AuthHelper.authMeRequest();
      if (
        userResponse &&
        userResponse.userMenuInfo &&
        userResponse.userMenuInfo.id
      ) {
        setUserId(userResponse.userMenuInfo.id);
        console.log("User data fetched:", userResponse.userMenuInfo);
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        });
        const channel = pusher.subscribe(
          "user-" + userResponse.userMenuInfo.id,
        );
        channel.bind("notification", function (data) {
          // Handle the incoming notification data here
          console.log("Received new notification:", data);
          // You can update the notification state or take other actions based on the incoming data
        });
        return () => {
          // Unsubscribe from the Pusher channel when the component unmounts
          channel.unbind_all();
          channel.unsubscribe();
        };
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await NotificationHelper.getNotifications();
      if (Array.isArray(response)) {
        setNotifications(response);
      } else {
        console.error(
          "Failed to fetch notifications:",
          response.message || "No error message available",
        );
      }
    };

    fetchNotifications();
  }, []);

  const fetchNotificationCount = async () => {
    const response = await NotificationHelper.NotificationCount();
    console.log(response);
    if (
      response !== null &&
      response !== undefined &&
      typeof response === "number"
    ) {
      setNotificationCount(response);
      console.log(notificationCount);
    } else {
      console.error(
        "Failed to fetch notification count:",
        response.message || "No error message available",
      );
    }
  };

  const handleClick = () => {
    console.log("clicked");
    fetchNotificationCount();
  };

  const renderNotificationList = (type) => {
    const filteredNotifications = notifications
      .filter((notification) => {
        if (type === "all") return true;
        return notification.type === type;
      })
      .slice(0, 5);

    if (filteredNotifications.length === 0) {
      return (
        <Text textAlign={"center"} mt={"10px"}>
          There are no Notifications right now
        </Text>
      );
    }

    return (
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {filteredNotifications.map((notification) => (
          <Link href={`/Explore/${notification.link}`} key={notification.id}>
            <ListItem p={"2"} width={"100%"}>
              <HStack
                spacing={"15px"}
                bg={notification.isRead ? "gray.550" : "gray.600"}
              >
                <Avatar src={notification.media} boxSize="50px" />
                <VStack align="start" spacing={"0"} flex="1">
                  <Text
                    color="blue.400"
                    fontWeight="bold"
                    textDecoration="underline"
                    fontSize="16px"
                  >
                    {notification.title}
                  </Text>
                  <Text fontWeight="bold" fontSize="16px">
                    {notification.message}
                  </Text>
                  <Text
                    fontSize="14px"
                    color="gray.400"
                  >{`Created: ${formatDistanceToNow(
                    new Date(notification.createdAt),
                  )} ago`}</Text>
                </VStack>
              </HStack>
              <Divider mt={"5px"} />
            </ListItem>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Box marginRight={"15px"}>
      <Menu>
        <MenuButton
          onClick={handleClick}
          as={IconButton}
          aria-label="Notifications"
          icon={
            <Box position="relative" display="inline-block">
              <BellIcon fontSize={"22px"} />
              {notificationCount > 0 && (
                <Badge
                  borderRadius="full"
                  position="absolute"
                  bottom={0}
                  right={0}
                  transform="translate(50%, 50%)"
                  fontSize="0.85em"
                  color={"white"}
                  style={{
                    borderRadius: "full",
                    fontSize: "md",
                    color: "white",
                    background:
                      "linear-gradient(45deg, #007BFF, #8077f9, #5E43BA, #7C26A5, #564AF7)",
                    backgroundSize: "300% 300%",
                    animation: "Gradient 10s infinite linear",
                  }}
                >
                  {notificationCount}
                </Badge>
              )}
            </Box>
          }
          data-cy={`notifications-button`}
          variant="ghost"
          size="md"
          rounded={"full"}
          opacity={0.7}
          mr={2}
        />
        <MenuList
          minWidth={"400px"}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <Tabs isFitted>
            <TabList mb="1em">
              <Tab>All</Tab>
              <Tab>User</Tab>
              <Tab>Episode</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <List>{renderNotificationList("all")}</List>
              </TabPanel>
              <TabPanel>
                <List>{renderNotificationList("user")}</List>
              </TabPanel>
              <TabPanel>
                <List>{renderNotificationList("PodcastAlert")}</List>
              </TabPanel>
            </TabPanels>
            <Box textAlign={"center"}>
              <Link href="/Notifications" shallow>
                <Button variant={"ghost"}>See All</Button>
              </Link>
            </Box>
          </Tabs>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Notifications;
