// pages/greeting.tsx
import { Box, Button, Flex, Text, Img, VStack, useBreakpointValue,  } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'
import { useRouter } from 'next/router'
import { FaPlus, } from 'react-icons/fa6'
import { ClientOnly } from '../components/client-only'
import logoGreeting from '../public/svgs/logoGreeting.svg'



const Greeting = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const router = useRouter()
  const MotionImage = motion(Img)
const GreenGradient = () => (
  <Box
    top={["300px", "400px", "600px"]} 
    left={["100px", "500px", "1400px"]} 
    right={0}
    bottom={0}
    style={{
      width: '300px',
      height: '300px',
      transform: 'rotate(17deg)',
      transformOrigin: '0 0',
      opacity: 0.2,
      background: 'linear-gradient(180deg, #89DBBD 0%, #FFD569 99%)',
      boxShadow: '85.9000015258789px 85.9000015258789px 85.9000015258789px',
      borderRadius: 9999,
      filter: 'blur(85.90px)',
      transition: 'all 0.5s ease-in-out',
    }}
    zIndex={1}
  />
)

const RedGradient = () => (
  <Box
  top={400}
  left={700}
  right={0}
  bottom={0}
  style={{
    width: '195px',
    height: '195px',
    transform: 'rotate(17deg)',
    transformOrigin: '0 0',
    background: 'linear-gradient(180deg, #FF6B60 21%, #FFD569 100%)',
    boxShadow: '85.9000015258789px 85.9000015258789px 85.9000015258789px',
    borderRadius: 9999,
    filter: 'blur(85.90px)',
    animation: `rotateBox 2s linear infinite`,
    transition: 'all 0.5s ease-in-out',
  }}
  zIndex={0}
/>
)
  return (
    <ClientOnly>
      <Box bg={'az.blackish'} h="100vh" overflow="hidden" px={8} py={10}>
        <Flex justify="center" align="center" h="100%">
          
          <VStack align="center" spacing={8}>
          <Img src={logoGreeting.src} alt="Logo Greeting" />
           
          <RedGradient/>
            <GreenGradient/>
            <Box bg={`az.darkGrey`} p={'2.5em'} borderRadius={'20px'} boxShadow="lg" w="full" maxW="xl" height={'60%'} position="relative">
              <MotionImage
                src="/svgs/waazoFlying.svg"
                alt="Awaazo Flying"
                boxSize="300px"
                position="absolute"
                left="12em"
                top="-12em"
                transform="translateX(-50%)"
                animate={{ rotate: [0, 10, -10, 0], x: [0, 5, -5, 0], y: [0, -5, 5, 0] }}
                transition={{ duration: 10, ease: 'easeInOut', loop: Infinity, repeatDelay: 1 }}
                zIndex={2}
              />

              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="grid"
                gridGap="2px"
                gridTemplateColumns="repeat(auto-fill, 30px)"
                gridTemplateRows="repeat(auto-fill, 30px)"
                justifyItems="center"
                alignItems="center"
                overflow="hidden"
                zIndex={1}
              >
                {Array.from({ length: 300 }).map((_, index) => (
                  <FaPlus key={index} size={20} color="#2D2D2D" />
                ))}
              </Box>

              <VStack align="center" justify="space-between" spacing={8} h="100%">
                <Box zIndex={3}>
                  <VStack align="left" spacing={0}>
                    <Text fontSize="lg" opacity={0.5} fontWeight={'bold'} color={'az.greyish'}>
                      Welcome to
                    </Text>
                    <Text fontSize="xxl" fontWeight={'bold'} mt={-3}>
                      AWAAZO.
                    </Text>
                    <Text fontSize="sm" fontWeight={'normal'} color={'az.greyish'} mt={-1}>
                      Awaazo revolutionizes podcasting by blending traditional streaming with advanced AI tools for content creation, discovery, and interaction, featuring live transcripts, a
                      knowledgeable AI assistant, a diverse library, and a community for creators to share insights.
                    </Text>
                  </VStack>

                  <VStack spacing={5} align="stretch" mt="1.5rem">
                    <Button
                      onClick={() => router.push('/auth/Signup')}
                      variant="large"
                      background="az.green"
                      _hover={{
                        background: '#AAE5CF',
                        color: 'white',
                      }}
                      transition="all 0.3s ease-in-out"
                    >
                      GET STARTED
                    </Button>
                    <Button
                      onClick={() => router.push('/auth/Login')}
                      variant="large"
                      background="az.yellow"
                      _hover={{
                        background: '#FFE193',
                        color: 'white',
                      }}
                      transition="all 0.3s ease-in-out"
                    >
                      I ALREADY HAVE AN ACCOUNT
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <Text fontSize="xs"> © Created by the Awaazo team 2024. </Text>
          </VStack>
        </Flex>
      </Box>
    </ClientOnly>
  )
}

export default Greeting
