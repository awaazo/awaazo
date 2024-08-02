import React, { useState, useEffect } from 'react'
import SocialHelper from '../../../helpers/SocialHelper'
import PodcastHelper from '../../../helpers/PodcastHelper'
import { Button, VStack, Icon, Text, HStack, Box, Input, useBreakpointValue, IconButton, InputGroup, InputRightElement, Image } from '@chakra-ui/react'
import { FaReply } from 'react-icons/fa'
import AuthHelper from '../../../helpers/AuthHelper'
import LikeComponent from '../Likes'
import AuthPrompt from '../../auth/AuthPrompt'
import { Send, Trash, Chat } from '../../../public/icons'
import CustomAvatar from '../../assets/CustomAvatar'
import { useTranslation } from 'react-i18next'

const Comments = ({ episodeIdOrCommentId, initialComments }) => {
  const { t } = useTranslation()
  const [comments, setComments] = useState([])
  const [commentPage, setCommentPage] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [replyTexts, setReplyTexts] = useState(Array(initialComments).fill(''))
  const [resfreshComments, setRefreshComments] = useState(false)
  const [user, setUser] = useState(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [replies, setReplies] = useState({})
  const [repliesPage, setRepliesPage] = useState({})
  const [replyInputIndex, setReplyInputIndex] = useState(null) // New state
  const [episode, setEpisode] = useState(null)

  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      AuthHelper.authMeRequest().then((response) => {
        if (response.status == 200) {
          setUser(response.userMenuInfo)
        }
      })
      if (episodeIdOrCommentId) {
        try {
          const response = await PodcastHelper.getEpisodeById(episodeIdOrCommentId)
          if (response.status === 200) {
            setEpisode(response.episode)
          } else {
            console.error('Error fetching episode:', response.message)
          }
        } catch (error) {
          console.error('Error fetching episode:', error)
        }
      }
      const response = await SocialHelper.getComments(episodeIdOrCommentId, commentPage, 10)

      if (response.status === 200) {
        if (response) {
          const newComments = formatComments(response.comments)

          const uniqueComments = newComments.filter((newComment) => !comments.find((comment) => comment.id === newComment.id))
          setComments([...comments, ...uniqueComments])
        }
      } else {
        console.error('Error fetching episode details:', response.message)
      }
    }
    fetchEpisodeDetails()
  }, [episodeIdOrCommentId, resfreshComments, commentPage])

  const formatComments = (fetchedComments) => {
    const updatedComments = fetchedComments.map((comment) => ({
      ...comment,
      dateCreated: new Date(comment.dateCreated),
    }))

    return updatedComments
  }

  const handleReplyInput = (commentIndex) => {
    setReplyInputIndex(commentIndex)
  }

  const fetchReplies = async (commentId, commentIndex, reset) => {
    try {
      const currentPage = reset === true ? 0 : repliesPage[commentId] || 0

      const response = await SocialHelper.getReplies(commentId, currentPage, 10)

      if (response.status === 200) {
        const newReplies = response.replies

        console.log('New Replies:', repliesPage[commentId])

        setReplies((prevReplies) => ({
          ...prevReplies,
          [commentId]: currentPage === 0 ? newReplies : [...(prevReplies[commentId] || []), ...newReplies],
        }))

        setRepliesPage((prevRepliesPage) => ({
          ...prevRepliesPage,
          [commentId]: currentPage + 1,
        }))

        if (commentIndex !== null) {
          setReplyInputIndex(commentIndex)
        }
      } else {
        console.error('Error fetching replies:', response.message)
      }
    } catch (error) {
      console.error('Error fetching replies:', error.message)
    }
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setCommentPage((prevPage) => prevPage + 1)
    }
  }

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const response = await SocialHelper.postEpisodeComment(newComment, episodeIdOrCommentId)
      if (response.status === 200) {
        setRefreshComments(!resfreshComments)
        setCommentPage(0)
      } else {
        setShowLoginPrompt(true)
        console.log('Error posting comment:', response.message)
      }
      setNewComment('')
    }
  }

  const handleReply = async (commentIndex) => {
    if (replyTexts[commentIndex] === '') {
      return
    }
    const comment = comments[commentIndex]
    const commentId = comment.id

    const response = await SocialHelper.postEpisodeComment(replyTexts[commentIndex], commentId)
    if (response.status === 200) {
      setRefreshComments(!resfreshComments)
      setCommentPage(0)

      fetchReplies(commentId, commentIndex, true)
    } else {
      setShowLoginPrompt(true)
      console.log('Error posting comment:', response.message)
    }
    const updatedReplyTexts = [...replyTexts]
    updatedReplyTexts[commentIndex] = ''
    setReplyTexts(updatedReplyTexts)
  }

  const handleDeleteComment = (commentOrReplyId, isComment) => {
    SocialHelper.deleteComment(commentOrReplyId).then((response) => {
      if (response.status === 200) {
        if (isComment) {
          setComments(comments.filter((comment) => comment.id !== commentOrReplyId))
          setCommentPage(0)
        } else {
          const updatedReplies = { ...replies }
          Object.keys(updatedReplies).forEach((commentId) => {
            updatedReplies[commentId] = updatedReplies[commentId].filter((reply) => reply.id !== commentOrReplyId)
          })
          setReplies(updatedReplies)
          setCommentPage(0)

          fetchReplies(commentOrReplyId, null, true)
        }
      } else {
        console.log('Error deleting comment:', response.message)
      }
    })
  }

  const timeAgo = (dateCreated) => {
    let adjustedDate
    if (dateCreated instanceof Date) {
      adjustedDate = dateCreated
    } else {
      console.error('Invalid date format:', dateCreated)
      adjustedDate = new Date(dateCreated)
      console.log('Adjusted Date:', adjustedDate)
    }

    const now = new Date()
    const seconds = Math.floor((now.getTime() - (adjustedDate.getTime() - 4 * 3600 * 1000)) / 1000)

    let interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
      return interval + t('time.years_ago')
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + t('time.months_ago')
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + t('time.days_ago')
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + t('time.hours_ago')
    }
    interval = Math.floor(seconds / 60)
    if (interval > 1) {
      return interval + t('time.minutes_ago')
    }
    return Math.floor(seconds) + t('time.seconds_ago')
  }

  return (
    <Box>
      {/* Top Section */}
      <HStack align="center" spacing={2}>
        {episode && <Image src={episode.thumbnailUrl} alt={episode.episodeName} boxSize="70px" borderRadius={'12px'} mt={1}/>}

        <HStack width={'100%'} justifyContent={"space-between"}>
          <VStack align="start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" isTruncated>
              {episode ? `${episode.episodeName}` : t('comments.no_episode_selected')}
            </Text>
            <Text fontSize="md" fontWeight="medium" mt={"-1"} color={'az.greyish'}>
              {t('comments.this_episode_has')} {comments.length} {comments.length === 1 ? t('comments.comment') : t('comments.comments')}
            </Text>
          </VStack>
          <Icon as={Chat} color="az.greyish" mr={"15px"} />
        </HStack>
      </HStack>

      {/* Middle Section */}
      <VStack spacing={'1em'} overflowY="auto" height="50vh" paddingY="4" mt={'20px'}>
        <VStack spacing={5} onScroll={handleScroll} width="100%" overflowY="auto">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <Box key={index} px={2} width="100%">
                <HStack>
                  <CustomAvatar imageUrl={comment.user.avatarUrl} username={comment.user.username} />
                  <VStack align="start" spacing={1} flex="1">
                    <HStack justifyContent="space-between" w="100%">
                      <VStack align="start" spacing={'0px'} flex="1">
                        <HStack align="start" flex="1">
                          <Text fontWeight="bold" isTruncated fontSize={'md'}>
                            {comment.user.username}
                          </Text>
                          <Text isTruncated whiteSpace="pre-line" fontSize="md" fontWeight="normal">
                            {comment.text.replace(/(.{40})/g, '$1\n')}
                          </Text>
                        </HStack>
                        <HStack spacing={1} borderRadius="md">
                          <Text fontSize="xs" color="az.greyish" fontWeight="medium">
                            {timeAgo(comment.dateCreated)}
                          </Text>
                        </HStack>
                      </VStack>
                      <HStack spacing={0}>
                        <LikeComponent episodeOrCommentId={comment.id} initialLikes={comment.likes} showCount={true} />
                        {user && user.id === comment.user.id ? (
                          <IconButton
                            icon={<Icon as={Trash} />}
                            color={'az.greyish'}
                            variant={'minimalColor'}
                            aria-label={t('comments.delete_comment')}
                            data-cy={`delete-comment-id:`}
                            onClick={() => handleDeleteComment(comment.id, true)}
                            size="md"
                          />
                        ) : null}
                      </HStack>
                    </HStack>
                  </VStack>
                </HStack>

                <VStack align="start" spacing={'0px'} mt={'2px'} pl={8}>
                  {replies[comment.id] &&
                    replies[comment.id].map((reply, replyIndex) => (
                      <Box key={index} bg="gray.650" p={2} borderRadius="md" width="100%">
                        <HStack spacing={'5px'} flex={1}>
                          <CustomAvatar imageUrl={reply.user.avatarUrl} username={reply.user.username} />
                          <VStack align="start" spacing={'0px'} flex="1">
                            <HStack align="start" flex="1">
                              <Text fontWeight="bold" isTruncated fontSize={'16px'}>
                                {reply.user.username}
                              </Text>
                              <Text isTruncated whiteSpace="pre-line" fontSize="md" fontWeight="normal">
                                {reply.text.replace(/(.{40})/g, '$1\n')}
                              </Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Text fontSize="xs" color="az.greyish" fontWeight="medium">
                                {timeAgo(reply.dateCreated)}
                              </Text>
                            </HStack>
                          </VStack>
                          <HStack spacing={2}>
                            {user.id === reply.user.id ? (
                              <IconButton
                                icon={<Icon as={Trash} />}
                                variant={'minimalColor'}
                                color={'az.greyish'}
                                aria-label={t('comments.delete_reply')}
                                onClick={() => handleDeleteComment(reply.id, false)}
                                size="sm"
                              />
                            ) : null}
                          </HStack>
                        </HStack>
                      </Box>
                    ))}{' '}
                  <HStack>
                    {comment.noOfReplies > 0 && (!replies[comment.id] || comment.noOfReplies > replies[comment.id].length) && (
                      <Text onClick={() => fetchReplies(comment.id, index, false)} fontSize="14px" fontWeight={'bold'} color={'grey'} variant="ghost" style={{ cursor: 'pointer' }}>
                        {t('comments.load_replies')}
                      </Text>
                    )}
                    {replyInputIndex != index && (
                      <Text
                        onClick={() => handleReplyInput(index)}
                        fontSize="xs"
                        fontWeight={'bold'}
                        color={'az.greyish'}
                        style={{ cursor: 'pointer', transition: 'color 0.5s' }}
                        _hover={{ color: 'white' }}
                      >
                        {t('comments.reply')}
                      </Text>
                    )}
                  </HStack>
                  {replyInputIndex === index && (
                    <Box mt={2} width="100%">
                      <HStack spacing={2}>
                        <Input
                          flex="1"
                          placeholder={t('comments.reply_placeholder')}
                          value={replyTexts[index]}
                          onChange={(e) => {
                            const updatedReplyTexts = [...replyTexts]
                            updatedReplyTexts[index] = e.target.value
                            setReplyTexts(updatedReplyTexts)
                          }}
                        />
                        <IconButton icon={<Icon as={FaReply} />} onClick={() => handleReply(index)} aria-label={t('comments.reply_to_comment')} size="sm" data-cy={`reply-button`} />
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            ))
          ) : (
            <Text color="gray.500" alignSelf={'center'} fontSize={'18px'} pt={6}>
              {t('comments.no_comments_yet')}
            </Text>
          )}
        </VStack>
      </VStack>

      {/* Bottom Section */}
      <Box position="absolute" bottom="0" left="0" right="0" p="30px" >
        <InputGroup width="98%">
          <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={t('comments.add_comment_placeholder')} />
          <Button variant={'minimalColor'} width="18px" height="18px" position="absolute" zIndex={'50'} right="5px" top="55%" transform="translateY(-50%)" onClick={handleAddComment} p="0">
            <Send color="az.red" fontSize={'20px'} />
          </Button>
        </InputGroup>
      </Box>
      {showLoginPrompt && <AuthPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage={t('login_prompt.infoMessage')} />}
    </Box>
  )
}

export default Comments
