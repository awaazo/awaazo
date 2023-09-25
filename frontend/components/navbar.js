// components/Navbar.js
import { Box, Flex, Heading, Spacer, VStack, Link } from "@chakra-ui/react";
import NextLink from "next/link"; // Import Next.js Link component

export default function Navbar() {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.5)"
      backdropFilter="blur(10px)"
      py={4}
      px={6}
      pos="fixed"
      w="100%"
      zIndex={999}
    >
      <Flex maxW="container.xl" mx="auto" alignItems="center">
        <Heading size="lg">My Website</Heading>
        <Spacer />
        <VStack spacing={2}>
          <NextLink href="/" passHref>
            <Link>Home</Link>
          </NextLink>
          <NextLink href="/about" passHref>
            <Link>About</Link>
          </NextLink>
          {/* Add more navigation links here */}
        </VStack>
      </Flex>
    </Box>
  );
}
