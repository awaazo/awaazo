import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, VStack, Text, Input, Button, Image, InputGroup, HStack, Avatar } from "@chakra-ui/react";
import awaazo_bird_aihelper_logo from "../../public/awaazo_bird_aihelper_logo.svg";
import { IoMdSend } from "react-icons/io";
import ChatbotHelper from "../../helpers/ChatbotHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import { Episode, UserMenuInfo } from "../../types/Interfaces";
import UserProfileHelper from "../../helpers/UserProfileHelper";
import AuthHelper from "../../helpers/AuthHelper";

const ChatBot = ({ episodeId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [episode, setEpisode] = useState<Episode>(null);
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);
  const msgEnd = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {

    // Return early if there's no episodeId
    if (!episodeId) {
      console.log("No currentEpisodeId, returning early.");
      return;
    }

    if (!user) {
      try {
        const response = await AuthHelper.authMeRequest();
        console.log("User fetched:", response);
        
        setUser(response.userMenuInfo);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    // Get the episode if it's not already fetched so we can display the episode name
    if ((!episode && episodeId) || (episode && episode.id !== episodeId)) {
      try {
        const response = await PodcastHelper.getEpisodeById(episodeId);
        console.log("Episode fetched:", response);
        setEpisode(response.episode);
      } catch (error) {
        console.error("Error fetching episode:", error);
      }
    }

    // Fetch messages for the episode
    try {
      const response = await ChatbotHelper.getEpisodeChat(episodeId, 0, 200);
      console.log("epid:", episodeId);
      console.log("Response received:", response);
      if (!response || !response.messages) {
        console.error("Invalid or empty response:", response);
        return;
      }
      setMessages(response.messages);

      msgEnd.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

      console.log("Messages fetched:", response.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [episodeId]);

  useEffect(() => {
    fetchMessages();
  }, [episodeId, fetchMessages]);

  const sendMessage = async () => {

    console.log("Sending message:", newMessage);

    // Save the message
    const promptMsg = newMessage;

    messages.push({
      id: "1",
      userId: "1",
      episodeId: "1",
      message: promptMsg,
      isPrompt: true,
      username: user.username,
      avatarUrl: user.avatarUrl,
    });

    setNewMessage("");

    if (!promptMsg.trim()) return;

    try {
      await ChatbotHelper.addEpisodeChat(episodeId, promptMsg);

      console.log("Message sent:", promptMsg);
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
    <Box>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="center" mt={"-0.5em"}>
          <Image src={awaazo_bird_aihelper_logo.src} alt="Logo" w="50px" />
        </Box>
        <Text textAlign="center" fontSize="xl" fontWeight="bold" paddingTop={"1em"}>
          {episode?.episodeName || "No episode selected"}
        </Text>
        <VStack spacing={"1em"} overflowY="auto" height="50vh" paddingY="4" mt={"20px"}>
          {messages.map((message, index) => (
            <Box key={index} alignSelf={message.isPrompt ? "flex-end" : "flex-start"} maxWidth="90%" color={message.isPrompt ? "#8b8b8b" : "#ffffff"} borderRadius="lg">
              <HStack alignItems="flex-start">
                {!message.isPrompt && <Avatar src={awaazo_bird_aihelper_logo.src} w="30px" h="30px" boxSize={"30px"} rounded={""} borderRadius="full" />}
                <Text fontSize="sm" mt={!message.isPrompt ? "4px" : "0px"}>
                  {message.message}
                </Text>
                {message.isPrompt && <Avatar src={message.avatarUrl} w="30px" h="30px" mr="2px" style={{ alignSelf: "flex-start" }} />}
              </HStack>
            </Box>
          ))}
          <div ref={msgEnd} />
        </VStack>
      
        <Box position="absolute" bottom="0" left="0" right="0" p="30px" borderColor="gray.700">

          {messages.length === 0 ?
            (
              <VStack spacing="2" align="left" pb="1em">
                <Text textAlign="left" fontSize={"14px"} pb="0.3em">
                  Things you can ask:
                </Text>


                <VStack spacing={"1em"} overflowY="auto" paddingY="1">
                  <Button
                    borderRadius={"25px"}
                    width={"fit-content"}
                    fontSize={"12px"}
                    fontWeight={"light"}
                    border={"2px solid rgba(255, 255, 255, 0.05)"}
                    onClick={() => handlePredefinedQuestionClick("Give me a summary of this episode.")}
                  >
                    Can you summarize the episode?
                  </Button>
                  <Button borderRadius={"25px"} width={"fit-content"} fontSize={"12px"} fontWeight={"light"} border={"2px solid rgba(255, 255, 255, 0.05)"} onClick={() => handlePredefinedQuestionClick("What did the podcaster think about ")}>
                    What did the podcaster think about ... ?
                  </Button>
                </VStack>
              </VStack>
            ) : null}
          <InputGroup>
            <Input
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Ask me anything about this episode..."
              fontSize={"13px"}
              bg="#3636363A"
              borderRadius="45px"
              border={"2px solid rgba(255, 255, 255, 0.05)"}
              _focus={{
                bg: "#181818",
                boxShadow: "none",
                borderColor: "brand.100",
              }}
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
    </Box>
  );
};
export default ChatBot;
