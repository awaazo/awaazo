import { useEffect, useState } from "react";
import {
  Button,
  Icon,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  RadioGroup,
  Radio,
  Stack,
  Input,
  VStack,
  Text,
  Center,
} from "@chakra-ui/react";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import PaymentHelper from "../../helpers/PaymentHelper";
import AuthHelper from "../../helpers/AuthHelper";
import AuthPrompt from "../auth/AuthPrompt";
import { useRouter } from "next/router";

const Tipjar = ({ episodeId }) => {
  const router = useRouter();
  const { success, failure } = router.query;
  const [isModalOpen, setModalOpen] = useState(false);
  const [points, setPoints] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [showStack, setShowStack] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [customPoints, setCustomPoints] = useState("");

  useEffect(() => {
    const checkQueryParameter = async () =>{
        if (success != null) {
          // Confirm payment
          setModalOpen(true);
          setShowStack(false);

          try{
            const response = await PaymentHelper.confirmPayment({pointId : success.toString()});
            if(response.status == 200){
              setPaymentSuccess("Thank you for Supporting !");
            }
            else{
              setPaymentSuccess(response.data);
            }
          }
          catch(error){
            console.log("Error While Confirming the Payment");
          }
        }
        if (failure != null) {
          setModalOpen(true);
          setPaymentError("Error While Processing the Payment");
        }
    }


    checkQueryParameter();
  }, [router.query]);

  const checkAuthentication = async () => {
    try {
      const response = await AuthHelper.authMeRequest();
      if (response.status === 401) {
        setShowLoginPrompt(true);
        setIsLoggedIn(false);
        return;
      }
      setModalOpen(true);
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  const handlePointsChange = (value) => {
    setPoints(value);
    if (value !== "custom") {
      setCustomPoints("");
    }
  };

  const handleCustomPointsChange = (event) =>
    setCustomPoints(event.target.value);

  const handleTipSubmit = async () => {
    const numericPoints =
      points === "custom" ? parseFloat(customPoints) : parseInt(points, 10);
    const amount = numericPoints * 0.1; // Convert points to dollars
    if (!amount) {
      setPaymentError("Please enter or select a points amount");
      return;
    }

    try {
      const response = await PaymentHelper.createPayment( {episodeId : episodeId, points : numericPoints });
      if (response.status === 200) {
        window.location.href = response.data;
        setModalOpen(false);
        setPoints("");
        setCustomPoints("");
        console.log("Tip processed successfully");
      } else {
        setPaymentError(response.data);
        console.error("Error processing tip:");
      }
    } catch (error) {
      
      console.error("Error processing tip:", error);
    }
  };

  const calculateSupporterMessage = (points) => {
    if (!points) {
      return "5 Points = 0.5 CAD";
    }
    const numericPoints = parseFloat(points);
    const amount = numericPoints * 0.1; // Convert points to dollars
    return `Thanks for supporting $${amount.toFixed(2)} CAD!`;
  };

  const supporterMessage =
    points === "custom"
      ? calculateSupporterMessage(customPoints)
      : calculateSupporterMessage(points);

  return (
    <>
      <Tooltip label="Gift" aria-label="Tip tooltip">
        
        
        <Button
          padding={"0px"}
          m={1}
          variant={"ghost"}
          onClick={() => {
            checkAuthentication();
            setModalOpen(true);
          }}
      
        > 
          <Icon as={PiCurrencyDollarSimpleFill} boxSize={"20px"} />    
        </Button>
      </Tooltip>

      {isLoggedIn && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          size="sm"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />

            {showStack == false && (
              <ModalBody>
                {paymentSuccess && (
                  <Text color="gray.500">{paymentSuccess}</Text>
                )}
              </ModalBody>
            )}
            {showStack == true && (
              <>
                <ModalHeader>Support the Show</ModalHeader>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Select the number of points you would like to gift
                </Text>
                <ModalBody>
                  {paymentError && (
                    <Text fontSize="md" color="red.500">
                      {paymentError}
                    </Text>
                  )}
                  <VStack spacing={5} align="center" p={5}>
                    <RadioGroup onChange={handlePointsChange} value={points}>
                      <Stack direction="column" align="center">
                        <Stack direction="row" spacing={5}>
                          <Radio value="5">5</Radio>
                          <Radio value="10">10</Radio>
                          <Radio value="50">50</Radio>
                        </Stack>
                        <Radio value="custom" alignSelf="center">
                          Custom
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    {points === "custom" && (
                      <FormControl>
                        <Input
                          placeholder="Enter custom points amount"
                          value={customPoints}
                          onChange={handleCustomPointsChange}
                          type="number"
                          min={1}
                        />
                      </FormControl>
                    )}
                    <Center
                      w="full"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text textAlign="center">{supporterMessage}</Text>
                    </Center>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    leftIcon={<Icon as={PiCurrencyDollarSimpleFill} />}
                    onClick={handleTipSubmit}
                    variant="gradient"
                  >
                    Tip Creator
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {showLoginPrompt && (
        <AuthPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="Login to send a tip"
        />
      )}
    </>
  );
};
export default Tipjar;
