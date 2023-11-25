import { useEffect, useState } from "react";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { CiBookmarkPlus } from "react-icons/ci";
import SocialHelper from "../../helpers/SocialHelper";

// This component represents a like button for an episode or comment
const BookmarkComponent = ({ episodeId, selectedTimestamp}) => {
  // Component Values


  const [isBookmarked, setIsBookmarked] = useState(false);

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
