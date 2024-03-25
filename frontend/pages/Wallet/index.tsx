import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import Withdraw from "../../components/wallet/Withdraw";
import Transactions from "../../components/wallet/Transactions";
import Last5DaysBalance from "../../components/wallet/Last5DaysBalace";
import GetLast5DaysEarnings from "../../components/wallet/Last5DaysEarnings";
import MostGiftedEpisode from "../../components/wallet/MostGiftedEpsiode";
import MostGiftedPodcast from "../../components/wallet/MostGiftedPodcast";

const Wallet = () => {
  return (
    <VStack>
      <Withdraw />

      <HStack width="80%" align={"start"} spacing={"15px"}>
        <Box
          maxH="400px"
          w="100%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={2}
          justifyItems={"left"}
        >
          <Text fontSize={["xl", "2xl"]} fontWeight="bold">
            Last 5 Day's Balance
          </Text>
          <Last5DaysBalance />
        </Box>
        <Box
          maxH="400px"
          w="100%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text fontSize={["xl", "2xl"]} fontWeight="bold">
            Earnings
          </Text>

          <GetLast5DaysEarnings />
        </Box>
        <Box
          overflowY="auto"
          maxH="400px"
          w="100%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text fontSize={["xl", "2xl"]} fontWeight="bold">
            All transactions
          </Text>
          <Transactions />
        </Box>
      </HStack>
      <HStack width="80%" align={"start"} spacing={"15px"}>
        <Box
          overflowY="auto"
          maxH="400px"
          w="40%"
          borderWidth="1px"
          borderRadius="lg"
          p={8}
          mb={8}
          justifyItems={"left"}
        >
          <Text mb={8} fontSize={["xl", "2xl"]} fontWeight="bold">
            Highest Earning Podcasts
          </Text>
          <MostGiftedPodcast />
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
            Most Gifted Episodes
          </Text>
          <MostGiftedEpisode />
        </Box>
      </HStack>
    </VStack>
  );
};

export default Wallet;
