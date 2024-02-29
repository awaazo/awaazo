import {
  Box,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Withdraw from "../../components/wallet/Withdraw";
import Transactions from "../../components/wallet/Transactions";

const Wallet = () => {
  return (
    <VStack>
      <Withdraw />

      <HStack width="80%" align={"start"} spacing={"15px"}>
        <Box
          w="80%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text fontSize={["xl", "2xl"]} fontWeight="bold">
            Last 5 Day's Balance
          </Text>
        </Box>
        <Box
          w="80%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text fontSize={["xl", "2xl"]} fontWeight="bold">
            Top earning episodes
          </Text>
        </Box>
        <Box
          w="80%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text fontSize={["xl", "2xl"]} fontWeight="bold">
            Earnings
          </Text>
        </Box>
      </HStack>
      <HStack width="80%" align={"start"} spacing={"15px"}>
        <Box
          w="40%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text fontSize={["xl", "2xl"]} fontWeight="bold">
            Gifted Episodes
          </Text>
        </Box>

        <Box
          w="80%"
          borderWidth="1px"
          borderRadius="lg"
          overflowY="auto"
          maxH="400px"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text mb={2} fontSize={["xl", "2xl"]} fontWeight="bold">
            All Transactions
          </Text>
          <Transactions />
        </Box>
      </HStack>
    </VStack>
  );
};

export default Wallet;
