import React from "react";
import {
  Box,
  Flex,
  IconButton,
  useBreakpointValue,
  Text,
  Image,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { BsExplicitFill } from "react-icons/bs";
import { usePlayer } from "../../utilities/PlayerContext";
import LikeComponent from "../social/Likes";
import CommentComponent from "../social/Comments";
import { convertTime } from "../../utilities/commonUtils";
import EpisodeMenu from "./EpisodeMenu";
import Tipjar from "../social/Tipjar";

// Component to display an episode
const EpisodeCard = ({ episode, inPlaylist, playlistId, inWallet }) => {
  const { dispatch } = usePlayer();
  const toast = useToast();

  // Handle click on episode
  const handleEpisodeClick = () => {
    dispatch({
      type: "PLAY_NOW_QUEUE",
      payload: episode,
    });
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      paddingTop={3}
      paddingBottom={3}
      mt={3}
      width="100%"
      borderRadius="15px"
      bg={"rgba(0, 0, 0, 0.2)"}
      boxShadow="sm"
      style={{ cursor: "pointer" }}
      onClick={isMobile ? handleEpisodeClick : null}
      onDoubleClick={handleEpisodeClick}
    >
      <Box position="relative" mr={5} onClick={() => handleEpisodeClick()}>
        <Image
          boxSize={isMobile ? "0px" : "125px"}
          src={episode.thumbnailUrl}
          borderRadius="10%"
          marginLeft={isMobile ? "0px" : "20px"}
          mt={1}
        />
        {!isMobile && (
          <IconButton
            aria-label="Play"
            icon={<FaPlay />}
            position="absolute"
            left="60%"
            top="50%"
            transform="translate(-50%, -50%)"
            variant="ghost"
            fontSize="25px"
            shadow={"md"}
            _hover={{ boxShadow: "lg" }}
          />
        )}
      </Box>
      <Flex direction="column" flex={1}>
        {/* Episode Name */}
        <Text fontWeight="medium" fontSize={isMobile ? "sm" : "2xl"}>
          {episode.episodeName}
          {episode.isExplicit && (
            <Icon
              as={BsExplicitFill}
              boxSize={isMobile ? "10px" : "16px"}
              ml={4}
            />
          )}
          <Text fontSize={isMobile ? "md" : "md"}>🎧 {episode.playCount}</Text>
        </Text>
        {/* Episode Details */}
        <Flex direction="column" fontSize="sm" color={"gray.500"}>
          {isMobile ? null : <Text>{episode.description}</Text>}

          <Text fontWeight="bold" fontSize={isMobile ? "12px" : "md"}>
            Duration: {convertTime(episode.duration)}
          </Text>
        </Flex>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex alignItems="flex-start" style={{ marginRight: "15px" }}>
        {/* Make sure Point is only rendered when inWallet is true */}
        {inWallet != null && inWallet == true ? (
          <Tipjar episodeId={episode.id} totalPoint={episode.totalPoints} />
        ) : (
          <>
            <CommentComponent
              episodeIdOrCommentId={episode.id}
              initialComments={episode.comments.length}
              showCount={true}
            />
            <Box
              marginTop="4px"
              marginLeft="4px"
              data-cy={`likes-on-${episode.episodeName}-${episode.likes}`}
            >
              <LikeComponent
                episodeOrCommentId={episode.id}
                initialLikes={episode.likes}
                showCount={true}
              />
            </Box>
            <EpisodeMenu
              episode={episode}
              inPlaylist={inPlaylist}
              playlistId={playlistId}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default EpisodeCard;
