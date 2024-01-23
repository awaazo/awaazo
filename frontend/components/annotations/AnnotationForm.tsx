import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box, Text } from "@chakra-ui/react";
import AnnotationHelper from "../../helpers/AnnotationHelper";
import {convertTime} from '../../utilities/commonUtils'

const AnnotationForm = ({ episodeId, fetchAnnotations, episodeLength }) => {
  const [formData, setFormData] = useState({
    timestamp: "",
    content: "",
    videoUrl: "",
    platformType: "",
    name: "",
    website: "",
    annotationType: "basic",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value) => {
    setFormData((prev) => ({ ...prev, timestamp: value.toString() }));
  };

  const handleSubmit = async () => {
    const basePayload = {
      timestamp: Number(formData.timestamp),
      content: formData.content,
    };

    let payload;
    try {
      let response;
      switch (formData.annotationType) {
        case "mediaLink":
          payload = { ...basePayload, url: formData.videoUrl, platformType: formData.platformType };
          response = await AnnotationHelper.mediaLinkAnnotationCreateRequest(payload, episodeId);
          break;
        case "sponsor":
          payload = { ...basePayload, name: formData.name, website: formData.website };
          response = await AnnotationHelper.sponsorAnnotationCreateRequest(payload, episodeId);
          break;
        default:
          payload = { ...basePayload, annotationType: "info" };
          response = await AnnotationHelper.annotationCreateRequest(payload, episodeId);
          console.log("API Response:", response);
          break;
      }
      if (response && response.status === 200) {
        console.log("Annotation Creation Response:", response);
        fetchAnnotations();
      }
    } catch (error) {
      console.error("Error in creating Annotation:", error);
    }
  };


  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Annotation Type</FormLabel>
        <Select name="annotationType" value={formData.annotationType} onChange={handleChange}>
          <option value="basic">Basic</option>
          <option value="mediaLink">Media Link</option>
          <option value="sponsor">Sponsor</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Timestamp</FormLabel>
        <Box w="100%">
          <Slider min={0} max={episodeLength} step={1} value={Number(formData.timestamp)} onChange={handleSliderChange} >
            <SliderTrack>
              <SliderFilledTrack/>
            </SliderTrack >
            <SliderThumb boxSize={2}>
              <Box />
            </SliderThumb>
          </Slider>
          <Text mt={2}>Current timestamp: {convertTime(Number(formData.timestamp))}</Text>
        </Box>
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Input name="content" value={formData.content} onChange={handleChange} />
      </FormControl>
      {formData.annotationType === "mediaLink" && (
        <>
          <FormControl>
            <FormLabel>Video URL</FormLabel>
            <Input name="videoUrl" value={formData.videoUrl} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Platform Type</FormLabel>
            <Input name="platformType" value={formData.platformType} onChange={handleChange} />
          </FormControl>
        </>
      )}
      {formData.annotationType === "sponsor" && (
        <>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input name="website" value={formData.website} onChange={handleChange} />
          </FormControl>
        </>
      )}
      <Button variant="gradient" onClick={handleSubmit}>
        Create Annotation
      </Button>
    </VStack>
  );
};

export default AnnotationForm;
