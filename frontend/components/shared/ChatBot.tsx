import React, { useEffect, useState } from "react";
import { Box, IconButton, VStack, Text, Input, Button, Image, InputGroup, HStack, Avatar, Flex } from "@chakra-ui/react";
import awaazo_bird_aihelper_logo from "../../public/awaazo_bird_aihelper_logo.svg";
import { IoIosCloseCircle } from "react-icons/io";
import { useChatBot } from "../../utilities/ChatBotContext";
import { IoMdSend } from "react-icons/io";

const fetchChatGPTResponse = async (userMessage) => {
  const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // Check if the API key is present
  if (!API_KEY) {
    console.error("OpenAI API key not found. Make sure to set it in your .env.local file.");
  }

  const systemMessage = {
    role: "system",
    content: "Answer the question breifly and shortly",
  };
  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [systemMessage, { role: "user", content: userMessage }],
    max_tokens: 50,
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
  useEffect(() => {
    console.log("Current Episode ID:", state.currentEpisodeId);
  }, [state.currentEpisodeId]);

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
    console.log("current episode ID:" + state.currentEpisodeId);
  }, [state.isOpen]);
  const playerBarHeight = "200px";
  return (
    <Box
      position="fixed"
      right="0"
      top="4em"
      transition="width 0.2s ease-in-out"
      bottom={playerBarHeight}
      w={isOpen ? "32%" : "0"}
      h={`calc(100vh - ${playerBarHeight})`}
      overflow="hidden"
      p={isOpen ? "20px" : "0"}
      zIndex="1000"
      bg="rgba(255, 255, 255, 0.04)"
      backdropFilter="blur(50px)"
      outline={"2px solid rgba(255, 255, 255, 0.06)"}
      roundedTopLeft="30px"
      roundedBottomLeft="30px"
    >
      {isOpen && (
        <Box>
          <Flex>
            <IconButton display="flex" aria-label="Close chatbot" icon={<IoIosCloseCircle />} onClick={toggleChatBot} fontSize="30px" variant="ghost" color="#FFFFFF6B" _hover={{ background: "transparent" }} _active={{ background: "transparent" }} />
          </Flex>
          <Box display="flex" alignItems="center" justifyContent="center" mt={"-0.5em"}>
            <Image src={awaazo_bird_aihelper_logo.src} alt="Logo" w="50px" />
          </Box>
          <Text textAlign="center" fontSize="xl" fontWeight="bold" paddingTop={"1em"}>
            Episode Title
          </Text>
          <Text textAlign="center" fontSize="sm" paddingBottom={"1em"}>
            Episode Title
          </Text>
          {/* testing episode ID: to remove during production */}
          <Text textAlign="center" fontSize="sm" paddingBottom={"1em"}>
            Episode ID: {state.currentEpisodeId}
          </Text>
          <VStack spacing={"20px"} overflowY="auto" height="calc(100% - 3rem)" paddingY="4" mt={"20px"}>
            {messages.map((message, index) => (
              <Box key={index} alignSelf={message.isBot ? "flex-start" : "flex-end"} maxWidth="80%" fontWeight="bold" color={message.isBot ? "#ffffff" : "#8b8b8b"} borderRadius="lg">
                <HStack alignItems="flex-start">
                  {message.isBot && <Image src={awaazo_bird_aihelper_logo.src} alt="Logo" w="28px" mr="5px" style={{ alignSelf: "flex-start" }} />}
                  <Text fontSize="sm" mt={!message.isBot ? "4px" : "0px"}>
                    {message.text}
                  </Text>
                  {!message.isBot && <Avatar src={"asdsad"} boxSize={"28px"} mr="5px" borderRadius="full" style={{ alignSelf: "flex-start" }} />}
                </HStack>
              </Box>
            ))}
          </VStack>

          <Box position="absolute" bottom="0" left="0" right="0" p="30px" borderColor="gray.700">
            <VStack spacing="2" align="center" padding="2em">
              <Text textAlign="center" fontSize={"14px"} padding={"1em"}>
                Chat with your host, AUTHORNAME.
                <br />
                Things you can ask:
              </Text>
              <Button borderRadius={"25px"} width={"auto"} fontSize={"12px"} fontWeight={"normal"} border={"2px solid rgba(255, 255, 255, 0.05)"} onClick={() => handlePredefinedQuestionClick("What is the timp stamp where they talked about food")}>
                What is the timp stamp where they talked about food
              </Button>
              <Button borderRadius={"25px"} width={"auto"} fontSize={"12px"} fontWeight={"normal"} border={"2px solid rgba(255, 255, 255, 0.05)"} onClick={() => handlePredefinedQuestionClick("What did the podcaster think about Lasagna?")}>
                What did the podcaster think about Lasagna?
              </Button>
            </VStack>
            <InputGroup>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me anything about this episide..."
                fontSize={"13px"}
                bg="#3636363A"
                borderRadius="45px"
                p="30px"
                border={"2px solid rgba(255, 255, 255, 0.05)"}
                _focus={{ bg: "#181818", boxShadow: "none", borderColor: "brand.100" }}
                _placeholder={{ color: "#8b8b8b" }}
                pr={"50px"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <Button variant={"ghost"} width="3em" height="3em" rounded={"full"} position="absolute" zIndex={"50"} right="5px" top="50%" transform="translateY(-50%)" onClick={sendMessage}>
                <IoMdSend size={"30px"} />
              </Button>
            </InputGroup>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default ChatBot;
