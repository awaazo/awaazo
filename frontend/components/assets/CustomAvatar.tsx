import React from 'react';
import { Avatar, Box, Flex } from '@chakra-ui/react';
import { AwaazoA } from '../../public/icons';

interface CustomAvatarProps {
  imageUrl: string; 
  username: string;
  size?: string; // Optional size property
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({ imageUrl, username, size = 'md' }) => {

  const iconSize = size === 'sm' ? '10px' : size === 'lg' ? '20px' : size === 'xs' ? '5px' : '15px';
  const leftPosition = size === 'lg' ? '-10px' : size === 'xs' ? '-2.5px' : '-5px';

  return (
    <Flex align="center" position="relative">
      <Box position="absolute" zIndex={2} left={leftPosition} top="0px" color="az.red">
        <AwaazoA fontSize={iconSize} />
      </Box>
      <Avatar size={size} name={username} src={imageUrl} />
    </Flex>
  );
};

export default CustomAvatar;
