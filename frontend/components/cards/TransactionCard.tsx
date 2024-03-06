import { Box, Flex, Text, HStack, Avatar } from "@chakra-ui/react";
import react, { useEffect, useState } from "react";
import { Transaction } from "../../types/Interfaces";
import EndpointHelper from "../../helpers/EndpointHelper";

const TransactionCard = (transactions: Transaction) => {
  const [avatar, setavatar] = useState<string>(null);
  useEffect(() => {
    if (transactions.type == "Gift") {
      setavatar(EndpointHelper.getUserAvatar(transactions.senderId));
    } else {
      setavatar(EndpointHelper.getUserAvatar(transactions.userId));
    }
  }, [transactions]);

  useEffect(() => {
    console.log(transactions.senderName);
  }, []);

  return (
    <Box p="4" borderRadius="md" mb="4" width={"100%"}>
      <Flex justify="space-between" align="center">
        <HStack>
          <Avatar size={"md"} src={avatar} backdropFilter="blur(10px)" />

          <Box ml={2}>
            <Text fontWeight="bold" fontSize="lg">
              {transactions.type == "Gift" ? "Deposit" : <></>}
              {transactions.type == "Withdraw" ? "Withdrawal" : <></>}
            </Text>
            <Text color="gray.500">
              {transactions.type == "Gift" ? (
                `from ${transactions.senderName} to ${
                  transactions.username
                } at ${
                  new Date(transactions.date).getMonth() +
                  "/" +
                  new Date(transactions.date).getDate() +
                  "/" +
                  new Date(transactions.date).getFullYear()
                }`
              ) : (
                <></>
              )}
              {transactions.type == "Withdraw" ? (
                ` at ${
                  new Date(transactions.date).getMonth() +
                  "/" +
                  new Date(transactions.date).getDate() +
                  "/" +
                  new Date(transactions.date).getFullYear()
                }`
              ) : (
                <></>
              )}
            </Text>
          </Box>
        </HStack>
        <Text fontWeight="bold" fontSize="lg">
          {transactions.type == "Gift" ? `+${transactions.amount} CAD` : <></>}
          {transactions.type == "Withdraw" ? (
            `${transactions.amount} CAD`
          ) : (
            <></>
          )}
        </Text>
      </Flex>
    </Box>
  );
};
export default TransactionCard;
