import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  VStack,
  Text,
  Input,
  Button,
  Image,
  InputRightElement,
  InputGroup,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { GrUploadOption } from "react-icons/gr";
import awaazo_bird_aihelper_logo from "../../public/awaazo_bird_aihelper_logo.svg";

import { AiOutlineClose, AiFillMessage } from "react-icons/ai";
import { useChatBot } from "../../utilities/ChatBotContext";

const ChatBot = () => {
  const { state, dispatch } = useChatBot();
  const [isOpen, setIsOpen] = useState(state.isOpen); // Manage open state locally
  const [messages, setMessages] = useState([]); // State for messages
  const [newMessage, setNewMessage] = useState(""); // State for the new message input

  // Sample messages for mapping
  const sampleMessages = [
    { text: "What did joe say about his favorite dish?", isBot: false },
    {
      text: "Joe said that he loves Lasagna and wish's that his mom can cooked it for him ever y day , but she doesn’t , because she dies 20 years ago . ",
      isBot: true,
    },
    { text: "You are the greatest bot ever created", isBot: false },
    { text: "For once do something useful with your life son.", isBot: true },
  ];

  // Toggle the chatbot based on the local state and also dispatch to context
  const toggleChatBot = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    dispatch({ type: "TOGGLE_CHAT", payload: newIsOpen });
  };

  // Handler for sending messages
  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isBot: false }]);
      setNewMessage("");
    }
  };

  // Handle user clicking on predefined questions
  const handlePredefinedQuestionClick = (question) => {
    setNewMessage(question);
  };

  // Listen to the context's state change for isOpen and update local state accordingly
  React.useEffect(() => {
    setIsOpen(state.isOpen);
  }, [state.isOpen]);

  return (
    <Box
      position="fixed"
      right="0"
      top="0"
      w={isOpen ? "32%" : "0"}
      h="100vh"
      overflow="hidden"
      transition="width 0.5s ease"
      boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
      p={isOpen ? "20px" : "0"}
      zIndex="1000"
      bg="#242424"
      backdropFilter="blur(50px)"
      color="white"
    >
      {isOpen && (
        <Box>
          <IconButton
            aria-label="Close chatbot"
            icon={<AiOutlineClose />}
            position="absolute"
            top="2"
            right="2"
            onClick={toggleChatBot}
            fontSize="20px"
            variant="ghost"
            color="white"
            _hover={{ background: "transparent" }}
            _active={{ background: "transparent" }}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={"10px"}
          >
            <Image src={awaazo_bird_aihelper_logo.src} alt="Logo" w="50px" />
          </Box>
          <VStack
            spacing={"20px"}
            overflowY="auto"
            height="calc(100% - 3rem)"
            paddingY="4"
            mt={"20px"}
          >
            {sampleMessages.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.isBot ? "flex-start" : "flex-end"}
                maxWidth="80%"
                fontWeight="bold"
                color={message.isBot ? "#ffffff" : "#8b8b8b"}
                borderRadius="lg"
              >
                <HStack alignItems="flex-start">
                  {message.isBot && (
                    <Image
                      src={awaazo_bird_aihelper_logo.src}
                      alt="Logo"
                      w="28px"
                      mr="5px"
                      style={{ alignSelf: "flex-start" }}
                    />
                  )}
                  <Text fontSize="sm" mt={!message.isBot ? "4px" : "0px"}>
                    {message.text}
                  </Text>
                  {!message.isBot && (
                    <Avatar
                      src={"asdsad"}
                      boxSize={"28px"}
                      mr="5px"
                      borderRadius="full"
                      style={{ alignSelf: "flex-start" }}
                    />
                  )}
                </HStack>
              </Box>
            ))}
          </VStack>

          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            p="30px"
            borderColor="gray.700"
          >
            <VStack spacing="2" align="left" padding="4">
              <Text fontSize={"12px"}>Things you can ask:</Text>
              <Button
                borderRadius={"25px"}
                width={"85%"}
                fontSize={"12px"}
                fontWeight={"normal"}
                onClick={() =>
                  handlePredefinedQuestionClick(
                    "What is the timp stamp where they talked about food",
                  )
                }
              >
                What is the timp stamp where they talked about food
              </Button>
              <Button
                borderRadius={"25px"}
                width={"80%"}
                fontSize={"12px"}
                fontWeight={"normal"}
                onClick={() =>
                  handlePredefinedQuestionClick(
                    "What did the podcaster think about Lasagna?",
                  )
                }
              >
                What did the podcaster think about Lasagna?
              </Button>
            </VStack>

            <InputGroup>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me anything about this podcast ..."
                fontSize={"15px"}
                bg="#363636"
                borderRadius="25px"
                p="30px"
                border="none"
                _focus={{ bg: "#363636", boxShadow: "none" }}
                _placeholder={{ color: "#8b8b8b" }}
                pr={"50px"}
              />
              <Button
                variant={"ghost"}
                borderRadius={"25px"}
                position="absolute"
                zIndex={"50"}
                right="5px"
                top="50%"
                transform="translateY(-50%)"
              >
                <GrUploadOption size={"25px"} />
              </Button>
            </InputGroup>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatBot;
