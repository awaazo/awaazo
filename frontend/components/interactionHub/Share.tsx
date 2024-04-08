import React, { useState } from 'react'
import { Box, Icon,  IconButton, HStack, Button } from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaDiscord, FaWhatsapp, FaRedditAlien, FaLinkedin, FaPinterest, FaVk, FaTumblr, FaMix, FaBlogger } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { ArrowR, ArrowL } from '../../public/icons'
const Share = ({ content, contentType }) => {
  const [scrollIndex, setScrollIndex] = useState(0)

  const platforms = [
    { name: 'X', icon: FaXTwitter },
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
  ]

  const scrollLeft = () => setScrollIndex(Math.max(scrollIndex - 4, 0))
  const scrollRight = () => setScrollIndex(Math.min(scrollIndex + 4, platforms.length - 4))

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} details copied to clipboard!`)
      },
      (err) => {
        console.error('Could not copy text: ', err)
      }
    )
  }

  const constructSharingDetails = () => {
    const baseUrl = contentType === 'episode' ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/Explore/` : `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/Playlist/`
    const url = `${baseUrl}${content.id || 'defaultId'}`
    const name = content.name || content.episodeName || 'Default Name'
    const description = content.description || 'Default description'
    return { url, name, description }
  }

  const shareToPlatform = (platform) => {
    const { url, name, description } = constructSharingDetails()
    const shareMessage = `Check out this ${contentType} "${name}", Description: ${description}. Listen here: ${url}`
    const encodedUrl = encodeURIComponent(url)
    const encodedMsg = encodeURIComponent(shareMessage)

    const platformActions = {
      X: () => window.open(`https://twitter.com/intent/tweet?text=${encodedMsg}`, '_blank'),
      Facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank'),
      Instagram: () => copyToClipboard(shareMessage),
      Discord: () => copyToClipboard(url),
      WhatsApp: () => window.open(`https://api.whatsapp.com/send?text=${encodedMsg}`, '_blank'),
      Reddit: () => window.open(`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(name)}`, '_blank'),
      LinkedIn: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank'),
      Pinterest: () => window.open(`https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedMsg}`, '_blank'),
      Tumblr: () => window.open(`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&title=${encodeURIComponent(name)}&caption=${encodeURIComponent(description)}`, '_blank'),
      Mix: () => window.open(`https://mix.com/add?url=${encodedUrl}&description=${encodedMsg}`, '_blank'),
      Blogger: () => window.open(`https://www.blogger.com/blog-this.g?u=${encodedUrl}&n=${encodeURIComponent(name)}&t=${encodeURIComponent(description)}`, '_blank'),
      VK: () => window.open(`https://vk.com/share.php?url=${encodedUrl}&title=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`, '_blank'),
    }

    const action = platformActions[platform]
    if (action) {
      action()
    } else {
      console.log('Platform not supported')
    }
  }

  const ShareIcon = ({ platform, icon }) => (
    <Button variant={'minimalColor'} borderRadius="md" p={1}>
      <Icon as={icon} w={6} h={6} onClick={() => shareToPlatform(platform.name)} cursor="pointer" />
    </Button>
  )

  return (
    <Box overflow="hidden" p={4}>
      <HStack spacing={6}>
        <IconButton variant={'minimal'} aria-label="Scroll left" icon={<ArrowL />} size="md" onClick={scrollLeft} isDisabled={scrollIndex === 0} />
        {platforms.slice(scrollIndex, scrollIndex + 4).map((platform) => (
          <ShareIcon key={platform.name} platform={platform} icon={platform.icon} />
        ))}
        <IconButton variant={'minimal'} aria-label="Scroll right" icon={<ArrowR />} size="md" onClick={scrollRight} isDisabled={scrollIndex === platforms.length - 4} />
      </HStack>
    </Box>
  )
}

export default Share
