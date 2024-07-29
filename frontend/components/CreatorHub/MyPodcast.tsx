import React from 'react'
import { Box } from '@chakra-ui/react'
import CustomTabs from '../assets/CustomTabs'
import PodcastInfo from './PodcastInfo'
import AddEpisode from './AddEpisode'
import Analytics from './Analytics'
import { useTranslation } from 'react-i18next'

export default function MyPodcast({ podcastId }) {
  const { t } = useTranslation()

  const tabItems = [
    { label: t('myPodcast.podcastInfo'), component: <PodcastInfo podcastId={podcastId} /> },
    { label: t('myPodcast.addEpisode'), component: <AddEpisode podcastId={podcastId} /> },
    { label: t('myPodcast.analytics'), component: <Analytics podcastId={podcastId} /> },
  ]

  return (
    <Box
      p={4}
      mt={'2em'}
      borderWidth="1px"
      borderRadius="1em"
      padding={'1.5em'}
      bg="rgba(255, 255, 255, 0.05)"
      backdropFilter={'blur(50px)'}
      boxShadow={'0px 4px 4px rgba(0, 0, 0, 0.35)'}
      minHeight={'200px'}
    >
      <CustomTabs tabItems={tabItems} />
    </Box>
  )
}
