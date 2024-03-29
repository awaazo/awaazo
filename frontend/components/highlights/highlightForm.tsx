import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  useToast,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import HighlightHelper from '../../helpers/HighlightHelper';
import { HighlightEditRequest } from '../../types/Requests';
import {convertTime} from '../../utilities/commonUtils';
import { FaPlay, FaPause, FaChevronCircleRight, FaChevronCircleLeft } from 'react-icons/fa';
import EndpointHelper from "../../helpers/EndpointHelper";

const HighlightForm = ({ episodeId, highlightId, fetchHighlights, episodeLength, podcastId }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [formData, setFormData] = useState({
    StartTime: currentTime,
    EndTime: episodeLength,
    Title: '',
    Description: '',
  });
  const toast = useToast();
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [shiftAmount, setShiftAmount] = useState(5); 



  const getEpisodePlaying = async (podcastId, episodeId) => {
    return EndpointHelper.getPodcastEpisodePlayEndpoint(podcastId, episodeId);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);


  const handleSeek = (value) => {
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        const audioUrl = await getEpisodePlaying(podcastId, episodeId);
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error("Error fetching episode:", error);
      }
      setIsLoading(false);
    };

    fetchAudio();
  }, [podcastId, episodeId]);

  useEffect(() => {
    if (highlightId) {
    }
  }, [highlightId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRangeChange = ([start, end]) => {
    const maxDuration = 15;
  
    let newStart = start;
    let newEnd = end;
  
    if (newEnd - newStart > maxDuration) {
      if (newEnd !== formData.EndTime) {
        newStart = newEnd - maxDuration;
      } else {
        newEnd = newStart + maxDuration;
      }
    }
  
    newStart = Math.max(0, newStart);
    newEnd = Math.min(episodeLength, newEnd);
  
    if (newEnd > episodeLength) {
      newEnd = episodeLength;
      newStart = Math.max(0, episodeLength - maxDuration);
    }
  
    setFormData((prev) => ({
      ...prev,
      StartTime: newStart.toString(),
      EndTime: newEnd.toString(),
    }));
  };
  

  

  const handleSubmit = async () => {
    let response;
  
    if (highlightId) {
      const editData: HighlightEditRequest = {
        Title: formData.Title,
        Description: formData.Description,
      };
  
      response = await HighlightHelper.highlightEditRequest(editData, highlightId);
    } else {
     
      const addData = {
        StartTime: formData.StartTime, 
        EndTime: formData.EndTime, 
        Title: formData.Title,
        Description: formData.Description,
      };
      
      response = await HighlightHelper.highlightCreateRequest(addData, episodeId);
    }
  
    if (response.status === 200) {
      toast({
        title: 'Success',
        description: highlightId ? 'Highlight updated successfully.' : 'Highlight added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchHighlights(); 
    } else {
      toast({
        title: 'Error',
        description: response.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  const handleDelete = async () => {
    if (highlightId) {
      const response = await HighlightHelper.highlightDeleteRequest(highlightId);
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Highlight deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchHighlights(); 
      } else {
        toast({
          title: 'Error',
          description: response.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.currentTime = Number(formData.StartTime);
      audioRef.current.play().catch((e) => {
        console.error("Error playing audio:", e);
        toast({
          title: 'Error',
          description: 'Failed to play the audio.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  

      const stopAudioAtEndTime = () => {
        if (audioRef.current.currentTime >= Number(formData.EndTime)) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      };
  
      audioRef.current.addEventListener('timeupdate', stopAudioAtEndTime);
      return () => audioRef.current.removeEventListener('timeupdate', stopAudioAtEndTime);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, formData.StartTime, formData.EndTime, toast]);
  
  

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);
  

const shiftRangeBackward = () => {
  setFormData(prev => ({
    ...prev,
    StartTime: Math.max(0, prev.StartTime - shiftAmount),
    EndTime: Math.max(15, prev.EndTime - shiftAmount),
  }));
};

const shiftRangeForward = () => {
  setFormData(prev => ({
    ...prev,
    StartTime: Math.min(prev.StartTime + shiftAmount, episodeLength - 15),
    EndTime: Math.min(prev.EndTime + shiftAmount, episodeLength),
  }));
};




  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
          <FormLabel>Highlight Time Range</FormLabel>
          
          <HStack spacing={2}>
           <IconButton icon={isPlaying ? <FaPause /> : <FaPlay />} onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"} size="md" variant="ghost" mr={2} borderRadius="full" data-cy={`sections-play-pause`}/>
            <RangeSlider
              aria-label={['start-time', 'end-time']}
              id="highlight-time-range"
              min={0}
              max={episodeLength}
              defaultValue={[0, 15]}
              value={[Number(formData.StartTime), Number(formData.EndTime)]}
              onChange={handleRangeChange}
              step={1} 
              onChangeEnd={(val) => {
                if (val[1] - val[0] > 15) {
                  const adjustedEnd = val[0] + 15 > episodeLength ? episodeLength : val[0] + 15;
                  handleRangeChange([val[0], adjustedEnd]);
                }
              }}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            
          </HStack>
            <Text mt={2}>
              Start: {convertTime(Number(formData.StartTime))}, End: {convertTime(Number(formData.EndTime))}
            </Text>
            <Text color="gray.500" fontSize="sm">   Max duration 15 seconds</Text>
            
            <HStack spacing={2}>
            <FormControl>
              <FormLabel htmlFor="shift-amount">Shift Amount (seconds)</FormLabel>
              <Input
                id="shift-amount"
                type="number"
                value={shiftAmount}
                onChange={(e) => setShiftAmount(Number(e.target.value))}
                size="sm"
                maxW="100px"
              />
            </FormControl>
           <IconButton icon={<FaChevronCircleLeft />} onClick={shiftRangeBackward} aria-label="Shift Backward" size="lg" variant="ghost" mr={2} borderRadius="full" data-cy={`sections-shift-backward`}/>
            
          <IconButton icon={<FaChevronCircleRight />} onClick={shiftRangeForward} aria-label="Shift Forward" size="lg" variant="ghost" borderRadius="full" data-cy={`sections-shift-forward`}/>
          </HStack>
        
        </FormControl>


      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input name="Title" value={formData.Title} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea name="Description" value={formData.Description} onChange={handleChange} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        {highlightId ? 'Edit Highlight' : 'Add Highlight'}
      </Button>
      {highlightId && (
        <Button colorScheme="red" onClick={handleDelete}>
          Delete Highlight
        </Button>
      )}
    </VStack>
  );
};

export default HighlightForm;
