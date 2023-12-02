import { useEffect, useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { CiBookmarkPlus } from "react-icons/ci";
import SocialHelper from "../../helpers/SocialHelper";
import AuthHelper from "../../helpers/AuthHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import { Bookmark } from "../../utilities/Interfaces";
import { convertTime } from "../../utilities/commonUtils"; 
import { EpisodeBookmarkRequest } from "../../utilities/Requests";

// This component represents a bookmark button for an episode
const BookmarkComponent = ({ episodeId, selectedTimestamp}) => {
  // Component Values
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Fetch episode details and transform bookmarks
  useEffect(() => {
      const fetchEpisodeDetails = async () => {
        const response = await PodcastHelper.getEpisodeById(
          episodeId,
        );
        if (response.status === 200) {
          if (response.episode) {
            // Transform the bookmarks to match our format
            const transformedBookmarks = response.episode.bookmarks.map(
              (bookmark) => ({
                id: bookmark.id,
                title: bookmark.title,
                note: bookmark.note,
                timestamp: bookmark.timestamp,
              }),
            );
            setBookmarks(transformedBookmarks);
          }
        } else {
          console.error("Error fetching episode details:", response.message);
        }
      };
      fetchEpisodeDetails();
  }, [episodeId]);



 // Function to handle the bookmark/delete bookmark action
 const handleBookmark = () => {

  console.log("Selected Timestamp:", selectedTimestamp);
  console.log("Episode ID:", episodeId);

  const request: EpisodeBookmarkRequest = {
    title: 'New Bookmark', // Set the title for the new bookmark
    note: 'Something Memorable...', // Set the note for the new bookmark
    time: selectedTimestamp, // Set the timestamp for the new bookmark
  };
  // Send the request
  SocialHelper.postBookmark(episodeId, request)
  .then((response) => {
    if (response.status === 200) {
      // Update the UI to reflect the bookmark
      //setIsBookmarked(true, selectedTimestamp);
      console.log("Bookmarked Episode");
    } else {
      console.error("Error bookmarking episode:", response.message);
    }
  });


  //   const newBookmark = {
  //     id: (bookmarks.length + 1).toString(), // Generate a serial id for the new bookmark. doesnt work if bookmarks get deleted.
  //     title: 'New Bookmark', // Set the title for the new bookmark
  //     note: 'Something Memorable...', // Set the note for the new bookmark
  //     timestamp: selectedTimestamp, // Set the timestamp for the new bookmark
  //   };

  //   setBookmarks([...bookmarks, newBookmark]);

  // SocialHelper.postBookmark(episodeId, selectedTimestamp) // This method needs to be implemented in SocialHelper
  //       .then((response) => {
  //         if (response.status === 200) {
  //           // Update the UI to reflect the bookmark
  //           //setIsBookmarked(true, selectedTimestamp);
  //         } else {
  //           console.error("Error bookmarking episode:", response.message);
  //         }
  //       });

    



  // // Toggle the like status based on whether the episode or comment is currently liked
  // if (isBookmarked) {
  //   // Call unlikeEpisode or unlikeComment because the episode or comment is currently liked
  //   SocialHelper.deleteEpisodeBookmark(episodeOrCommentId) // This method needs to be implemented in SocialHelper
  //     .then((response) => {
  //       if (response.status === 200) {
  //         // Update the UI to reflect the unlike
  //         setLikes(likes - 1);
  //         setIsLiked(false);
  //       } else {
  //         console.error(
  //           "Error unliking episode or comment:",
  //           response.message,
  //         );
  //       }
  //     });
  // } else {
  //   // Call likeEpisode or likeComment because the episode or comment is currently not liked
  //   SocialHelper.postLike(episodeOrCommentId) // This method needs to be implemented in SocialHelper
  //     .then((response) => {
  //       if (response.status === 200) {
  //         // Update the UI to reflect the like
  //         setLikes(likes + 1);
  //         setIsLiked(true);
  //       } else {
  //         console.error("Error liking episode or comment:", response.message);
  //       }
  //     });
  // }
};

  // Function to handle the bookmark/remove bookmark action
 // const handleBookmark = () => {
    // // Toggle the bookmark status based on whether the selected timestamp of the episode is currently bookmarked
    // if (isBookmarked) {
    //   // Call unlikeBookmak because the episode selected timestamp is currently bookmarked
    //   SocialHelper.deleteEpisodeBookmark(episodeId, selectedTimestamp) // This method needs to be implemented in SocialHelper
    //     .then((response) => {
    //       if (response.status === 200) {
    //         // Update the UI to reflect the unlike
    //         setBookmarks(bookmarks, selectedTimestamp)
    //         setIsBookmarked(false);
    //       } else {
    //         console.error(
    //           "Error removing bookmark for the selected timestamp",
    //           response.message,
    //         );
    //       }
    //     });
    // } else {
    //   // Call likeEpisode or likeComment because the episode or comment is currently not liked
    //   SocialHelper.postBookmark(episodeId, selectedTimestamp) // This method needs to be implemented in SocialHelper
    //     .then((response) => {
    //       if (response.status === 200) {
    //         // Update the UI to reflect the like
    //         setBookmarks(bookmarks, selectedTimestamp);
    //         setIsBookmarked(true);
    //       } else {
    //         console.error("Error bokmarking episode selected timestamp", response.message);
    //       }
    //     });
    // }
  //};

  return (
    // bookmarks.map((bookmark,currentTime) => (
    //   <></>
    // ))
    <>
    
      {/* Tooltip to display the like/unlike action */}
      {/* <Tooltip label={isBookmarked ? "Bookmark" : "Remove Bookmark"} aria-label="Bookmark tooltip"> */}
        {/* Button to trigger the like/unlike action */}
        <Button
          variant={"ghost"}
          p={2}
          leftIcon={
            <Icon as={CiBookmarkPlus} color="gray.500" />
            //note:
            //bookmarks.map(bookmark, currentTime)
            //if bookmark.selectedTimestamp == currentTime then make the icon white, else make it grey
          }
          onClick={() => handleBookmark()}
        >
        </Button>
      {/* </Tooltip> */}
    </>
  );
};

export default BookmarkComponent;
