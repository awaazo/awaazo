import { useEffect, useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { CiBookmarkPlus } from "react-icons/ci";
import SocialHelper from "../../helpers/SocialHelper";
import AuthHelper from "../../helpers/AuthHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import { Bookmark } from "../../utilities/Interfaces";

// This component represents a like button for an episode or comment
const BookmarkComponent = ({ episodeId, selectedTimestamp}) => {
  // Component Values


  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const bookmarkResponse = await SocialHelper.isBookmarked(episodeId, selectedTimestamp);
//         setIsBookmarked(bookmarkResponse.isBookmarked);
//       } catch (error) {
//         console.error("Error fetching bookmark status:", error);
//       }
//     };

//     fetchData();
//   }, [episodeId]);


  // Fetch episode details and transform comments when the modal is opened
  useEffect(() => {

      const fetchEpisodeDetails = async () => {
        // AuthHelper.authMeRequest().then((response) => {
        //   if (response.status == 200) {
        //     setUser(response.userMenuInfo);
        //   }
        // });
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



// Add a new bookmark
// const handleAddBookmark = async () => {
//   if (newComment.trim()) {
//     const response = await SocialHelper.postEpisodeComment(
//       newComment,
//       episodeIdOrCommentId,
//     );
//     if (response.status === 200) {
//       // Update the UI to reflect the new bookmark
//       setBookmark(selectedTimestamp);
//     } else {
//       console.log("Error posting bookmark:", response.message);
//     }
//   }
// };

  // Function to handle the bookmark/remove bookmark action
  const handleBookmark = () => {
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
  };

  return (
    <>
      {/* Tooltip to display the like/unlike action */}
      <Tooltip label={isBookmarked ? "Bookmark" : "Remove Bookmark"} aria-label="Bookmark tooltip">
        {/* Button to trigger the like/unlike action */}
        <Button
          variant={"ghost"}
          p={2}
          leftIcon={
            <Icon as={CiBookmarkPlus} color="gray.500" />
          }
          onClick={() => handleBookmark()}
        >
        </Button>
      </Tooltip>
    </>
  );
};

export default BookmarkComponent;
