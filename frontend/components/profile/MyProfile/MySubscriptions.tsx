import React, { useState, useEffect, FC } from "react";
import SubscribeHelper from "../../../helpers/SubscribeHelper";
import { MySubscriptions } from "../../../utilities/Interfaces";
import Link from "next/link";
import {
  Stack,
  Flex,
  Avatar,
  Text,
  Box,
  useColorModeValue,
  Badge,
  useToken,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const Subscriptions: FC = () => {
  const [subscriptions, setSubscriptions] = useState<MySubscriptions[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await SubscribeHelper.getMySubscriptions();
      if (Array.isArray(response)) {
        setSubscriptions(response);
      } else {
        console.error(
          "Failed to fetch subscriptions:",
          response.message || "No error message available",
        );
      }
    };

    fetchSubscriptions();
  }, []);

  const [blue500, gray300, gray500, gray700] = useToken("colors", [
    "blue.500",
    "gray.300",
    "gray.500",
    "gray.700",
  ]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        rounded="7px"
        style={{
          // styling for number of followers, and when clicked, goes to the followers page
          border: "solid 1px #CC748C",
        }}
      >
        Subscribed to {subscriptions.length} Podcasts
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>My Subscriptions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {subscriptions.map((subscription) => (
                <Box
                  key={subscription.id}
                  p={4}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{
                    borderColor: blue500,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  bg={useColorModeValue("white", gray700)}
                >
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    alignItems={{ base: "center", md: "flex-start" }}
                    justifyContent="space-between"
                  >
                    <Flex alignItems="center" mb={{ base: 4, md: 0 }}>
                      <Link href={`/Explore/${subscription.id}`} passHref>
                        <Avatar
                          size="lg"
                          src={subscription.coverArtUrl}
                          mr={4}
                        />
                      </Link>
                      <Flex direction="column" justifyContent="center">
                        <Link href={`/Explore/${subscription.id}`} passHref>
                          <Text fontWeight="bold" color={blue500} mb={1}>
                            {subscription.name}
                          </Text>
                        </Link>
                        <Text fontSize="sm" color={gray300}>
                          {subscription.description}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal} colorScheme="blue">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Subscriptions;