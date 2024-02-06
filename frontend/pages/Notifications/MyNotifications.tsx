import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Notification } from "../../types/Interfaces";
import NotificationHelper from "../../helpers/NotificationsHelper";
import { Box, Button, Text, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import withAuth from "../../utilities/AuthHOC";

const NotificationsPage = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await NotificationHelper.getRangedNotifications(
        page,
        pageSize,
      );
      if (Array.isArray(response)) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...response,
        ]);
      } else {
        console.error(
          "Failed to fetch notifications:",
          response.message || "No error message available",
        );
      }
    };
  }, [page, router]);

  const buttonStyle = {
    width: "7em",
    borderRadius: "10em",
    margin: "15px",
    padding: "9px",
    color: "#fff",
    transition: "opacity 0.8s",
    border: "2px solid rgba(255, 255, 255, 0.2)",
  };

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((notification) => notification.type === filter);

  const handleLoadMoreClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <h1
        style={{
          color: "white",
          fontSize: "2em",
          fontWeight: "bold",
          textAlign: "center",
          margin: "0.5em 0",
          textShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        Catch up on your notifications.
      </h1>
      <Box
        style={{ display: "flex", justifyContent: "center", margin: "30px" }}
      >
        <Button
          style={{
            ...buttonStyle,
            backgroundColor:
              filter === "All" ? "#007bff" : "rgba(255, 255, 255, 0.1)",
            backdropFilter: filter === "All" ? "blur(25px)" : "none",
            opacity: filter === "All" ? 1 : 0.7,
          }}
          onClick={() => setFilter("All")}
        >
          All
        </Button>
        <Button
          style={{
            ...buttonStyle,
            backgroundColor:
              filter === "User" ? "#007bff" : "rgba(255, 255, 255, 0.1)",
            backdropFilter: filter === "User" ? "blur(25px)" : "none",
            opacity: filter === "User" ? 1 : 0.7,
          }}
          onClick={() => setFilter("User")}
        >
          User
        </Button>
        <Button
          style={{
            ...buttonStyle,
            backgroundColor:
              filter === "PodcastAlert"
                ? "#007bff"
                : "rgba(255, 255, 255, 0.1)",
            backdropFilter: filter === "PodcastAlert" ? "blur(25px)" : "none",
            opacity: filter === "PodcastAlert" ? 1 : 0.7,
          }}
          onClick={() => setFilter("PodcastAlert")}
        >
          Episode
        </Button>
      </Box>

      <Box
        style={{
          display: "grid",
          placeItems: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filteredNotifications.map((notification) => (
          <Link href={`/Explore/${notification.link}`} key={notification.id}>
            <Box
              key={notification.id}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #E5E7EB29",
                padding: "20px",
                borderRadius: "20px",
                width: "60vw",
                backdropFilter: "blur(30px)",
                boxShadow: "0 0 25px rgba(0, 0, 0, 0.3)",
                marginBottom: "5px",
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box style={{ position: "relative" }}>
                <img
                  src={notification.media as string}
                  alt={notification.type}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "20px",
                  }}
                />
                <img
                  src={notification.media as string}
                  alt={notification.type}
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-70%, -50%)",
                    zIndex: -1,
                    filter: "blur(13px)",
                  }}
                />
              </Box>
              <Box>
                <strong
                  style={{
                    color: "#E8E8E8",
                    display: "block",
                  }}
                >
                  {notification.type}:
                </strong>
                <span style={{ color: "#fff" }}>{notification.message}</span>
              </Box>
            </Box>
          </Link>
        ))}

        {/* "Load More" button and message */}
        {filteredNotifications.length === 0 && (
          <Text textAlign="center" fontSize="18px" mt="20px">
            No Notifications Yet.
          </Text>
        )}
        {notifications[(page + 1) * pageSize - 1] != null && (
          <Flex justify="center" mt={4}>
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
      </Box>
    </>
  );
};

export default withAuth(NotificationsPage);
