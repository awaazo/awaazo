import { Box, Input, VStack, Text, InputGroup, InputRightElement, IconButton, Image, Flex, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { BsArrowUpCircle } from "react-icons/bs";
import { useState } from "react";

const awaazoBird = "/awaazo_bird_aihelper_logo.svg";
const awaazoBirdRe = "/awaazo_bird_aihelper_reply_icon.svg";
const userAvatar = "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80";

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

  const boxSize = useBreakpointValue({ base: "20px", md: "30px" });
  const inputPadding = useBreakpointValue({ base: "1", md: "4" });

  return (
    <Box p={4}  width="100%" minH="100%" display="flex" flexDirection="column"  boxSizing="border-box" position="sticky"   borderRadius="2em" bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}  style={{ backdropFilter: "blur(50px)" }} border="3px solid rgba(255, 255, 255, 0.05)" boxShadow="0px 0px 15px rgba(0, 0, 0, 0.01)">
      
      <Flex marginBottom={4} justifyContent="center">
        <Image src={awaazoBird} alt="Awaazo Bird AI Helper Logo" boxSize={boxSize} />
      </Flex>

      {/* Message Container */}
      <Flex flexDirection="column" flexGrow={1} px={4} overflowY="auto" mb={4} maxH="55vh">
        <VStack spacing={4} align="start" flex="1" pb={4}> 
          {messages.map((message, idx) => (
            <Flex key={idx} align="center">
              <Box boxSize="24px" mr={2}>
                <Image src={message.sender === "user" ? userAvatar : awaazoBirdRe} alt={`${message.sender} avatar`} boxSize="24px" objectFit="cover" borderRadius="full" />
              </Box>
              <Box p={2} borderRadius="full" boxShadow="md" backdropBlur="4px" bg="rgba(255, 255, 255, 0.1)" borderColor="rgba(255, 255, 255, 0.1)">
                <Text>{message.content}</Text> 
              </Box>
            </Flex>
          ))}
        </VStack>
      </Flex>

      {/* Input Area */}
      <Box mt="auto">
        <Text fontSize="sm" color="gray.500" mb={2}>
          Things you could ask me:
        </Text>
        <Text fontSize="sm" color="gray.500" mb={4} fontStyle="italic">
          What is the timestamp they talked about?
        </Text>

        <InputGroup>
          <Input
            placeholder="Ask me about this podcast..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            rounded="3xl"
            p={inputPadding}
          />
          <InputRightElement>
            <IconButton
              aria-label="Send"
              icon={<BsArrowUpCircle />}
              onClick={handleSendMessage}
              variant="ghost"
              rounded="full"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  );
};

export default Chatbot;
