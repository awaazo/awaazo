import { useState, FormEvent } from "react";
import { Box, Button, Icon, FormControl, Textarea, VStack, HStack, Text, Input, FormHelperText } from "@chakra-ui/react";
import { MdBookmarkAdd } from "react-icons/md";
import BookmarksHelper from "../../helpers/BookmarksHelper";
import { convertTime } from "../../utilities/commonUtils";
import { EpisodeBookmarkRequest } from "../../types/Requests";

const Bookmarks = ({ episodeId, selectedTimestamp }) => {
  const [formData, setFormData] = useState({ title: "", note: "" });
  const [characterCounts, setCharacterCounts] = useState({ title: 0, note: 0 });
  const [bookmarkError, setBookmarkError] = useState("");
  const MAX_CHARS = { title: 25, note: 250 };

  const handleChange = (field) => (e) => {
    const value = e.target.value.slice(0, MAX_CHARS[field]);
    setFormData({ ...formData, [field]: value });
    setCharacterCounts({ ...characterCounts, [field]: value.length });
  };

  const handleBookmark = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.note) {
      setBookmarkError("Bookmark Title and Note are Both Required");
      return;
    }

    const request: EpisodeBookmarkRequest = {
      title: formData.title,
      note: formData.note,
      time: selectedTimestamp,
    };

    try {
      const response = await BookmarksHelper.postBookmark(episodeId, request);
      if (response.status === 200) {
        setFormData({ title: "", note: "" });
        console.log("Bookmarked Episode");
      } else {
        console.error("Error bookmarking episode:", response.message);
      }
    } catch (error) {
      console.error("Error bookmarking episode:", error);
    }
  };

  return (
    <>
      {bookmarkError && <Text color="red.500">{bookmarkError}</Text>}
      <VStack spacing={5} align="center" p={5}>
        <Box p={4} bg="rgba(255, 255, 255, 0.08)" rounded="xl" w="full" backdropFilter="blur(10px)">
          <HStack align="center">
            <Icon as={MdBookmarkAdd} color="brand.100" size="24px" style={{ marginBottom: "3px" }} />
            <Text fontSize="sm" fontWeight="bold">
              Selected Timestamp:
            </Text>
            <Text fontSize="lg" color="brand.100">
              {convertTime(selectedTimestamp)}
            </Text>
          </HStack>
        </Box>
        <VStack position="fixed" bottom="0" width="100%" p={"20px"}>
          <FormControl isInvalid={characterCounts.title > MAX_CHARS.title}>
            <Input placeholder="Enter A Title" rounded="xl" value={formData.title} onChange={handleChange("title")} maxLength={MAX_CHARS.title} />
            <FormHelperText textAlign="right">
              {characterCounts.title}/{MAX_CHARS.title}
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={characterCounts.note > MAX_CHARS.note}>
            <Textarea placeholder="Enter A Note" value={formData.note} onChange={handleChange("note")} maxLength={MAX_CHARS.note} h="10rem" />
            <FormHelperText textAlign="right">
              {characterCounts.note}/{MAX_CHARS.note}
            </FormHelperText>
          </FormControl>

          <Button leftIcon={<Icon as={MdBookmarkAdd} />} onClick={handleBookmark} variant="gradient">
            Add Bookmark
          </Button>
        </VStack>
      </VStack>
    </>
  );
};

export default Bookmarks;
