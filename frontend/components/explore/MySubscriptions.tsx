import React, { useState, useEffect, FC } from "react";
import SubscribeHelper from "../../helpers/SubscribeHelper";
import { MySubscriptions } from "../../utilities/Interfaces";
import Link from "next/link";
import { Stack, Flex, Avatar, Text, Box, useColorModeValue } from "@chakra-ui/react";

const Subscriptions: FC = () => {
  const [subscriptions, setSubscriptions] = useState<MySubscriptions[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await SubscribeHelper.getMySubscriptions();
      if (Array.isArray(response)) {
        setSubscriptions(response);
      } else {
        console.error("Failed to fetch subscriptions:", response.message || 'No error message available');
      }
    };
  
    fetchSubscriptions();
  }, []);

  return (
    <Stack spacing={4} alignItems="center" 
        m={14} 
        ml={82}
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        p={3}
        >
      <Text fontWeight="bold">My Subscriptions</Text>
      {subscriptions.map((subscription) => (
        <Box
          key={subscription.id}
          p={2}
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
          w="300px" // Fixed width
          _hover={{ borderColor: "gray.300", boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)" }}
          bg={useColorModeValue("white", "gray.700")}
        >
          <Link href={`/Explore/${subscription.id}`}>
            <Flex
              as="a"
              alignItems="center"
              borderRadius="full"
            >
              <Avatar
                size="md"
                src={subscription.coverArtUrl}
              />
              <Flex direction="column" ml={3}>
                <Text fontWeight="bold">{subscription.name}</Text>
                <Text fontSize="sm">{subscription.description}</Text>
              </Flex>
            </Flex>
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

export default Subscriptions;
