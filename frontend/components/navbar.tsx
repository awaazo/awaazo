import React from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
  Image,
  VStack,
  MenuGroup,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  MoonIcon,
  SunIcon,
  ViewIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import logo from "../styles/images/logo.png";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href: string; // Add href prop
}

const Links = [
  { label: "Home", url: "/" }, // Specify the actual routes
  { label: "Explore", url: "/Explore" },
  { label: "My Podcasts", url: "/MyPodcasts" },
];

const NavLink = (props: Props) => {
  const { children, href } = props; // Use href instead of href

  return (
    <Link href={href}>
      {" "}
      {/* Use Next.js Link */}
      <a>
        <Box
          px={3}
          py={1}
          rounded={"250px"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
        >
          {children}
        </Box>
      </a>
    </Link>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleColorModeToggle = () => {
    toggleColorMode();
  };

  return (
    <>
      <Box
        bg={useColorModeValue("#FFFFFF40", "#0000003D")}
        backdropFilter="blur(100px)" // Add a backdrop filter to the background
        px={12}
        position="fixed" // Set the navbar to fixed positioning
        top={0} // Position it at the top of the viewport
        width="100%" // Make it span the entire width
        zIndex={999} // Set a high z-index to ensure it's above other elements
      >
        <Flex
          h={"7em"}
          alignItems={"center"}
          justifyContent={"space-between"}
          position="relative" // Set the parent container to relative positioning
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box display={{ base: "none", md: "flex" }}>🎙️ Awaazo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link.label} href={link.url}>
                  {" "}
                  {/* Use href prop */}
                  {link.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex
            alignItems="center"
            justifyContent="center"
            position="absolute" // Set the logo container to absolute positioning
            top="50%" // Center vertically
            left="50%" // Center horizontally
            transform="translate(-50%, -50%)" // Center exactly in the middle
          >
            <Box maxWidth={"10em"}>
              <Image src={logo.src} alt="logo" boxShadow={"20px"} />
            </Box>
          </Flex>
          <Flex alignItems={"center"}>
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
              onClick={handleColorModeToggle}
              variant="ghost"
              size="md"
              rounded={"full"}
              mr={4}
            />

            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"md"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                  style={{
                    boxShadow: "0 0 0 2px #fff",
                  }}
                />
              </MenuButton>
              <MenuList className="translucent-menu">
                <MenuGroup>
                  <MenuItem>UserName</MenuItem>
                  <MenuDivider />
                  <MenuItem>My Account</MenuItem>
                  <MenuItem>Payments</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Help">
                  <MenuItem>Docs</MenuItem>
                  <MenuItem>FAQ</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.label} href={link.url}>
                  {link.label}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
