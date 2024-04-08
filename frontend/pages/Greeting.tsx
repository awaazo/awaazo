// pages/greeting.tsx
import { Box, Button, Flex, Text, useColorModeValue, Img, keyframes, VStack, useBreakpointValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'
import { useRouter } from 'next/router'
const MotionImage = motion(Img)
import { FaPlus } from 'react-icons/fa6'
import { ClientOnly } from '../components/client-only'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Greeting = () => {
  const bg = useColorModeValue('white', 'az.blackish')
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })

  return isMobile ? (
    <ClientOnly>
      <Box bg={bg} h="100vh" overflow="hidden" px={8} py={12}>
        {/* Logo awaazologo.png*/}
        <VStack align="center" justify="flex-end" h="100%" spacing={8}>
          {/* white box */}
          <Box
            bg={`rgba(255, 255, 255, 0.15)`}
            p={'2.5em'}
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
                  <Text fontSize="2em" opacity={0.5} fontWeight={'bold'}>
                    Welcome to
                  </Text>
                  <Text fontSize="2em" fontWeight={'extrabold'}>
                    AWAAZO.
                  </Text>
                  <br />
                  <Text fontSize="15px" fontWeight={'extrabold'}>
                    Awaazo revolutionizes podcasting by blending traditional streaming with advanced AI tools for content creation, discovery, and interaction, featuring live transcripts, a
                    knowledgeable AI assistant, a diverse library, and a community for creators to share insights.
                  </Text>
                </Text>
                {/* Login and sign up buttons */}
                <VStack spacing={5} align="stretch">
                  <Button colorScheme="teal" size="lg" onClick={() => router.push('/auth/Signup')} borderRadius="17px" fontSize={'1em'} boxShadow="md">
                    GET STARTED
                  </Button>
                  <Button colorScheme="orange" size="lg" onClick={() => router.push('/auth/Login')} borderRadius="17px" fontSize={'1em'} boxShadow="md">
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
        </VStack>
      </Box>
    </ClientOnly>
  ) : (
    <ClientOnly>
      <Box bg={bg} h="100vh" overflow="hidden" px={8} py={12}>
        <Flex justify="center" align="center" h="100%">
          <VStack align="center" spacing={8}>
            <Box
              bg={`rgba(255, 255, 255, 0.15)`}
              p={'2.5em'}
              borderRadius={20}
              boxShadow="lg"
              w="full"
              maxW="xl"
              height={'60%'}
              position="relative"
              style={{
                position: 'relative', // Ensure the plus pattern box is contained within this box
              }}
            >
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
                zIndex={0}
              >
                {Array.from({ length: 200 }).map((_, index) => (
                  <FaPlus key={index} size={20} color="#0000002A" />
                ))}
              </Box>
              <MotionImage
                src="/svgs/waazoFlying.svg"
                alt="Awaazo Flying"
                boxSize="250px"
                position="absolute"
                left="11em"
                top="-10em"
                transform="translateX(-50%)"
                animate={{ rotate: [0, 10, -10, 0], x: [0, 5, -5, 0], y: [0, -5, 5, 0] }}
                transition={{ duration: 10, ease: 'easeInOut', loop: Infinity, repeatDelay: 1 }}
              />

              <VStack align="center" justify="space-between" spacing={8} h="100%">
                <Box flex="1" />
                <VStack spacing={10} justify="flex-end">
                  <Text align="left">
                    <Text fontSize="2em" opacity={0.5} fontWeight={'bold'}>
                      Welcome to
                    </Text>
                    <Text fontSize="2em" fontWeight={'extrabold'}>
                      AWAAZO.
                    </Text>
                    <br />
                    <Text fontSize="15px" fontWeight={'extrabold'}>
                      Awaazo revolutionizes podcasting by blending traditional streaming with advanced AI tools for content creation, discovery, and interaction, featuring live transcripts, a
                      knowledgeable AI assistant, a diverse library, and a community for creators to share insights.
                    </Text>
                  </Text>
                  <VStack spacing={5} align="stretch">
                    <Button colorScheme="teal" size="lg" onClick={() => router.push('/auth/Signup')} borderRadius="17px" fontSize={'1em'} boxShadow="md">
                      GET STARTED
                    </Button>
                    <Button colorScheme="orange" size="lg" onClick={() => router.push('/auth/Login')} borderRadius="17px" fontSize={'1em'} boxShadow="md">
                      I ALREADY HAVE AN ACCOUNT
                    </Button>
                  </VStack>
                </VStack>
              </VStack>
            </Box>
            <Text fontSize="xs">Created by the Awaazo team 2024</Text>
          </VStack>
        </Flex>
      </Box>
    </ClientOnly>
  )
}

export default Greeting
