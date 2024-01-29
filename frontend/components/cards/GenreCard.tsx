import Link from "next/link";
import { Box, Image } from "@chakra-ui/react";

const GenreCard = ({ genre, onMouseEnter, onMouseLeave }) => {
  return (
    <Link href={`/Explore/Genre/${genre.link}`} passHref>
      <Box
      // // old code
        h="180px"
        w="180px"
      // // new code
      //   width="15em"

        borderRadius="30px"
        overflow="hidden"
        position="relative"
        _hover={{
          opacity: "0.8",
          cursor: "pointer",
          transition: "box-shadow 0.8s ease-in-out, opacity 0.3s ease-in-out",
        }}
        boxSizing="border-box"
        onMouseEnter={() => onMouseEnter(genre.name)}
        onMouseLeave={onMouseLeave}
        boxShadow={"0px 0px 15px rgba(0, 0, 0, 0.4)"}
      >
        <Image src={genre.image.src} alt={`${genre.name} background`} width="100%" height="100%" objectFit="cover" />
      </Box>
    </Link>
  );
};

export default GenreCard;
