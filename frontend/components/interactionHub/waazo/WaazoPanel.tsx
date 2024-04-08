import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Box, VStack, Text, Input, Button, Image, InputGroup, HStack, Avatar } from '@chakra-ui/react'
import waazo from '../../../public/svgs/waazo.svg'
import ChatbotHelper from '../../../helpers/ChatbotHelper'
import PodcastHelper from '../../../helpers/PodcastHelper'
import { Episode, UserMenuInfo } from '../../../types/Interfaces'
import AuthHelper from '../../../helpers/AuthHelper'
import { Send } from '../../../public/icons'
import AuthPrompt from '../../auth/AuthPrompt'
import CustomAvatar from '../../assets/CustomAvatar'

const ChatBot = ({ episodeId }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [episode, setEpisode] = useState<Episode>(null)
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined)
  const msgEnd = useRef<HTMLDivElement>(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const fetchMessages = useCallback(async () => {
    // Return early if there's no episodeId
    if (!episodeId) {
      console.log('No currentEpisodeId, returning early.')
      return
    }

    if (!user) {
      try {
        const response = await AuthHelper.authMeRequest()
        console.log('User fetched:', response)

        if (response.status === 200) {
          setUser(response.userMenuInfo)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    // Get the episode if it's not already fetched so we can display the episode name
    if ((!episode && episodeId) || (episode && episode.id !== episodeId)) {
      try {
        const response = await PodcastHelper.getEpisodeById(episodeId)
        console.log('Episode fetched:', response)
        setEpisode(response.episode)
      } catch (error) {
        console.error('Error fetching episode:', error)
      }
    }

    // Fetch messages for the episode
    try {
      const response = await ChatbotHelper.getEpisodeChat(episodeId, 0, 200)
      console.log('epid:', episodeId)
      console.log('Response received:', response)
      if (!response || !response.messages) {
        console.error('Invalid or empty response:', response)
        return
      }
      setMessages(response.messages)

      msgEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })

      console.log('Messages fetched:', response.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [episodeId])

  useEffect(() => {
    fetchMessages()
  }, [episodeId, fetchMessages])

  const sendMessage = async () => {
    if (user === undefined || user === null) {
      setShowLoginPrompt(true)
      return
    }

    // Save the message
    const promptMsg = newMessage

    messages.push({
      id: '1',
      userId: '1',
      episodeId: '1',
      message: promptMsg,
      isPrompt: true,
      username: user.username,
      avatarUrl: user.avatarUrl,
    })

    setNewMessage('')

    if (!promptMsg.trim()) return

    try {
      const response = await ChatbotHelper.addEpisodeChat(episodeId, promptMsg)
      if (response.status === 200) {
        console.log('Message sent:', promptMsg)
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handlePredefinedQuestionClick = (question) => setNewMessage(question)
  const handleInputChange = (e) => setNewMessage(e.target.value)

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <Box>
      <HStack align="center" spacing={0}>
        <Box>
          <Image src={waazo.src} alt="Waazo" w="70px" mt={'2'} zIndex={2} />
        </Box>
        <VStack spacing={0} align="start">
          <Text fontSize="xl" fontWeight="bold">
            Ask Waazo
          </Text>
          <Text fontSize="md" fontWeight="medium" mt={'-2'} color={'az.greyish'}>
            {episode ? `let’s chat about “${episode.episodeName}”` : 'No episode selected'}
          </Text>
        </VStack>
      </HStack>

      <VStack spacing={'1em'} overflowY="auto" height="50vh" paddingY="4" mt={'20px'}>
        {messages.map((message, index) => (
          <Box key={index} alignSelf={message.isPrompt ? 'flex-end' : 'flex-start'} maxWidth="90%" color={message.isPrompt ? '#8b8b8b' : '#ffffff'} borderRadius="lg">
            <HStack alignItems="flex-start">
              {!message.isPrompt && <Avatar src={waazo.src} w="30px" h="30px" mr="2px" style={{ alignSelf: 'flex-start' }} />}
              <Text fontSize="sm" mt={!message.isPrompt ? '4px' : '0px'}>
                {message.message}
              </Text>
              {message.isPrompt && <CustomAvatar imageUrl={message.avatarUrl} username={user.username} size="sm" />}
            </HStack>
          </Box>
        ))}
        <div ref={msgEnd} />
      </VStack>

      <Box position="absolute" bottom="0" left="0" right="0" p="30px" borderColor="gray.700">
        {messages.length === 0 ? (
          <VStack spacing="2" align="left" pb="1em">
            <Text textAlign="left" fontSize={'14px'} pb="0.3em">
              Things you can ask:
            </Text>

            <HStack spacing={'1em'} overflowY="auto" paddingY="1">
              <Button
                borderRadius={'15px'}
                width={'fit-content'}
                fontSize={'12px'}
                fontWeight={'light'}
                border={'2px solid rgba(255, 255, 255, 0.05)'}
                onClick={() => handlePredefinedQuestionClick('Give me a summary of this episode.')}
              >
                Can you summarize the episode?
              </Button>
              <Button
                borderRadius={'15px'}
                width={'fit-content'}
                fontSize={'12px'}
                fontWeight={'light'}
                border={'2px solid rgba(255, 255, 255, 0.05)'}
                onClick={() => handlePredefinedQuestionClick('What did the podcaster think about ')}
              >
                What did the podcaster think about ... ?
              </Button>
            </HStack>
          </VStack>
        ) : null}
        <InputGroup>
          <Input value={newMessage} onChange={handleInputChange} placeholder="Ask me anything about this episode..." onKeyDown={handleEnterPress} m={1} />
          <Button variant={'minimalColor'} width="18px" height="18px" position="absolute" zIndex={'50'} right="5px" top="55%" transform="translateY(-50%)" onClick={sendMessage} p="0">
            <Send color="az.red" fontSize={'20px'} />
          </Button>
        </InputGroup>
      </Box>
      {showLoginPrompt && <AuthPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage="Login to Chat with this Episode." />}
    </Box>
  )
}
export default ChatBot
