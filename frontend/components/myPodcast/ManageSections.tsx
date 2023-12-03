import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Text,
  IconButton,
  Input,
  Tooltip,
  HStack,
  FormControl,
  Textarea,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import PlayingBar from "./PlayingBar";
import SectionHelper from "../../helpers/SectionHelper";
import { Section } from "../../utilities/Interfaces";
import { SectionAddRequest } from "../../utilities/Requests";

const ManageSections = ({ episodeId, podcastId }) => {
  // Form values
  const [sections, setSections] = useState<Section[]>(null);
  const [sectionCount, setSectionsCount] = useState<number>(0);
  const [newSection, setNewSection] = useState({
    title: "",
    start: 0,
    end: 0,
  });
  const [sectionCharacterCount, setSectionCharacterCount] = useState<number>(0);

  // Form errors
  const [sectionError, setSectionError] = useState("");

  // Form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAdding, setIsAdding] = useState<Boolean>(isFormVisible);

  // Fetch section data on component mount
  useEffect(() => {
    const getSections = async () => {
      SectionHelper.sectionGetRequest(episodeId).then((res) => {
        if (res.status === 200) {
          setSections(res.sections);
          setSectionsCount(res.sections.length);
        } else {
          setSectionError("Sections cannot be fetched");
        }
      });
    };
    getSections();
  }, [episodeId, sectionCount]);

  // Function that hand;es the addition of a section to an episode
  const handleAddSection = async () => {
    if (newSection.title == "") {
      setSectionError("You must add a title");
    } else {
      setSectionError("");

      const title = newSection.title;
      const start = newSection.start;
      const end = newSection.end;

      const sectionRequest: SectionAddRequest = {
        title: title,
        start: start,
        end: end,
      };
      // Send the request to add the review
      const res = await SectionHelper.sectionCreateRequest(
        sectionRequest,
        episodeId,
      );
      console.log(res);

      if (res.status === 200) {
        setSectionsCount((sectionCount) => sectionCount + 1);
        setIsFormVisible(false);
        setIsAdding(false);
      } else {
        // Handle error here
        setSectionError(res.data);
      }
    }

    // Reset the newSection state
    setNewSection({
      title: "",
      start: 0,
      end: 0,
    });
  };

  // Function that deletes section from the episode
  const handleDeleteSection = async (sectionId) => {
    const response = await SectionHelper.sectionDeleteRequest(sectionId);
    if (response.status === 200) {
      setSectionsCount((sectionCount) => sectionCount - 1);
    } else {
      setSectionError("");
      console.log("Error deleting comment:", response.message);
    }
  };

  const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.ceil(seconds % 60);

    if (remainingSeconds === 60) {
      minutes += 1;
      remainingSeconds = 0;
    }

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleStartChange = (newTime) => {
    const newStartTime = newTime;
    setNewSection((prevSection) => ({
      ...prevSection,
      start: newStartTime,
    }));
  };

  const handleEndChange = (newTime) => {
    const newEndTime = newTime;
    setNewSection((prevSection) => ({
      ...prevSection,
      end: newEndTime,
    }));
  };
  return (
    <>
      <Flex direction="column" alignItems={"center"} width="100%">
        <PlayingBar
          episodeId={episodeId}
          podcastId={podcastId}
          sections={sections}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          isAdding={isAdding}
        />

        <Box mt={4} width="100%" alignItems={"center"}>
          {/* Add Section Form */}
          {isFormVisible ? (
            <Box width="100%" alignItems={"center"}>
              <Box w="100%" p={4} borderWidth="1px" borderRadius="1.2em">
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  mb={6}
                  mt={1}
                  textAlign={"center"}
                >
                  Add a Section
                </Text>
                <FormControl position="relative">
                  <Input
                    placeholder="Section Title"
                    mb={3}
                    value={newSection.title}
                    onChange={(e) => {
                      setSectionCharacterCount(newSection.title.length);
                      setNewSection({
                        ...newSection,
                        title: e.target.value.slice(0, 25),
                      });
                    }}
                  />
                  <Text
                    position="absolute"
                    right="8px"
                    bottom="20px"
                    fontSize="sm"
                    color="gray.500"
                  >
                    {sectionCharacterCount}/25
                  </Text>
                </FormControl>
                <Box textAlign="center">
                  <HStack spacing={4} justifyContent="center">
                    <Text fontSize="md" fontWeight={"bold"}>
                      Start: {formatTime(newSection.start)}
                    </Text>
                    <Text fontSize="md" fontWeight={"bold"}>
                      End: {formatTime(newSection.end)}
                    </Text>
                  </HStack>
                </Box>
                <HStack justifyContent="space-between" mt={"5"}>
                  <Button
                    onClick={handleAddSection}
                    width="50%"
                    borderRadius="7px"
                    colorScheme="blue"
                  >
                    Add Section
                  </Button>
                  <Button
                    onClick={() => {
                      setIsFormVisible(false);
                      setIsAdding(false);
                    }}
                    width="50%"
                    borderRadius="7px"
                    colorScheme="red"
                  >
                    Cancel
                  </Button>
                </HStack>
              </Box>
              <Text fontSize="xl" fontWeight="bold" mb={1} mt={6}>
                Sections
              </Text>
            </Box>
          ) : (
            <Flex justify="space-between" w="100%" alignItems="center">
              <Text fontSize="xl" fontWeight="bold" mb={1} mt={1}>
                Sections
              </Text>
              <Tooltip label="Add Section" placement="top">
                <IconButton
                  variant="ghost"
                  borderRadius="50%"
                  aria-label="Add Section"
                  icon={<AddIcon />}
                  onClick={() => {
                    setIsFormVisible(true);
                    setIsAdding(true);
                  }}
                />
              </Tooltip>
            </Flex>
          )}
          {sectionError && <Text color="red.500">{sectionError}</Text>}
          {sections && sections.length > 0 ? (
            sections.map((section, key) => (
              <Flex
                key={section.id}
                align="center"
                justify="space-between"
                p={2}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                mt={2}
                width="100%"
                bg="rgba(0, 0, 0, 0.1)"
              >
                <Box>
                  <Text fontWeight="bold">
                    {key + 1 + ": " + section.title}
                  </Text>
                  <Text fontSize="sm">
                    Start:{" "}
                    {`${formatTime(
                      section.start,
                    )} \u00A0\u00A0\u00A0\u00A0 End: ${formatTime(
                      section.end,
                    )}`}
                  </Text>
                </Box>
                <IconButton
                  variant="ghost"
                  borderRadius="50%"
                  onClick={() => handleDeleteSection(section.id)}
                  aria-label="Delete Section"
                  icon={<DeleteIcon />}
                />
              </Flex>
            ))
          ) : (
            <Text textAlign="center" mt={4}>
              This episode has no sections yet.
            </Text>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default ManageSections;
