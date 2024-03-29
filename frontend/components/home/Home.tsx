import React from 'react';
import { Box } from '@chakra-ui/react'
import CustomTabs from '../assets/CustomTabs';
import RecentlyUploaded from './RecentlyUploaded';
import ForYou from './ForYou';
import HighLights from '../highlights/Highlights';


const Home = () => {
  const tabItems = [
    { label: 'For You', component: <ForYou /> },
    { label: 'Recently Uploaded', component: <RecentlyUploaded /> },
    { label: 'Highlights', component: <HighLights />},
  ];

  return (
    <Box px={['1em', '2em', '4em']} minH="100vh">
      <CustomTabs tabItems={tabItems} />
    </Box>
  );
};

export default Home;
