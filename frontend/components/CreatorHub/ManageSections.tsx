import { useState, useEffect } from "react";
import { Box, Button, Flex, Text, IconButton, Input, Tooltip, HStack, FormControl } from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import SectionsPlayingBar from "./SectionsPlayingBar";
import SectionHelper from "../../helpers/SectionHelper";
import { Section } from "../../types/Interfaces";
import { SectionAddRequest } from "../../types/Requests";
import { convertTime } from "../../utilities/commonUtils";
import { useTranslation } from 'react-i18next';

const ManageSections = ({ episodeId, podcastId }) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState<Section[]>(null);
  const [sectionCount, setSectionsCount] = useState<number>(0);
  const [newSection, setNewSection] = useState({
    title: "",
    start: 0,
    end: 0,
  });
  const [sectionCharacterCount, setSectionCharacterCount] = useState<number>(0);
  const [sectionError, setSectionError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAdding, setIsAdding] = useState<Boolean>(isFormVisible);

  // Fetch section data on component mount
  useEffect(() => {
    const getSections = async () => {
      SectionHelper.sectionGetRequest(episodeId).then((res) => {
        if (res.status === 200) {
          setSections(res.sections);
          setSectionsCount(res.sections.length);
          const lastSectionEnd = res.sections.length > 0 ? res.sections[res.sections.length - 1].end : 0;
          setNewSection((prevSection) => ({
            ...prevSection,
            start: lastSectionEnd,
            end: lastSectionEnd,
          }));
        } else {
          setSectionError(t('edit.errorFetchingEpisode'));
        }
      });
    };
    getSections();
  }, [episodeId, sectionCount, t]);

  // Function that handles the addition of a section to an episode
  const handleAddSection = async () => {
    if (newSection.title === "") {
      setSectionError(t('edit.allFieldsRequiredEpisode'));
    } else {
      setSectionError("");

      try {
        const res = await SectionHelper.sectionGetRequest(episodeId);
        if (res.status === 200) {
          const sections = res.sections;
          const lastSectionEnd = sections.length > 0 ? sections[sections.length - 1].end : 0;

          const sectionRequest: SectionAddRequest = {
            title: newSection.title,
            start: lastSectionEnd,
            end: newSection.end,
          };

          // Send the request to add the review
          const addRes = await SectionHelper.sectionCreateRequest(sectionRequest, episodeId);
          console.log(addRes);

          if (addRes.status === 200) {
            setSectionsCount((sectionCount) => sectionCount + 1);
            setIsFormVisible(false);
            setIsAdding(false);
            setNewSection({
              title: "",
              start: lastSectionEnd,
              end: lastSectionEnd,
            });
          } else {
            // Handle error here
            setSectionError(addRes.data);
          }
        } else {
          setSectionError(t('edit.errorFetchingEpisode'));
        }
      } catch (error) {
        console.error("Error:", error);
        setSectionError(t('edit.errorFetchingEpisode'));
      }
    }
  };

  // Function that deletes section from the episode
  const handleDeleteSection = async (sectionId) => {
    const response = await SectionHelper.sectionDeleteRequest(sectionId);
    if (response.status === 200) {
      setSectionsCount((sectionCount) => sectionCount - 1);
    } else {
      setSectionError("");
      console.log(t('edit.errorDeletingSection'), response.message);
    }
  };

  const handleEndChange = async (newTime) => {
    try {
      const res = await SectionHelper.sectionGetRequest(episodeId);
      if (res.status === 200) {
        const sections = res.sections;
        const lastSectionEnd = sections.length > 0 ? sections[sections.length - 1].end : 0;

        if (newTime > lastSectionEnd) {
          setNewSection((prevSection) => ({
            ...prevSection,
            end: newTime,
          }));
        } else {
          setSectionError(t('edit.endTimeMustBeAfterLastSection'));
        }
      } else {
        setSectionError("Error fetching sections");
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSectionError("Error fetching sections");
    }
  };

  return (
    <>
      <Flex direction="column" alignItems={"center"} width="100%">
        <SectionsPlayingBar episodeId={episodeId} podcastId={podcastId} sections={sections} onEndChange={handleEndChange} isAdding={isAdding} />

        <Box mt={4} width="100%" alignItems={"center"}>
          {/* Add Section Form */}
          {isFormVisible ? (
            <Box width="100%" alignItems={"center"}>
              <Box w="100%" p={4} borderWidth="1px" borderRadius="1.2em">
                <Text fontSize="xl" fontWeight="bold" mb={6} mt={1} textAlign={"center"}>
                  {t('edit.addSection')}
                </Text>
                <FormControl position="relative">
                  <Input
                    placeholder={t('edit.episodeNamePlaceholder')}
                    mb={3}
                    value={newSection.title}
                    onChange={(e) => {
                      setSectionCharacterCount(newSection.title.length);
                      setNewSection({
                        ...newSection,
                        title: e.target.value.slice(0, 25),
                      });
                    }}
                    data-cy={`section-title-input`}
                  />
                  <Text position="absolute" right="8px" bottom="20px" fontSize="sm" color="gray.500">
                    {sectionCharacterCount}/25
                  </Text>
                </FormControl>
                <Box textAlign="center">
                  <HStack spacing={4} justifyContent="center">
                    <Text fontSize="md" fontWeight={"bold"}>
                      {t('edit.start')}: {convertTime(newSection.start)}
                    </Text>
                    <Text fontSize="md" fontWeight={"bold"}>
                      {t('edit.end')}: {convertTime(newSection.end)}
                    </Text>
                  </HStack>
                </Box>
                <HStack justifyContent="space-between" mt={"5"}>
                  <Button onClick={handleAddSection} width="50%" borderRadius="7px" bg="brand.100" data-cy={`add-section-button-form`}>
                    {t('edit.addSection')}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsFormVisible(false);
                      setIsAdding(false);
                    }}
                    width="50%"
                    borderRadius="7px"
                    bg="red"
                    data-cy={`cancel-button`}
                  >
                    {t('edit.cancel')}
                  </Button>
                </HStack>
              </Box>
              <Text fontSize="xl" fontWeight="bold" mb={1} mt={6}>
                {t('edit.sections')}
              </Text>
            </Box>
          ) : (
            <Flex justify="space-between" w="100%" alignItems="center">
              <Text fontSize="xl" fontWeight="bold" mb={1} mt={1}>
                {t('edit.sections')}
              </Text>
              <Tooltip label={t('edit.addSection')} placement="top">
                <IconButton
                  variant="ghost"
                  borderRadius="50%"
                  aria-label="Add Section"
                  icon={<AddIcon />}
                  onClick={() => {
                    setIsFormVisible(true);
                    setIsAdding(true);
                  }}
                  data-cy={`add-sections-button`}
                />
              </Tooltip>
            </Flex>
          )}
          {sectionError && <Text color="red.500">{sectionError}</Text>}
          {sections && sections.length > 0 ? (
            sections.map((section, key) => (
              <Flex key={section.id} align="center" justify="space-between" p={2} border="1px" borderColor="gray.200" borderRadius="md" mt={2} width="100%" bg="rgba(0, 0, 0, 0.1)">
                <Box>
                  <Text fontWeight="bold">{key + 1 + ": " + section.title}</Text>
                  <Text fontSize="sm">Start: {`${convertTime(section.start)} \u00A0\u00A0\u00A0\u00A0 End: ${convertTime(section.end)}`}</Text>
                </Box>
                <IconButton variant="ghost" borderRadius="50%" onClick={() => handleDeleteSection(section.id)} aria-label="Delete Section" icon={<DeleteIcon />} data-cy={`section-delete-btn`}/>
              </Flex>
            ))
          ) : (
            <Text textAlign="center" mt={4}>
              {t('edit.noSectionsYet')}
            </Text>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default ManageSections;
