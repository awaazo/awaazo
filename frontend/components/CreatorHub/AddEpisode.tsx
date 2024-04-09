import React, { useCallback, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import {
  FormControl,
  Button,
  Textarea,
  Box,
  VStack,
  Image,
  Input,
  Flex,
  Switch,
  Text,
  Center,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import PodcastHelper from '../../helpers/PodcastHelper'
import { UserMenuInfo } from '../../types/Interfaces'
import { EpisodeAddRequest } from '../../types/Requests'
import { AxiosProgressEvent } from 'axios'
import ImageAdder from '../assets/ImageAdder'
import { v4 as uuidv4 } from 'uuid'
import { BsBox } from 'react-icons/bs'

const AddEpisodeForm = ({ podcastId }) => {
  const router = useRouter()
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined)
  const [addError, setAddError] = useState('')
  const [episodeName, setEpisodeName] = useState('')
  const [episodeNameCharacterCount, setEpisodeNameCharacterCount] = useState<number>(0)
  const [description, setDescription] = useState('')
  const [descriptionCharacterCount, setDescriptionCharacterCount] = useState<number>(0)

  const [isExplicit, setIsExplicit] = useState(false)
  const [isAIGenerated, setIsAIGenerated] = useState(false)
  const [isAIWithText, setIsAIWithText] = useState(false)
  const [isFemaleVoice, setIsFemaleVoice] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [aiText, setAIText] = useState('')
  const [file, setFile] = useState(null)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

  // Modal state
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploadModalOpen, setUploadModalOpen] = useState(false)
  const [serverError, setServerError] = useState(false)

  // Upload percentage states
  let totalRequestSize = 0
  let uploadedFileSize = 0
  let totalRequestsCount = 1
  let currentRequestCount = 1

  const MAXIMUM_FILE_SIZE = 80000000 // 80MB
  const MIN_REQUEST_SIZE = 1249807 // ~1.2MB

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/mp3': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/aac': ['.aac'],
      'audio/ogg': ['.ogg'],
      'audio/flac': ['.flac'],
      'audio/m4a': ['.m4a'],
    },
    maxFiles: 1,
  })

  const [loading, setLoading] = useState(false)

  const handleImageAdded = useCallback(async (addedImageUrl: string) => {
    try {
      const response = await fetch(addedImageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'cover-image.jpg', { type: 'image/jpeg' })
      setCoverImageFile(file)
      setCoverImage(addedImageUrl)
    } catch (error) {
      console.error('Error converting image URL to File:', error)
    }
  }, [])

  const handleAddAIEpisode = async (e: FormEvent) => {
    e.preventDefault()

    if (isAIGenerated && !isAIWithText && (prompt === '' || coverImageFile == null || episodeName == '' || description == '')) {
      setAddError('Prompt, Cover Image, Episode Name and Description Required.')
      return
    }
    if (isAIGenerated && isAIWithText && (aiText === '' || coverImageFile == null || episodeName == '' || description == '')) {
      setAddError('Text, Cover Image, Episode Name and Description Required.')
    }
    if (isAIGenerated && isAIWithText) {
      setLoading(true)

      const request = {
        isFemaleVoice: isFemaleVoice,
        description: description,
        thumbnail: coverImageFile,
        text: aiText,
        episodeName: episodeName,
      }

      const response = await PodcastHelper.episodeAIwithTextAddRequest(request, podcastId)

      if (response.status !== 200) {
        setServerError(true)
        setAddError(response.data)
      } else if (response.status === 200) {
        setServerError(false)
        setAddError('')
        window.location.reload()
      }
      setLoading(false)
    }

    if (isAIGenerated && !isAIWithText) {
      setLoading(true)

      const request = {
        prompt: prompt,
        description: description,
        thumbnail: coverImageFile,
        text: aiText,
        episodeName: episodeName,
      }

      const response = await PodcastHelper.episodeAIAddRequest(request, podcastId)

      if (response.status !== 200) {
        setServerError(true)
        setAddError(response.data)
      } else if (response.status === 200) {
        setServerError(false)
        setAddError('')
        window.location.reload()
      }
      setLoading(false)
    }
  }

  const handleAddEpisode = async (e: FormEvent) => {
    e.preventDefault()

    if (coverImageFile == null || episodeName == '' || description == '' || file == null) {
      setAddError('Cover Image, Episode Name and Description Required.')
      return
    }
    setLoading(true)

    // Create an array of requests if the file is too large
    const requests: EpisodeAddRequest[] = []

    totalRequestSize = (file.size + MIN_REQUEST_SIZE) as number
    uploadedFileSize = 0

    // Create request object
    const request: EpisodeAddRequest = {
      audioFile: file,
      description: description,
      thumbnail: coverImageFile,
      isExplicit: isExplicit,
      episodeName: episodeName,
    }

    // Check if the file is too large and split it into chunks if necessary
    if (file.size > MAXIMUM_FILE_SIZE) {
      console.log('File too large')
      console.log(file.size)

      // Preserving the original file information, such as the MIME type and last modified date
      const originalMimeType = file.type
      const lastModified = file.lastModified

      // Split the file into chunks
      const numberOfChunks = Math.ceil(file.size / MAXIMUM_FILE_SIZE)
      const chunks = []

      // Add the MIN_REQUEST_SIZE for each request
      totalRequestSize = (totalRequestSize + numberOfChunks * MIN_REQUEST_SIZE - MIN_REQUEST_SIZE) as number

      // Track the start and end of the file
      let start = 0
      let end = MAXIMUM_FILE_SIZE

      // Generate a unique ID for the file, which will be used to identify the chunks on the server
      const id = uuidv4()

      // Track the chunk number to reconstruct the file on the server in the correct order
      let chunkNumber = 1

      // Loop through the file, creating chunks
      while (start < file.size) {
        // Slice the file into a chunk, based on the start and end, and create a new file object with the chunk data
        chunks.push(new File([file.slice(start, end)], id + '<##>' + chunkNumber + '/' + numberOfChunks, { type: originalMimeType, lastModified: lastModified }))

        requests.push({ audioFile: chunks[chunkNumber - 1], description: description, thumbnail: coverImageFile, isExplicit: isExplicit, episodeName: episodeName } as EpisodeAddRequest)

        // Increment the chunk number and move the start and end to the next chunk
        chunkNumber++
        start = end
        end = start + MAXIMUM_FILE_SIZE
      }
      console.log('Number of chunks: ' + chunks.length)
      totalRequestsCount = numberOfChunks
      currentRequestCount = 1
    } else {
      console.log('File small enough to upload in one go.')
      requests.push(request)
      totalRequestsCount = 1
      currentRequestCount = 1
    }

    setServerError(false)
    setUploadModalOpen(true)

    let response: any
    let episodeId: string

    // Send the requests
    for (let i = 0; i < requests.length; i++) {
      if (i === 0) {
        // Add the episode and get the episode ID
        response = await PodcastHelper.episodeAddRequest(requests[i], podcastId, onUploadProgress)
        episodeId = response.data
      } else {
        // Add the audio chunks to the episode
        response = await PodcastHelper.episodeAddAudioRequest(requests[i], episodeId, onUploadProgress)
      }

      if (response.status !== 200) {
        setServerError(true)
        setAddError(response.data)
      }
    }

    setLoading(false)
  }

  // Define the progress callback
  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    // Calculate the progress percentage
    let progress = Math.round(((progressEvent.loaded + uploadedFileSize) / totalRequestSize) * 100)

    // If the file has been fully uploaded, update the uploaded file size
    if (progressEvent.loaded === progressEvent.total) {
      uploadedFileSize = (uploadedFileSize + progressEvent.total) as number
      console.log('progressEvent.total: ' + progressEvent.total)

      currentRequestCount++

      if (currentRequestCount > totalRequestsCount) {
        progress = 100
      }
    }

    console.log('Uploaded: ' + uploadedFileSize + ' / ' + totalRequestSize + ' - ' + progress + '%')

    // Update the progress state
    setUploadProgress(progress)
  }

  // Ensures episode name is not longer than 25 characters
  const handleEpisodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, 25)
    setEpisodeName(newName)
    setEpisodeNameCharacterCount(newName.length)
  }

  // Ensures episode description is not longer than 250 characters
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDesc = e.target.value.slice(0, 250)
    setDescription(newDesc)
    setDescriptionCharacterCount(newDesc.length)
  }


  return (
    <>
      <Box>
        <VStack spacing={2} align="center" p={2}>
          <form onSubmit={isAIGenerated ? handleAddAIEpisode : handleAddEpisode}>
            {addError && <Text color="red.500">{addError}</Text>}
            <VStack spacing={5} align="center" p={5}>
              <ImageAdder onImageAdded={handleImageAdded} />
              <FormControl position="relative">
                <Input value={episodeName} onChange={handleEpisodeNameChange} placeholder="Enter episode name..." rounded="lg" pr="50px" />
                <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="az.greyish">
                  {episodeNameCharacterCount}/25
                </Text>
              </FormControl>
              <FormControl position="relative">
                <Textarea value={description} onChange={handleDescriptionChange} placeholder="Enter episode description..." />
                <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                  {descriptionCharacterCount}/250
                </Text>
              </FormControl>
              {/* Tab Panel for Human and AI-generated */}
              <Tabs isFitted width={'100%'}>
                <TabList>
                  <Tab _selected={{ color: 'az.red', fontSize:'md'}} onClick={() => setIsAIGenerated(false)}>Human</Tab>
                  <Tab _selected={{ color: 'az.red', fontSize:'md'}} onClick={() => setIsAIGenerated(true)}>AI-generated</Tab>
                </TabList>
                <TabPanels width={'100%'}>
                  {/* Human Options */}
                  <TabPanel width={'100%'}>
                    <FormControl display="flex" alignItems="center" justifyContent="center">
                      <Switch id="explicitToggle" colorScheme="red" isChecked={isExplicit} onChange={() => setIsExplicit(!isExplicit)} opacity={0.9}>
                        Explicit
                      </Switch>
                    </FormControl>
                    {/* File upload */}
                    <Box mt={'15px'} {...getRootProps()} border="2px dotted gray" borderRadius="3xl" p={4} textAlign="center" width="300px" data-cy="podcast-file-dropzone">
                      <input {...getInputProps()} />
                      {file ? (
                        <Text>{file.name}</Text>
                      ) : (
                        <Text>
                          Drag & drop an audio file here, or click to select one
                          <Text role="img" aria-label="audio emoji">
                            {' '}
                            🎙️
                          </Text>
                        </Text>
                      )}
                    </Box>
                  </TabPanel>
                  {/* AI-generated Options */}
                  
                  <TabPanel width={'100%'}>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="center" width={'100%'}>
                      <Switch id="textWithAIToggle" colorScheme="red" isChecked={isAIWithText} onChange={() => setIsAIWithText(!isAIWithText)} opacity={0.9}>
                        User Created Text
                      </Switch>
                    </FormControl>
                    {/* If Text with AI is true, show the text input field */}
                    {isAIWithText && (
                      <FormControl width={'100%'}>
                        <Textarea mt={'15px'} value={aiText} onChange={(e) => setAIText(e.target.value)} placeholder="Enter your text" width={'100%'}/>
                      </FormControl>
                    )}
                    {/* If Text with AI is false, show the prompt input field */}
                    {!isAIWithText && (
                      <FormControl width={'100%'}>
                        <Textarea mt={'15px'} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your prompt" width={'100%'}/>
                      </FormControl>
                    )}
                    {/* Voice gender switch */}
                    <FormControl mt={'15px'} display="flex" alignItems="center" justifyContent="center" width={'100%'}>
                      <Switch id="voiceGenderToggle" colorScheme="red" isChecked={isFemaleVoice} onChange={() => setIsFemaleVoice(!isFemaleVoice)} opacity={0.9}>
                        Female Voice
                      </Switch>
                    </FormControl>
                   
                  </TabPanel>
               
                </TabPanels>
              </Tabs>

              <Button id="createBtn" type="submit" variant={'large'} disabled={loading} w={'200px'}>
                {loading ? <Spinner /> : 'Upload'}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
      <Modal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl" backdropFilter="blur(50px)" p={9} maxW="800px" width="95%">
          <Flex direction="column">
            <Flex align="center" justify="center">
              {coverImage && <Image src={coverImage} alt="Uploaded Cover Photo" boxSize="80px" borderRadius="8px" objectFit="cover" boxShadow="lg" />}
              <Box ml={4} >
                <Text fontSize="lg" fontWeight={'bold'}>
                  Uploading: {episodeName}
                </Text>
                <Text fontSize="md" ml={1}>
                  {description}
                </Text>
              </Box>
            </Flex>
            <Flex direction="column" align="center" mt={5}>
              {serverError ? (
                <Box textAlign="center">
                  <Text fontSize="lg" textAlign="center" color="red" mb={2}>
                    {addError}
                  </Text>
                </Box>
              ) : (
                <>
                  <Box textAlign="center"  >
                    {uploadProgress !== 100 && (
                      <Text fontSize="xs" textAlign="center" color="white" mb={2}>
                        Please wait while the file gets uploaded
                      </Text>
                    )}
                    
                  </Box>
                  <Box w="100%" h="24px" borderRadius="full" mt={2} mb={2} position="relative" background="az.darkerGrey">
                    <Box
                      h="100%"
                      borderRadius="10px"
                      width={`${uploadProgress}%`}
                      background= 'az.red'
                      position="absolute"
                      zIndex="1"
                    />
                    <Text position="absolute" width="100%" textAlign="center" color="white" fontWeight="bold" fontSize="lg" zIndex="2" top="50%" left="50%" transform="translate(-50%, -50%)">
                      {uploadProgress}%
                    </Text>
                  </Box>
                  {uploadProgress === 100 && (
                    <Button onClick={() => window.location.reload()} alignSelf="center" variant="large" mt={5}>
                      Finish
                    </Button>
                  )}
                </>
              )}
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddEpisodeForm
