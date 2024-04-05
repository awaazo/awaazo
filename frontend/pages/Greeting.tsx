// pages/greeting.tsx
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Img,
  keyframes,
  VStack,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { useRouter } from 'next/router';
import { AwaazoLogo } from '../public/icons';
import awaazologo from '../public/logos/awaazologo.png';
import Image from 'next/image';
const MotionFlex = motion(Flex);
const MotionImage = motion(Img);
import { FaPlus } from "react-icons/fa6";
import greetingpage from '../styles/images/greetingpage.png';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Greeting = () => {
  const bg = useColorModeValue('white', 'az.blackish');
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return isMobile ? (
    <>
      <Box bg={bg} h="100vh" overflow="hidden" px={8} py={12}>
        {/* Logo awaazologo.png*/}
        <VStack align="center" justify="flex-end" h="100%" spacing={8}>
          {/* white box */}
          <Box
            bg={`rgba(255, 255, 255, 0.15)`}
            p={"2.5em"}
            borderRadius={20}
            boxShadow="lg"
            w="full"
            maxW="md"
            height={'60%'}
            position="relative"
            style={{
              position: 'relative', // Ensure the plus pattern box is contained within this box
            }}
          >
            {/* Plus icon grid */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              display="grid"
              gridGap="5px"
              gridTemplateColumns="repeat(auto-fill, 50px)"
              gridTemplateRows="repeat(auto-fill, 50px)"
              justifyItems="center"
              alignItems="center"
              overflow="hidden"
              zIndex={0} // Ensure the plus pattern is behind other content
            >
              {Array.from({ length: 200 }).map((_, index) => (
                <FaPlus key={index} size={20} color="#0000002A" />
              ))}
            </Box>
            {/* Bird flying in space */}
            <MotionImage
              src="/svgs/waazoFlying.svg"
              alt="Awaazo Flying"
              boxSize="250px"
              position="absolute"
              left="7.5em"
              top="-10em"
              transform="translateX(-50%)"
              animate={{ rotate: [0, 10, -10, 0], x: [0, 5, -5, 0], y: [0, -5, 5, 0] }}
              transition={{ duration: 10, ease: 'easeInOut', loop: Infinity, repeatDelay: 1 }}
            />
            <VStack align="center" justify="space-between" spacing={8} h="100%">
              {/* Empty space */}
              <Box flex="1" />
              {/* Description */}
              <VStack spacing={10} justify="flex-end">
                <Text align="left">
                  <Text fontSize="2em" opacity={0.5} fontWeight={"bold"}>
                    Welcome to
                  </Text>
                  <Text fontSize="2em" fontWeight={"extrabold"}>
                    AWAAZO.
                  </Text>
                  <br />
                  <Text fontSize="15px" fontWeight={"extrabold"}>
                    Awaazo revolutionizes podcasting by blending traditional streaming with advanced AI tools for content creation, discovery, and interaction, featuring live transcripts, a knowledgeable AI assistant, a diverse library, and a community for creators to share insights.
                  </Text>
                </Text>
                {/* Login and sign up buttons */}
                <VStack spacing={5} align="stretch">
                  <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={() => router.push('/auth/Signup')}
                    borderRadius="17px"
                    fontSize={"1em"}
                    boxShadow="md"
                  >
                    GET STARTED
                  </Button>
                  <Button
                    colorScheme="orange"
                    size="lg"
                    onClick={() => router.push('/auth/Login')}
                    borderRadius="17px"
                    fontSize={"1em"}
                    boxShadow="md"
                  >
                    I ALREADY HAVE AN ACCOUNT
                  </Button>
                </VStack>
              </VStack>
            </VStack>
          </Box>
          {/* Footer text */}
          <Text fontSize="xs" position="absolute" bottom="4" left="4">
            Created by the Awaazo team 2024
          </Text>
        </VStack >
      </Box >
    </>
  ) : (
    <Box bg={bg} h="100vh" overflow="hidden" px={12} py={16}>

      <Flex align="center" justify="space-between" h="100%">
        {/* Logo and description */}
        <VStack align="start" spacing={8}>
          {/* Logo */}
          <Text fontSize="5xl" fontWeight="bold">
            Awaazo
          </Text>
          {/* Description */}
          <Text>
            Awaazo redefines podcasting by fusing traditional streaming with innovative AI-powered content
            creation...{' '}
            {/* Rest of the marketing text */}
          </Text>
        </VStack>

        {/* Login and sign up buttons */}
        <VStack spacing={4}>
          <HStack spacing={4}>
            <Button colorScheme="teal" size="lg" onClick={() => router.push('/auth/Login')}>
              Login
            </Button>
            <Button colorScheme="orange" size="lg" onClick={() => router.push('/auth/Signup')}>
              Sign up
            </Button>
          </HStack>
        </VStack>
      </Flex>

      {/* Bird flying in space */}
      <MotionImage
        src="/svgs/waazoFlying.svg"
        alt="Awaazo Flying"
        boxSize="150px"
        position="absolute"
        right="20%"
        top="20%"
        animate={{ rotate: [0, 10, -10, 0], x: [0, 5, -5, 0], y: [0, -5, 5, 0] }}
        transition={{ duration: 10, ease: 'easeInOut', loop: Infinity, repeatDelay: 1 }}
      />

      {/* Footer text */}
      <Text fontSize="xs" position="absolute" bottom="4" left="4">
        Created by the Awaazo team 2024
      </Text>
    </Box>
  );
};

export default Greeting;
