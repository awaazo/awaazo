import { Box, Image, Text } from '@chakra-ui/react';

interface TicketProps {
  name: string;
  length: string;
  likes: number;
  views: number;
  podcaster: string;
  coverArtUrl: string;
}

const Ticket = ({ name, length, likes, views, podcaster, coverArtUrl }: TicketProps) => {
  return (
    <Box borderRadius="md" p={4} bg="white">
      <Image src={coverArtUrl} borderRadius="md" />
      {/* ...other ticket content */}
    </Box>
  );
};

export default Ticket;
