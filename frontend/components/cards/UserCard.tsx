import {
  Box,
  Image,
  Flex,
  useColorModeValue,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";

// Define the UserCard component
const UserCard = ({ user }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Link href={`/profile/${user.id}`} passHref>
      <Flex
        className="hoverEffect"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingTop={4}
        paddingBottom={3}
        width="100%"
        borderRadius="15px"
        bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")}
        backdropFilter="blur(50px)"
        boxShadow="sm"
        style={{ cursor: "pointer", transition: "transform 0.3s" }}
        onClick={() => console.log(user.id)}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Image
          src={user.avatarUrl}
          alt="Profile Pic"
          borderRadius="full"
          boxSize={isMobile ? "75px" : "125px"}
          mb={4}
        />
        <Box>
          <Text fontWeight="bold">
            {user.displayName}
          </Text>
          <Text data-cy={`user-card-${user.username}`}>@{user.username}</Text>
        </Box>
      </Flex>
    </Link>
  );
};

export default UserCard;
