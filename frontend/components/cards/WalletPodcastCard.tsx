import { Box, Text, Flex, Icon, HStack, Avatar, Button } from '@chakra-ui/react'

import { Podcast } from '../../types/Interfaces'
import React from 'react'
import { PiCurrencyDollarSimpleFill } from 'react-icons/pi'

interface PodcastCardProps {
  podcast: Podcast
}
const WalletPodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  return (
    <Box p="0" borderRadius="md" mb="4" width={'100%'} boxShadow="sm">
      <Flex justify="space-between" align="center">
        <HStack>
          <Avatar size={'md'} src={podcast.coverArtUrl} backdropFilter="blur(10px)" />

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {podcast.name}
            </Text>
            <Text color="gray.500">{podcast.description}</Text>
          </Box>
        </HStack>
        <Text justifySelf={'flex-end'} fontWeight="bold" fontSize="lg">
          <Button padding={'0px'} m={1} variant={'ghost'} leftIcon={<Icon as={PiCurrencyDollarSimpleFill} boxSize={'20px'} />}>
            {podcast.totalPodcastPoints}
          </Button>
        </Text>
      </Flex>
    </Box>
  )
}
export default WalletPodcastCard
