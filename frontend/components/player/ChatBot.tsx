import { Box, Input, VStack, Text, InputGroup, InputRightElement, IconButton, Image, Flex } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import { useState } from "react";

type MessageType = {
  sender: "user" | "bot";
  content: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: "user", content: inputValue }]);
      setInputValue("");
      // You can add AI response logic here
    }
  };

  return (
    <Box p={4} boxShadow="xl" rounded="md" width="100%" maxW="400px">
      <Image src="/path-to-logo.png" alt="Chatbot Logo" marginBottom={4} alignSelf="center" />

      <VStack spacing={4} align="start" overflowY="auto" height="300px">
        {messages.map((message, idx) => (
          <Flex key={idx} align="center">
            <Image src={message.sender === "user" ? "/path-to-user-avatar.png" : "/path-to-bot-avatar.png"} alt={`${message.sender} avatar`} boxSize="24px" mr={2} />
            <Box bg={message.sender === "user" ? "blue.500" : "gray.500"} color="white" p={2} borderRadius="max">
              {message.content}
            </Box>
          </Flex>
        ))}
      </VStack>
      <Text fontSize="sm" color="gray.500" mb={2}>
        Things you could ask me:
      </Text>
      <Text fontSize="sm" color="gray.500" mb={4} fontStyle="italic">
        What is the timestamp they talked about?
      </Text>

      <InputGroup>
        <Input placeholder="Ask me anything about this podcast..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
        <InputRightElement>
          <IconButton aria-label="Send" icon={<FaPaperPlane />} onClick={handleSendMessage} variant="outline" colorScheme="blue" />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default Chatbot;
