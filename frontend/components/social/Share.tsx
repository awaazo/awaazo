import React, { useState } from "react";
import { Box, Icon, Tooltip, IconButton, HStack } from "@chakra-ui/react";
import { FaTwitter, FaFacebook, FaInstagram, FaDiscord, FaWhatsapp, FaRedditAlien, FaLinkedin, FaPinterest, FaChevronLeft, FaChevronRight, FaVk, FaTumblr, FaMix, FaBlogger } from "react-icons/fa";

const Share = ({ content, contentType }) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  const platforms = [
    { name: "Twitter", icon: FaTwitter },
    { name: "Facebook", icon: FaFacebook },
    { name: "Instagram", icon: FaInstagram },
    { name: "Discord", icon: FaDiscord },
    { name: "WhatsApp", icon: FaWhatsapp },
    { name: "Reddit", icon: FaRedditAlien },
    { name: "LinkedIn", icon: FaLinkedin },
    { name: "Pinterest", icon: FaPinterest },
    { name: "Tumblr", icon: FaTumblr },
    { name: "Mix", icon: FaMix },
    { name: "Blogger", icon: FaBlogger },
    { name: "VK", icon: FaVk },
  ];

  const scrollLeft = () => setScrollIndex(Math.max(scrollIndex - 4, 0));
  const scrollRight = () => setScrollIndex(Math.min(scrollIndex + 4, platforms.length - 4));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} details copied to clipboard!`);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const constructSharingDetails = () => {
    const baseUrl = contentType === "episode" ? "http://104.221.79.22:3500/Explore/" : "http://104.221.79.22:3500/Playlist/";
    const url = `${baseUrl}${content.id || "defaultId"}`;
    const name = content.name || content.episodeName || "Default Name";
    const description = content.description || "Default description";
    return { url, name, description };
  };

  const shareToPlatform = (platform) => {
    const { url, name, description } = constructSharingDetails();
    const shareMessage = `Check out this ${contentType} "${name}", Description: ${description}. Listen here: ${url}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedMsg = encodeURIComponent(shareMessage);

    switch (platform) {
      case "Twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodedMsg}`, "_blank");
        break;
      case "Facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
        break;
      case "Instagram":
        copyToClipboard(shareMessage);
        break;
      case "Discord":
        copyToClipboard(url);
        break;
      case "WhatsApp":
        window.open(`https://api.whatsapp.com/send?text=${encodedMsg}`, "_blank");
        break;
      case "Reddit":
        window.open(`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(name)}`, "_blank");
        break;
      case "LinkedIn":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank");
        break;
      case "Pinterest":
        window.open(`https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedMsg}`, "_blank");
        break;
      case "Tumblr":
        window.open(`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&title=${encodeURIComponent(name)}&caption=${encodeURIComponent(description)}`, "_blank");
        break;
      case "Mix":
        window.open(`https://mix.com/add?url=${encodedUrl}&description=${encodedMsg}`, "_blank");
        break;
      case "Blogger":
        window.open(`https://www.blogger.com/blog-this.g?u=${encodedUrl}&n=${encodeURIComponent(name)}&t=${encodeURIComponent(description)}`, "_blank");
        break;
      case "VK":
        window.open(`https://vk.com/share.php?url=${encodedUrl}&title=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`, "_blank");
        break;
      default:
        console.log("Platform not supported");
    }
  };

  const ShareIcon = ({ platform, icon }) => (
    <Tooltip label={platform.name} hasArrow>
      <Box as="button" borderRadius="md" p={1} _hover={{ bg: "gray.200", color: "blue.500" }}>
        <Icon as={icon} w={6} h={6} onClick={() => shareToPlatform(platform.name)} cursor="pointer" />
      </Box>
    </Tooltip>
  );

  return (
    <Box overflow="hidden" p={4}>
      <HStack spacing={6}>
        <IconButton aria-label="Scroll left" icon={<FaChevronLeft />} onClick={scrollLeft} isDisabled={scrollIndex === 0} />
        {platforms.slice(scrollIndex, scrollIndex + 4).map((platform) => (
          <ShareIcon key={platform.name} platform={platform} icon={platform.icon} />
        ))}
        <IconButton aria-label="Scroll right" icon={<FaChevronRight />} onClick={scrollRight} isDisabled={scrollIndex === platforms.length - 4} />
      </HStack>
    </Box>
  );
};

export default Share;
