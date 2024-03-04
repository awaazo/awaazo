import {
  Box,
  Flex,
  Text,
  Button,
  ModalContent,
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  Input,
  FormControl,
  Icon,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PaymentHelper from "../../helpers/PaymentHelper";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";

const Withdraw = () => {
  const [balance, setBalance] = useState<number>(0);
  const [withdrawError, setWithdrawError] = useState<string>(null);
  const [amount, setAmount] = useState<string>(null);
  const [success, setSuccess] = useState<string>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await PaymentHelper.getUserBalanceRequest();
        console.log("Fetching Balance");
        if (response.status == 200) {
          
          setBalance(Number(response.data.toFixed(2)));
        } else {
          window.location.href = "/";
        }
      } catch (e) {
        console.log("Error Occured");
        window.location.href = "/";
      }
    };
    fetchBalance();
  }, []);

  const handleWithdraw = async () => {
    const request = parseFloat(amount);
    console.log(request);
    if (request != null) {
      try {
        // Proceed with the Withdrawal
        const response = await PaymentHelper.WithdrawRequest(request);
        if (response.status == 200) {
          console.log("Successfully Withdrawn Amount");
          setSuccess(response.data);
        } else {
          console.log("Error Occured whileWithdrawing amount ");
          setWithdrawError(response.data);
        }
      } catch (e) {
        console.log("Error Occured While Withdrawing");
        window.location.href = "/";
      }
    } else {
      setWithdrawError("Invalid amount");
    }
  };

  return (
    <Box w="80%" borderWidth="10px" borderRadius="lg" p={8} mb={8}>
      <Flex justify="space-between" align="center">
        <Flex direction="column">
          <Text mb={1} fontSize={["xl", "2xl"]} fontWeight="bold">
            Current Balance
          </Text>
          <Text  fontSize={["xl", "2xl"]} fontWeight="light">
            ${balance} CAD
          </Text>
        </Flex>
        <Button
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Withdraw
        </Button>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Input the Amount</ModalHeader>
          <Text fontSize="md" color="red.500">
            {withdrawError != null ? withdrawError : null}
          </Text>

          <Text fontWeight="bold">{success != null ? success : null}</Text>

          <FormControl>
            <Input
              placeholder="Enter Amount to Withdraw"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              type="number"
              min={1}
            />
          </FormControl>
          <ModalFooter>
            <Button
              leftIcon={<Icon as={PiCurrencyDollarSimpleFill} />}
              onClick={handleWithdraw}
              variant="gradient"
            >
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Withdraw;
