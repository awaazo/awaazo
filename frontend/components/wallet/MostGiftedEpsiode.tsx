import { useEffect, useState } from 'react'
import { Flex, IconButton, Tooltip, VStack } from '@chakra-ui/react'

import { Episode } from '../../types/Interfaces'
import PaymentHelper from '../../helpers/PaymentHelper'
import EpisodeCard from '../cards/EpisodeCard'
import { ChevronDownIcon } from '@chakra-ui/icons'

const MostGiftedEpisode = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [page, setPage] = useState(0)
  const pageSize = 3
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const res = await PaymentHelper.GetHighestEarningEpisodes(page, pageSize)
        if (res.status == 200) {
          setEpisodes(res.episode)
        } else {
          console.log('Error occured')
        }
      } catch (error) {
        console.log('Error occured')
      }
    }
    fetchEpisode()
  }, [page])
  // Function to handle clicking the "Load More" button
  const handleLoadMoreClick = () => {
    setPage((page) => page + 1)
  }

  return (
    <>
      <VStack spacing="4">
        {episodes &&
          episodes.map((element, index) => {
            return <EpisodeCard key={index} episode={element} isForPlaylist={false} inWallet={true} />
          })}
      </VStack>
      {episodes[(page + 1) * pageSize - 1] != null && (
        <Flex justify="center" mt={4} alignSelf={'center'}>
          <Tooltip label="Load More" placement="top">
            <IconButton aria-label="Load More" icon={<ChevronDownIcon />} onClick={handleLoadMoreClick} size="lg" variant="minimal" />
          </Tooltip>
        </Flex>
      )}
    </>
  )
}
export default MostGiftedEpisode
