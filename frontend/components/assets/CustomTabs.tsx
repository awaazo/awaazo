import React, { useState, ReactNode } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Icon, Text, HStack } from '@chakra-ui/react';
import { AwaazoA } from '../../public/icons';

interface TabItem {
  label: string;
  component: ReactNode;
}

interface CustomTabsProps {
  tabItems: TabItem[];
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabItems }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const iconStyle = (isCurrentTab) => ({
    boxSize: '0.7em',
    color: 'az.red',
    mb: 3,
    mr: 0.5,
    animation: isCurrentTab ? `pop 0.7s ease-in-out` : 'none',
  });

  return (
    <Tabs index={tabIndex} onChange={handleTabsChange} isFitted variant="withIconOnSelected">
      <TabList mb="1em">
        <HStack spacing="0.5em">
          {tabItems.map((item, index) => (
            <Tab key={item.label}>
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                {tabIndex === index && AwaazoA && <Icon as={AwaazoA} {...iconStyle(tabIndex === index)} />}
                <Text whiteSpace="nowrap">{item.label}</Text>
              </Box>
            </Tab>
          ))}
        </HStack>
      </TabList>
      <TabPanels>
        {tabItems.map((item, index) => (
          <TabPanel key={item.label}>
            {item.component}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default CustomTabs;
