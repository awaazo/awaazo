// pages/greeting.tsx
import { Box, Button, Flex, Text, useColorModeValue, Img, keyframes, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { useRouter } from 'next/router';

const MotionFlex = motion(Flex);
const MotionImage = motion(Img);

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Greeting = () => {
  const bg = useColorModeValue('white', 'az.blackish');
  const router = useRouter();
  
  return (
    <Box bg={bg} h="100vh"  overflow="hidden">
      {/* Logo and bird image container */}
      <MotionFlex
        direction="column"
        align="center"
        justify="center"
        pt="10%"
        animation={`${fadeIn} 1s ease-in-out`}
      >
        {/* Logo */}
        <Text fontSize="5xl" fontWeight="bold" mb={8}>
          Awaazo
        </Text>

        {/* Bird flying in space */}
        <MotionImage
          src="/svgs/waazoFlying.svg"
          alt="Awaazo Flying"
          boxSize="150px"
          position="absolute"
          right="20%"
          top="20%"
          animate={{
            rotate: [0, 10, -10, 0],
            x: [0, 5, -5, 0],
            y: [0, -5, 5, 0]
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            loop: Infinity,
            repeatDelay: 1
          }}
        />
      </MotionFlex>

      {/* Text and buttons container */}
      <VStack
        spacing={4}
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="90%"
        maxWidth="lg"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        bg="whiteAlpha.900"
        textAlign="center"
        animation={`${fadeIn} 1.5s ease-out`}
      >
        <Text mb={4}>
          Awaazo redefines podcasting by fusing traditional streaming with innovative AI-powered content creation...
          {/* Rest of the marketing text */}
        </Text>
        <Button colorScheme="teal" size="lg" mb={2} onClick={() => router.push('/auth/Login')}>
          Login
        </Button>
        <Button colorScheme="orange" size="lg" onClick={() => router.push('/auth/Signup')}>
          Sign up
        </Button>
      </VStack>

      {/* Footer text */}
      <Text
        fontSize="xs"
        position="absolute"
        bottom="10"
        left="10"
      >
        Created by the Awaazo team 2024
      </Text>
    </Box>
  );
};

export default Greeting;
