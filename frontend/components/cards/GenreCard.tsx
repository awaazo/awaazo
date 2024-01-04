import Link from "next/link";
import { Box, Text, Image } from "@chakra-ui/react";

const GenreCard = ({ genre, isHovered, onMouseEnter, onMouseLeave }) => {
    const scale = isHovered ? "scale(1.1)" : "scale(0.95)";
  
    return (
      <Link href={`/Explore/Genre/${genre.link}`} passHref>
        <Box
          key={genre.name}
          h="100%"
          borderRadius="1.2em"
          overflow="hidden"
          position="relative"
          _hover={{
            boxShadow: "xl",
            cursor: "pointer",
            transition: "all 0.4s ease-in-out",
          }}
          transform={scale}
          transition="all 0.4s ease-in-out"
          boxSizing="border-box"
          outline={"2px solid rgba(255, 255, 255, .3)"}
          onMouseEnter={() => onMouseEnter(genre.name)}
          onMouseLeave={onMouseLeave}
          zIndex={isHovered ? 1 : 0}
        >
          <Image
            src={genre.image.src}
            alt={`${genre.name} background`}
            width="100%"
            height="100%"
            objectFit="cover"
            opacity="0.8"
          />
          <Text
            fontWeight="bold"
            fontSize={["md", "lg", "xl"]}
            position="absolute"
            left="50%"
            top="50%"
            transform="translate(-50%, -50%)"
            textShadow="2px 2px 4px #000000"
            p={1}
          >
            {genre.name}
          </Text>
        </Box>
      </Link>
    );
  };
  export default GenreCard;
