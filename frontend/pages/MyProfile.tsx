import * as React from 'react';
import {
  Container,
  Avatar,
  Heading,
  Text,
  VStack,
  Stack,
  Link,
  IconButton,
  Divider,
  Flex,
  Box,
  Center,
  HStack,
  Icon,
  Tag,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { FaGithub, FaDev, FaLinkedin, FaQuora, FaTwitter } from 'react-icons/fa';
import { GoChevronRight } from 'react-icons/go';
import Navbar from "../components/navbar"; // Import the Navbar component



const iconProps = {
  variant: 'ghost',
  size: 'lg',
  isRound: true
};

const episodes = [
  {
    id: 1,
    type: 'podcast', // Add a 'type' field to specify that it's a podcast episode
    tags: ['News', 'Product'],
    title: 'Episode 1: Build a Modern User Interface with Chakra UI', // Add 'Episode X:' to the title
    content: `In this episode, we discuss how to build a modern user interface with Chakra UI. Lorem Ipsum is simply dummy text of the printing and typesetting industry. simply dummy text...`,
    userAvatar:
      'https://images.unsplash.com/photo-1606513542745-97629752a13b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
    username: 'Danilo Leal',
    created_at: 'Wed Apr 06 2022'
  },
  {
    id: 2,
    type: 'podcast', // Add 'type' field for the second episode
    tags: ['Web Development', 'Video'],
    title: 'Episode 2: The Complete Guide to Ruby on Rails Encrypted Credentials', // Add 'Episode X:' to the title
    content: `In this episode, we dive deep into the complete guide to Ruby on Rails encrypted credentials. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    userAvatar:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80',
    username: 'Timo Delangle',
    created_at: 'Sun Apr 03 2022'
  }
];


const myProfile = () => {
  return (
    <>
    <Navbar />
    <Container paddingTop={"10em"}>
      <Center>
        <VStack spacing={4} px={2} alignItems={{ base: 'center', sm: 'flex-start' }}>
          <Stack justifyContent="center" alignItems="center">
            <Avatar
              boxShadow="xl"
              size="xl"
              src="https://avatars2.githubusercontent.com/u/37842853?v=4"
            />
          </Stack>
          <Heading
            textAlign={{ base: 'center', sm: 'left' }}
            margin="0 auto"
            width={{ base: '23rem', sm: 'auto' }}
            fontSize={{ base: '2.5rem', sm: '3rem' }}
          >
            The Really Good Podcast
            <br /> 
            <Text fontSize="1.5rem" >
              <span style={{color: useColorModeValue('pink', 'pink')}}>@username</span>
            </Text>
          </Heading>
          <Text textAlign="center">Passionate about Tech. Lover of web and opensource.</Text>
          <Divider />
          <Flex alignItems="center" justify="center" w="100%">
            <Box textAlign="center">
              {accounts.map((sc, index) => (
                <IconButton
                  key={index}
                  as={Link}
                  isExternal
                  href={sc.url}
                  aria-label={sc.label}
                  colorScheme={sc.type}
                  rounded="full"
                  icon={sc.icon}
                  {...iconProps}
                />
              ))}
            </Box>
            <Button rounded={'full'}>
                {/* <Icon as={Follow} w={6} h={6} /> */}
                <Text>Follow</Text>   
                {/*// this will be hidden if the current user is the one viewing his own profile*/}
            </Button>
            <Button rounded={'full'} style={{
                marginLeft: "1em",
            }}>
                {/* <Icon as={Follow} w={6} h={6} /> */}
                <Text>Edit Profile</Text>   
                {/* this will also be hidden for viewing other users' profiles*/}
            </Button>
          </Flex>
        </VStack>
      </Center>
    </Container>
        <Container p={{ base: 5, md: 10 }}>
      <VStack spacing={8} w={{ base: 'auto', md: '2xl' }}>
        {episodes.map((article, index) => (
          <Stack
            key={index}
            direction="column"
            spacing={4}
            p={4}
            bg={useColorModeValue('gray.100', 'gray.800')}
            border="1px solid"
            borderColor="blue.100"
            _hover={{
              borderColor: 'blue.300',
              boxShadow: useColorModeValue(
                '0 4px 6px rgba(160, 174, 192, 0.6)',
                '0 4px 6px rgba(9, 17, 28, 0.9)'
              )
            }}
            rounded="lg"
          >
            <HStack spacing={2} mb={1}>
              {article.tags.map((cat, index) => (
                <Tag
                  key={index}
                  colorScheme={useColorModeValue('blackAlpha', 'gray')}
                  borderRadius="full"
                >
                  {cat}
                </Tag>
              ))}
            </HStack>
            <Box textAlign="left">
              <Link
                fontSize="xl"
                lineHeight={1.2}
                fontWeight="bold"
                w="100%"
                _hover={{ color: 'blue.400', textDecoration: 'underline' }}
              >
                {article.title}
              </Link>
              <Text fontSize="md" color="gray.500" noOfLines={2} lineHeight="normal">
                {article.content}
              </Text>
            </Box>
            <Box>
              <Avatar size="sm" title="Author" mb={2} src={article.userAvatar} />
              <Stack justify="space-between" direction={{ base: 'column', sm: 'row' }}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {article.username}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {article.created_at}
                  </Text>
                </Box>
                <HStack
                  as={Link}
                  spacing={1}
                  p={1}
                  alignItems="center"
                  height="2rem"
                  w="max-content"
                  margin="auto 0"
                  rounded="md"
                  color="blue.400"
                  _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
                >
                  <Text fontSize="sm"> Read more</Text>
                  <Icon as={GoChevronRight} w={4} h={4} />
                </HStack>
              </Stack>
            </Box>
          </Stack>
        ))}
      </VStack>
    </Container>
    </>
  );
};

const accounts = [
  {
    url: 'https://github.com/',
    label: 'Github Account',
    type: 'gray',
    icon: <FaGithub />
  },
  {
    url: 'https://twitter.com/',
    label: 'Twitter Account',
    type: 'twitter',
    icon: <FaTwitter />
  },

  {
    url: 'https://linkedin.com/',
    label: 'LinkedIn Account',
    type: 'linkedin',
    icon: <FaLinkedin />
  },
  {
    url: 'https://www.quora.com/',
    label: 'Quora Account',
    type: 'red',
    icon: <FaQuora />
  }
];

export default myProfile;
