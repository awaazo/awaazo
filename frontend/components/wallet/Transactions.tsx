import  { useEffect, useState } from "react";
import {
  Flex,
  VStack,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { Transaction } from "../../types/Interfaces";
import PaymentHelper from "../../helpers/PaymentHelper";
import TransactionCard from "../cards/TransactionCard";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Transactions = () => {
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await PaymentHelper.GetAllTransactions(page, pageSize);
        console.log(response)

        if (response.status == 200) {
          setTransaction((prevTransaction) => [
            ...prevTransaction,
            ...response.data,
          ]);
        }
      } catch (e) {
        console.log("Error While Fetching transaction" + e);
      }
    };
    fetchTransactions();
  }, [page]);

  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1);
  };

  return (
    <VStack spacing="4" align="stretch">
      {transaction.length > 0 &&
        transaction.map((element: Transaction) => {
          return (
            <>
              <TransactionCard
                senderName={element.senderName}
                amount={element.amount}
                username={element.username}
                date={element.date}
                userId={element.userId}
                senderId={element.senderId}
                type={element.type}
              />
            </>
          );
        })}
      {transaction[(page + 1) * pageSize - 1] != null && (
        <Flex justify="center" mt={4} alignSelf={"center"}>
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
    </VStack>
  );
};
export default Transactions;
