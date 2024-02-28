import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { MdArrowForward } from "react-icons/md";

const Wallet = () => {
  const transactions = [
    { id: 1, description: "Transaction 1", amount: 100 },
    { id: 2, description: "Transaction 2", amount: 200 },
    { id: 3, description: "Transaction 3", amount: 300 },
  ];
  return (
    <VStack >
      <Heading as="h1" mb={8}>
        Dashboard
      </Heading>
      <Box w="80%" borderWidth="1px" borderRadius="lg" p={8} mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="lg">
            Current Balance: 1000 CAD
          </Heading>
          <Button variant="gradient">Withdraw</Button>
        </Flex>
        <Text fontSize="sm" color="gray.500">
          Your current balance is up to date.
        </Text>
      </Box>

      <Box w="80%" borderWidth="1px" borderRadius="lg" p={8} mb={8}>
        <Heading as="h2" size="lg" mb={4}>
          Statistics
        </Heading>
        {/* <Line data={data} /> */}
      </Box>

        <Box borderWidth="1px" borderRadius="lg" p={8} mb={8}>
          <Heading as="h2" size="lg" mb={4}>
            Transactions
          </Heading>
          <Box h="200px" overflowY="auto" mb={4}>
            <List spacing={3}>
              {transactions.map((transaction) => (
                <ListItem key={transaction.id}>
                  <ListIcon as={MdArrowForward} color="green.500" />
                  <Text>{transaction.description}</Text>
                  <Text ml={2}>${transaction.amount}</Text>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
       
    </VStack>
    // <Box px={["1em", "2em", "4em"]} minH="100vh">
    //   <Box mb={4}>
    //     <Text fontSize={["3xl", "4xl"]} display={"inline"} fontWeight="bold" mb={3}>
    //      Current Balance :

    //     </Text>
    //     <Text fontSize={["3xl", "4xl"]} display={"inline"} mx={"15px"}  mb={3}>
    //      5 CAD
    //     </Text>

    //   </Box>

    //   <Box mb={4}>
    //     <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
    //       Most Gifted Episodes
    //     </Text>
    //     {/* <RecentlyUploaded /> */}
    //   </Box>
    //   <Box mb={4}>
    //     <Text fontSize={["xl", "2xl"]} fontWeight="bold" mb={3}>
    //       Podcasts For You
    //     </Text>
    //     {/* <ForYou /> */}
    //   </Box>
    // </Box>
  );
};

export default Wallet;
