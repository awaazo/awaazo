import React from 'react';
import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next';
import CustomTabs from '../assets/CustomTabs';
import RecentlyUploaded from './RecentlyUploaded';
import ForYou from './ForYou';
import HighLights from '../highlights/Highlights';
import History from './History';


const Home = () => {
  const { t } = useTranslation();

  const tabItems = [
    { label: t('home.forYou'), component: <ForYou /> },
    { label: t('home.recentlyUploaded'), component: <RecentlyUploaded /> },
    { label: t('home.highlights'), component: <HighLights />},
    { label: t('home.history'), component: <History />},
  ];

  return (
    <Box px={['1em', '2em', '4em']} minH="100vh">
      <CustomTabs tabItems={tabItems} />
    </Box>
  );
};

export default Home;
