import React, { useState, useEffect } from 'react'
import SocialHelper from '../../helpers/SocialHelper'
import { Button, Textarea, VStack, Icon, Avatar, Text, HStack, Box, Tooltip, Input, useBreakpointValue, IconButton } from '@chakra-ui/react'
import { FaClock, FaPaperPlane, FaTrash, FaReply } from 'react-icons/fa'
import AuthHelper from '../../helpers/AuthHelper'
import LikeComponent from './Likes'
import AuthPrompt from '../auth/AuthPrompt'

const Comments = ({ episodeIdOrCommentId, initialComments }) => {
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

  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      AuthHelper.authMeRequest().then((response) => {
        if (response.status == 200) {
          setUser(response.userMenuInfo)
        }
      })
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
      return interval + ' years ago'
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + ' months ago'
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + ' days ago'
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + ' hours ago'
    }
    interval = Math.floor(seconds / 60)
    if (interval > 1) {
      return interval + ' minutes ago'
    }
    return Math.floor(seconds) + ' seconds ago'
  }

  return (
    <Box height={'100%'}>
      <Text fontSize="xl" fontWeight="bold" mt={1} ml={2}>
        Comments
      </Text>
      <VStack spacing={5} onScroll={handleScroll} height="35vh" width="100%" overflowY="auto" mt={'50px'}>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <Box key={index} p={3} borderRadius="md" boxShadow="sm" bg={'gray.550'} _hover={{ transition: '0.3s' }} width="100%">
              <HStack>
                <Avatar src={comment.user.avatarUrl} />
                <VStack align="start" spacing={1} flex="1">
                  <HStack justifyContent="space-between" w="100%">
                    <VStack align="start" spacing={'0px'} flex="1">
                      <HStack align="start" flex="1">
                        <Text fontWeight="bold" isTruncated fontSize={'16px'}>
                          {comment.user.username}:
                        </Text>
                        <Text isTruncated whiteSpace="pre-line">
                          {comment.text.replace(/(.{40})/g, '$1\n')}
                        </Text>
                      </HStack>
                      <HStack spacing={1} borderRadius="md">
                        <Text fontSize="xs" color="grey" fontWeight={'bold'}>
                          {timeAgo(comment.dateCreated)}
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack spacing={2}>
                      <LikeComponent episodeOrCommentId={comment.id} initialLikes={comment.likes} showCount={true} />
                      {user && user.id === comment.user.id ? (
                        <IconButton
                          icon={<Icon as={FaTrash} />}
                          variant={'ghost'}
                          aria-label="Delete Comment"
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
                        <Avatar src={reply.user.avatarUrl} />
                        <VStack align="start" spacing={'0px'} flex="1">
                          <HStack align="start" flex="1">
                            <Text fontWeight="bold" isTruncated fontSize={'16px'}>
                              {reply.user.username}:
                            </Text>
                            <Text isTruncated whiteSpace="pre-line">
                              {reply.text.replace(/(.{40})/g, '$1\n')}
                            </Text>
                          </HStack>
                          <HStack spacing={1} borderRadius="md">
                            <Text fontSize="xs" color="grey" fontWeight={'bold'}>
                              {timeAgo(reply.dateCreated)}
                            </Text>
                          </HStack>
                        </VStack>
                        <HStack spacing={2}>
                          {user.id === reply.user.id ? (
                            <IconButton icon={<Icon as={FaTrash} />} variant={'ghost'} aria-label="Delete Reply" onClick={() => handleDeleteComment(reply.id, false)} size="sm" />
                          ) : null}
                        </HStack>
                      </HStack>
                    </Box>
                  ))}{' '}
                <HStack>
                  {comment.noOfReplies > 0 && (!replies[comment.id] || comment.noOfReplies > replies[comment.id].length) && (
                    <Text onClick={() => fetchReplies(comment.id, index, false)} fontSize="14px" fontWeight={'bold'} color={'grey'} variant="ghost" style={{ cursor: 'pointer' }}>
                      Load Replies
                    </Text>
                  )}
                  {replyInputIndex != index && (
                    <Text onClick={() => handleReplyInput(index)} fontSize="14px" fontWeight={'bold'} color={'grey'} variant="ghost" style={{ cursor: 'pointer' }}>
                      Reply
                    </Text>
                  )}
                </HStack>
                {replyInputIndex === index && (
                  <Box mt={2} width="100%">
                    <HStack spacing={2}>
                      <Input
                        flex="1"
                        placeholder="Reply to this comment..."
                        value={replyTexts[index]}
                        onChange={(e) => {
                          const updatedReplyTexts = [...replyTexts]
                          updatedReplyTexts[index] = e.target.value
                          setReplyTexts(updatedReplyTexts)
                        }}
                      />
                      <Tooltip label="Reply to this comment" aria-label="Reply tooltip">
                        <IconButton icon={<Icon as={FaReply} />} onClick={() => handleReply(index)} aria-label="Reply to Comment" size="sm" data-cy={`reply-button`} />
                      </Tooltip>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
          ))
        ) : (
          <Text color="gray.500" alignSelf={'center'} fontSize={'18px'}>
            No comments yet. Be the first!
          </Text>
        )}
      </VStack>
      <VStack position="relative" width="100%" p={'20px'}>
        <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." borderRadius={'1em'} />
        <Button leftIcon={<Icon as={FaPaperPlane} />} onClick={handleAddComment} zIndex="1" variant="gradient">
          Add Comment
        </Button>
      </VStack>
      {showLoginPrompt && <AuthPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage="Login To add a Reply or a Comment." />}
    </Box>
  )
}

export default Comments
