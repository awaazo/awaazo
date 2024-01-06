import React from 'react';
import { useState } from 'react';
import { Button, Icon, Tooltip, Menu, MenuButton, MenuList, MenuItem, SimpleGrid, GridItem, Box, Flex, Text, useToast, HStack, IconButton } from '@chakra-ui/react';
import { FaShareAlt, FaTwitter, FaFacebook, FaInstagram, FaDiscord, FaWhatsapp, FaRedditAlien, FaLinkedin, FaPinterest, FaChevronLeft, FaChevronRight, FaVk, FaTumblr, FaMix, FaBlogger } from 'react-icons/fa';

const ShareComponent = ({ episode }) => {
   const toast = useToast();
   const [scrollIndex, setScrollIndex] = React.useState(0);

   
   const platforms = [
      { name: 'Twitter', icon: FaTwitter },
      { name: 'Facebook', icon: FaFacebook },
      { name: 'Instagram', icon: FaInstagram },
      { name: 'Discord', icon: FaDiscord },
      { name: 'WhatsApp', icon: FaWhatsapp },
      { name: 'Reddit', icon: FaRedditAlien },
      { name: 'LinkedIn', icon: FaLinkedin },
      { name: 'Pinterest', icon: FaPinterest },
      { name: 'Tumblr', icon: FaTumblr },
      { name: 'Mix', icon: FaMix },
      { name: 'Blogger', icon: FaBlogger },
      { name: 'VK', icon: FaVk },
   ];

   // Function to handle scroll left
  const scrollLeft = () => {
    setScrollIndex((prevIndex) => Math.max(prevIndex - 4, 0));
  };

  // Function to handle scroll right
  const scrollRight = () => {
    setScrollIndex((prevIndex) => Math.min(prevIndex + 4, platforms.length - 4));
  };


   const copyToClipboard = text => {
      navigator.clipboard.writeText(text).then(() => {
        alert('Episode details copied to clipboard! Share it on Instagram.');
      }, err => {
        console.error('Could not copy text: ', err);
      });
    };
    
    const shareToInstagram = () => {
      const episodeDetails = `Check out this episode "${episode.episodeName}": ${episode.description}`;
      copyToClipboard(episodeDetails);
    };

    const shareToDiscord = () => {
      const episodeUrl = `http://localhost:3000/Explore/${episode.id}`;
      copyToClipboard(episodeUrl);
    };
    
    const shareToTwitter = () => {
      const episodeUrl = `http://104.221.79.22:3500/Explore/${episode.id || 'defaultId'}`;
      const tweet = `Check out this episode "${episode.episodeName || 'Default Episode Name'}", Description: ${episode.description || 'Default description'}. Listen here: ${episodeUrl}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

   const shareToPlatform = (platform) => {
      const episodeUrl = `http://localhost:3000/Explore/${episode.id || 'defaultId'}`;
      const episodeName = episode.episodeName || 'Default Episode Name';
      const description = episode.description || 'Default description';
      const shareMessage = `Check out this episode "${episodeName}": ${description} ${episodeUrl}`;  
    
      switch (platform) {
        case 'Twitter':
          shareToTwitter();
          break;
        case 'Facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(episodeUrl)}`, '_blank');
          break;
        case 'Instagram':
          shareToInstagram();
          break;
        case 'Discord':
          shareToDiscord();
          break;
        case 'WhatsApp':
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
          break;
        case 'Reddit':
          window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(episodeUrl)}&title=${encodeURIComponent('Check out this episode')}`, '_blank');
          break;
        case 'LinkedIn':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(episodeUrl)}`, '_blank');
          break;
        case 'Pinterest':
          window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(episodeUrl)}&description=${encodeURIComponent(shareMessage)}`, '_blank');
          break;
         case 'Tumblr':
            window.open(`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(episodeUrl)}&title=${encodeURIComponent(episodeName)}&caption=${encodeURIComponent(description)}`, '_blank');
            break;
         case 'Mix':
            window.open(`https://mix.com/add?url=${encodeURIComponent(episodeUrl)}&description=${encodeURIComponent(shareMessage)}`, '_blank');
            break;
         case 'Blogger':
            window.open(`https://www.blogger.com/blog-this.g?u=${encodeURIComponent(episodeUrl)}&n=${encodeURIComponent(episodeName)}&t=${encodeURIComponent(description)}`, '_blank');
            break;
         case 'VK':
            window.open(`https://vk.com/share.php?url=${encodeURIComponent(episodeUrl)}&title=${encodeURIComponent(episodeName)}&description=${encodeURIComponent(description)}`, '_blank');
            break;
        default:
          console.log('Platform not supported');
      }
    };
    
    const ShareIcon = ({ platform, icon }) => (
      <Tooltip label={platform} hasArrow>
          <Box as="button" borderRadius="md" p={1} _hover={{ bg: 'gray.200', color: 'blue.500' }}>
              <Icon as={icon} w={6} h={6} onClick={() => shareToPlatform(platform)} cursor="pointer" />
          </Box>
      </Tooltip>
    );

    return (
        <Box overflow="hidden" p={4}>
          <HStack spacing={6}>
            <IconButton
              aria-label="Scroll left"
              icon={<FaChevronLeft />}
              onClick={scrollLeft}
              isDisabled={scrollIndex === 0}
            />
            {platforms.slice(scrollIndex, scrollIndex + 4).map((platform) => (
              <ShareIcon key={platform.name} platform={platform.name} icon={platform.icon} />
            ))}
            <IconButton
              aria-label="Scroll right"
              icon={<FaChevronRight />}
              onClick={scrollRight}
              isDisabled={scrollIndex === platforms.length - 4}
            />
          </HStack>
        </Box>
      );
    };
  
  

export default ShareComponent;
