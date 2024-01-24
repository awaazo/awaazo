import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  VStack,
  Text,
  Input,
  Button,
  Image,
  InputGroup,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { GrUploadOption } from "react-icons/gr";
import awaazo_bird_aihelper_logo from "../../public/awaazo_bird_aihelper_logo.svg";

import { AiOutlineClose, AiFillMessage } from "react-icons/ai";
import { useChatBot } from "../../utilities/ChatBotContext";
import dotenv from "dotenv";
dotenv.config();

const fetchChatGPTResponse = async (userMessage) => {
  const API_KEY = "";

  const systemMessage = {
    role: "system",
    content: "Answer the question breifly and shortly",
  };

  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      systemMessage,
      { role: "user", content: userMessage },
    ],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiRequestBody),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

const ChatBot = () => {
  const { state, dispatch } = useChatBot();
  const [isOpen, setIsOpen] = useState(state.isOpen);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const toggleChatBot = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    dispatch({ type: "TOGGLE_CHAT", payload: newIsOpen });
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [...messages, { text: newMessage, isBot: false }];
      setMessages(updatedMessages);
      setNewMessage("");
      const botResponse = await fetchChatGPTResponse(newMessage);

      const updatedMessagesWithBot = [...updatedMessages, { text: botResponse, isBot: true }];
      setMessages(updatedMessagesWithBot);
    }
  };

  const handlePredefinedQuestionClick = (question) => {
    setNewMessage(question);
  };

  React.useEffect(() => {
    setIsOpen(state.isOpen);
    console.clear(); // Clear console messages on component mount
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
      bg="#2424244D"
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
            {messages.map((message, index) => (
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
            <VStack spacing="2" align="center" padding="4">
              <Text fontSize={"12px"}>Things you can ask:</Text>
              <Button
                borderRadius={"25px"}
                width={"auto"}
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
                width={"auto"}
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
                fontSize={"13px"}
                bg="#3636369E"
                borderRadius="45px"
                p="30px"
                border="none"
                _focus={{ bg: "#181818", boxShadow: "none" }}
                _placeholder={{ color: "#8b8b8b" }}
                pr={"50px"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <Button
                variant={"ghost"}
                borderRadius={"25px"}
                position="absolute"
                zIndex={"50"}
                right="5px"
                top="50%"
                transform="translateY(-50%)"
                onClick={sendMessage}
              >
                <GrUploadOption size={"25px"} color={"white"} />
              </Button>
            </InputGroup>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatBot;
