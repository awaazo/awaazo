import React, { useState } from 'react'
import { Menu, MenuButton, MenuList, MenuItem, Button, Text, Box, Image } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

const languages = [
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/us.svg' },
  { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/fr.svg' },
  { code: 'es', label: 'Español', flag: 'https://flagcdn.com/es.svg' },
  // Add more languages here
]

const LanguageSelector = ({ changeLanguage }) => {
  const [selectedFlag, setSelectedFlag] = useState(languages[0].flag);

  const handleLanguageChange = (code, flag) => {
    changeLanguage(code);
    setSelectedFlag(flag);
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="minimal">
        <Image src={selectedFlag} alt="Selected language flag" boxSize="15px"  />
      </MenuButton>
      <MenuList minWidth="100px">
        {languages.map((language) => (
          <MenuItem key={language.code} onClick={() => handleLanguageChange(language.code, language.flag)}>
            <Box display="flex" alignItems="center">
              <Image src={language.flag} alt={`${language.code} flag`} boxSize="20px" mr="8px" />
              <Text>{language.code.toUpperCase()}</Text>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default LanguageSelector
