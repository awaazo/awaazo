import React, { useState } from 'react'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Icon, Container, HStack, Text } from '@chakra-ui/react'
import RecentlyUploaded from './RecentlyUploaded'
import ForYou from './ForYou'
import HighLights from '../highlights/Highlights'
import { AwaazoA } from '../../public/icons'

const Home = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabsChange = (index) => {
    setTabIndex(index)
  }

  const iconStyle = (isCurrentTab) => ({
    boxSize: '0.7em',
    color: 'az.red',
    mb: 3,
    mr: 0.5,
    animation: isCurrentTab ? `pop 0.7s ease-in-out` : 'none',
  })

  return (
    <Box px={['1em', '2em', '4em']} minH="100vh">
      <Tabs index={tabIndex} onChange={handleTabsChange} isFitted variant="withIconOnSelected">
        <TabList mb="1em">
          <HStack spacing="1em">
            <Tab justifyContent="center">
              <Box display="flex" flexDirection="row" alignItems="Left" justifyContent="left">
                {tabIndex === 0 && <Icon as={AwaazoA} {...iconStyle(tabIndex === 0)} />}
                <Text whiteSpace="nowrap">For You</Text>
              </Box>
            </Tab>
            <Tab>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                {tabIndex === 1 && <Icon as={AwaazoA} {...iconStyle(tabIndex === 1)} />}
                <Text whiteSpace="nowrap">Recently Uploaded</Text>
              </Box>
            </Tab>
            <Tab>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                {tabIndex === 2 && <Icon as={AwaazoA} {...iconStyle(tabIndex === 2)} />}
                <Text whiteSpace="nowrap">Highlights</Text>
              </Box>
            </Tab>
          </HStack>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ForYou />
          </TabPanel>
          <TabPanel>
            <RecentlyUploaded />
          </TabPanel>
          <TabPanel>
            <HighLights />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Home
