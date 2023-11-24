import React, { useState, useEffect, FC } from "react";
import SubscribeHelper from "../../helpers/SubscribeHelper";
import { MySubscriptions } from "../../utilities/Interfaces";
import Link from "next/link";
import { Stack, Flex, Avatar, Text, Box, useColorModeValue, Badge, useToken  } from "@chakra-ui/react";

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

  const [blue500, gray300, gray500, gray700] = useToken("colors", ["blue.500", "gray.300", "gray.500", "gray.700"]);

  return (
    <Stack spacing={4} alignItems="center" m={14} borderRadius="md" border="1px" borderColor="gray.200" p={3} w="650px">
      <Text fontWeight="bold" fontSize="xl" mb={4}>My Subscriptions</Text>
      {subscriptions.map((subscription) => (
        <Box
          key={subscription.id}
          p={4}
          borderRadius="full"
          border="1px"
          borderColor="gray.200"
          w="100%"
          _hover={{ borderColor: blue500, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
          bg={useColorModeValue("white", gray700)}
        >
          <Link href={`/Explore/${subscription.id}`} passHref>
            <Flex as="a" alignItems="center" justifyContent="space-between" textDecoration="none">
              <Flex alignItems="center">
                <Avatar size="lg" src={subscription.coverArtUrl} mr={4} />
                <Flex direction="column" justifyContent="center">
                  <Text fontWeight="bold" color={blue500}>{subscription.name}</Text>
                  <Text fontSize="sm" color={gray300} mt={1}>{subscription.description}</Text>
                  <Badge colorScheme={subscription.isExplicit ? "red" : "green"} mt={2}>{subscription.isExplicit ? "Explicit" : "Implicit"}</Badge>
                </Flex>
              </Flex>
              <Flex direction="column" alignItems="flex-end">
                <Text fontSize="sm" color={gray500}>Average Rating: {subscription.averageRating}</Text>
                <Text fontSize="sm" color={gray500}>Total Ratings: {subscription.totalRatings}</Text>
              </Flex>
            </Flex>
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

export default Subscriptions;