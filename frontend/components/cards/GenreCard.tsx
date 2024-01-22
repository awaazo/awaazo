import Link from "next/link";
import { Box, Image } from "@chakra-ui/react";

const GenreCard = ({ genre, onMouseEnter, onMouseLeave }) => {
  return (
    <Link href={`/Explore/Genre/${genre.link}`} passHref>
      <Box
        h="180px"
        w="180px"
        borderRadius="30px"
        overflow="hidden"
        position="relative"
        _hover={{
          opacity: "0.7",
          cursor: "pointer",
          transition: "box-shadow 0.3s ease-in-out, opacity 0.5s ease-in-out",
        }}
        boxSizing="border-box"
        onMouseEnter={() => onMouseEnter(genre.name)}
        onMouseLeave={onMouseLeave}
      >
        <Image src={genre.image.src} alt={`${genre.name} background`} width="100%" height="100%" objectFit="cover" />
      </Box>
    </Link>
  );
};

export default GenreCard;
