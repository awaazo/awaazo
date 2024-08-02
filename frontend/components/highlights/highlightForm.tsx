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
import { useTranslation } from 'react-i18next';

const HighlightForm = ({ episodeId, highlightId, fetchHighlights, episodeLength, podcastId }) => {
  const { t } = useTranslation();
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
    let duration = end - start;
    if (duration > maxDuration) {
      if (end !== Number(formData.EndTime)) {
        start = end - maxDuration;
      } else {
        end = start + maxDuration;
      }
    }
    start = Math.max(0, Math.min(start, episodeLength - maxDuration));
    end = Math.min(episodeLength, start + maxDuration);
    setFormData((prev) => ({
      ...prev,
      StartTime: start.toString(),
      EndTime: end.toString(),
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
        title: t('success'),
        description: highlightId ? t('highlight.edit_success') : t('highlight.add_success'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchHighlights(); 
    } else {
      toast({
        title: t('error'),
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
          title: t('success'),
          description: t('highlight.delete_success'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchHighlights(); 
      } else {
        toast({
          title: t('error'),
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
          title: t('error'),
          description: t('highlight.play_error'),
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
          <FormLabel>{t('highlight.highlight_time_range')}</FormLabel>
          
          <HStack spacing={2}>
           <IconButton icon={isPlaying ? <FaPause /> : <FaPlay />} onClick={togglePlayPause} aria-label={isPlaying ? t('highlight.pause') : t('highlight.play')} size="md" variant="ghost" mr={2} borderRadius="full" data-cy={`sections-play-pause`}/>
            <RangeSlider
              aria-label={[t('highlight.start_time'), t('highlight.end_time')]}
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
              {t('highlight.start')}: {convertTime(Number(formData.StartTime))}, {t('highlight.end')}: {convertTime(Number(formData.EndTime))}
            </Text>
            <Text color="gray.500" fontSize="sm">{t('highlight.max_duration_15_seconds')}</Text>
            
            <HStack spacing={2}>
            <FormControl>
              <FormLabel htmlFor="shift-amount">{t('highlight.shift_amount_seconds')}</FormLabel>
              <Input
                id="shift-amount"
                type="number"
                value={shiftAmount}
                onChange={(e) => setShiftAmount(Number(e.target.value))}
                size="sm"
                maxW="100px"
              />
            </FormControl>
           <IconButton icon={<FaChevronCircleLeft />} onClick={shiftRangeBackward} aria-label={t('highlight.shift_backward')} size="lg" variant="ghost" mr={2} borderRadius="full" data-cy={`sections-shift-backward`}/>
            
          <IconButton icon={<FaChevronCircleRight />} onClick={shiftRangeForward} aria-label={t('highlight.shift_forward')} size="lg" variant="ghost" borderRadius="full" data-cy={`sections-shift-forward`}/>
          </HStack>
        
        </FormControl>


      <FormControl>
        <FormLabel>{t('highlight.title')}</FormLabel>
        <Input name="Title" value={formData.Title} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>{t('highlight.description')}</FormLabel>
        <Textarea name="Description" value={formData.Description} onChange={handleChange} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        {highlightId ? t('highlight.edit_highlight') : t('highlight.add_highlight')}
      </Button>
      {highlightId && (
        <Button colorScheme="red" onClick={handleDelete}>
          {t('highlight.delete_highlight')}
        </Button>
      )}
    </VStack>
  );
};

export default HighlightForm;
