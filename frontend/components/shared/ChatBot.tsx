import React, { useEffect, useState, useCallback } from "react";
import { Box, IconButton, VStack, Text, Input, Button, Image, InputGroup, HStack, Avatar, Flex } from "@chakra-ui/react";
import awaazo_bird_aihelper_logo from "../../public/awaazo_bird_aihelper_logo.svg";
import { IoIosCloseCircle, IoMdSend } from "react-icons/io";
import ChatbotHelper from "../../helpers/ChatbotHelper";
import { useChatBot } from "../../utilities/ChatBotContext";

const ChatBot = () => {
  const { state, dispatch } = useChatBot();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = useCallback(async () => {
    if (!state.currentEpisodeId) {
      console.log("No currentEpisodeId, returning early.");
      return;
    }
  
    try {
      const response = await ChatbotHelper.getEpisodeChat(state.currentEpisodeId, 1, 20);
      console.log("epid:", state.currentEpisodeId);
      console.log("Response received:", response);
      if (!response || !response.messages) {
        console.error("Invalid or empty response:", response);
        return;
      }
      setMessages(response.messages);
      console.log("Messages fetched:", response.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [state.currentEpisodeId]);
  
  useEffect(() => {
    setIsOpen(state.isOpen);
    fetchMessages();
  }, [state.isOpen, state.currentEpisodeId, fetchMessages]);

  const toggleChatBot = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    dispatch({ type: "TOGGLE_CHAT", payload: newIsOpen });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await ChatbotHelper.addEpisodeChat(state.currentEpisodeId, newMessage);
      setNewMessage("");
      console.log("Message sent:", newMessage);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handlePredefinedQuestionClick = (question) => setNewMessage(question);
  const handleInputChange = (e) => setNewMessage(e.target.value);

  const handleEnterPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <Box
      position="fixed"
      right="0"
      top="5em"
      transition="width 0.2s ease-in-out"
      w={isOpen ? "32%" : "0"}
      h="calc(88vh - 5em)"
      overflow="hidden"
      p={isOpen ? "20px" : "0"}
      zIndex="1000"
      bg="rgba(255, 255, 255, 0.04)"
      backdropFilter="blur(50px)"
      outline={"2px solid rgba(255, 255, 255, 0.06)"}
      roundedTopLeft="10px"
      roundedBottomLeft="10px"
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
            Episode Title :{state.currentEpisodeId}
          </Text>
          <Text textAlign="center" fontSize="sm" paddingBottom={"1em"}>
            Episode ID: {state.currentEpisodeId}
          </Text>
          <VStack spacing={"1em"} overflowY="auto" height="50vh"  paddingY="4" mt={"20px"}>
            {messages.map((message, index) => (
              <Box key={index} alignSelf={message.isPrompt?  "flex-end": "flex-start"} maxWidth="90%"  color={message.isPrompt ?"#8b8b8b" : "#ffffff" } borderRadius="lg">
                <HStack alignItems="flex-start">
                  {!message.isPrompt && <Avatar src={awaazo_bird_aihelper_logo.src}  w="30px" h="30px" boxSize={"30px"} rounded={""}  borderRadius="full" />}
                  <Text fontSize="sm" mt={!message.isPrompt ? "4px" : "0px"}>
                    {message.message}
                  </Text>
                  {message.isPrompt &&  <Avatar src={message.avatarUrl}  w="30px" h="30px" mr="2px" style={{ alignSelf: "flex-start" }} /> }
                </HStack>
              </Box>
            ))}
          </VStack>

          <Box position="absolute" bottom="0" left="0" right="0" p="30px" borderColor="gray.700">
            <VStack spacing="2" align="left" pb="1em">
              <Text textAlign="left" fontSize={"14px"} pb="0.3em">
                Things you can ask:
              </Text>
            
                <VStack spacing={"1em"} overflowY="auto"  paddingY="1" >
                  <Button borderRadius={"25px"} width={"fit-content"} fontSize={"12px"} fontWeight={"light"} border={"2px solid rgba(255, 255, 255, 0.05)"} onClick={() => handlePredefinedQuestionClick("What is the timp stamp where they talked about ...")}>
                    What is the timestamp where they talked about  
                  </Button>
                  <Button borderRadius={"25px"} width={"fit-content"} fontSize={"12px"} fontWeight={"light"} border={"2px solid rgba(255, 255, 255, 0.05)"} onClick={() => handlePredefinedQuestionClick("What did the podcaster think about ...")}>
                    What did the podcaster think about 
                  </Button>
                </VStack>
           
            </VStack>
            <InputGroup>
              <Input
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Ask me anything about this episode..."
                fontSize={"13px"}
                bg="#3636363A"
                borderRadius="45px"
                border={"2px solid rgba(255, 255, 255, 0.05)"}
                _focus={{ bg: "#181818", boxShadow: "none", borderColor: "brand.100" }}
                _placeholder={{ color: "#8b8b8b" }}
                pr={"50px"}
                onKeyDown={handleEnterPress}
              />
              <Button variant={"ghost"} width="3em" height="3em" rounded={"full"} position="absolute" zIndex={"50"} right="5px" top="50%" transform="translateY(-50%)" onClick={sendMessage} p="0">
                <IoMdSend />
              </Button>
            </InputGroup>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default ChatBot;
