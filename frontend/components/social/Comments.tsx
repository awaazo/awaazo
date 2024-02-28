import { useState, useEffect } from "react";
import SocialHelper from "../../helpers/SocialHelper";
import PodcastHelper from "../../helpers/PodcastHelper";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  VStack,
  useDisclosure,
  Icon,
  Avatar,
  Text,
  HStack,
  Box,
  Tooltip,
  Input,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import {
  FaComments,
  FaClock,
  FaPaperPlane,
  FaTrash,
  FaReply,
} from "react-icons/fa";
import { Comment } from "../../types/Interfaces";
import AuthHelper from "../../helpers/AuthHelper";
import LikeComponent from "./Likes";
import AuthPrompt from "../auth/AuthPrompt";

// CommentComponent is a component that displays comments and allows users to add new comments, reply to comments, and like/unlike comments
const Comments = ({ episodeIdOrCommentId, initialComments }) => {
  // Component Values
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState(Array(initialComments).fill(""));
  const [replyChange, setReplyChange] = useState(0);
  const [noOfComments, setNoOfComments] = useState(initialComments);
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [replies, setReplies] = useState({});
  const [repliesPage, setRepliesPage] = useState({});

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch episode details and transform comments when the modal is opened
  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      AuthHelper.authMeRequest().then((response) => {
        if (response.status == 200) {
          setUser(response.userMenuInfo);
        }
      });
      const response = await SocialHelper.getComments(
        episodeIdOrCommentId,
        commentPage,
        10,
      );

      if (response.status === 200) {
        if (response) {
          setComments([...comments, ...formatComments(response.comments)]);
        }
      } else {
        console.error("Error fetching episode details:", response.message);
      }
    };
    fetchEpisodeDetails();
  }, [episodeIdOrCommentId, noOfComments, replyChange, commentPage]);

  const formatComments = (fetchedComments) => {
    const updatedComments = fetchedComments.map((comment) => ({
      ...comment,
      dateCreated: new Date(comment.dateCreated),
    }));

    return updatedComments;
  };

  const fetchReplies = async (commentId) => {
    const currentPage = repliesPage[commentId] || 0;
    const response = await SocialHelper.getReplies(commentId, currentPage, 10);
    console.log("API Response:", response);
    if (response.status === 200) {
      setReplies({
        ...replies,
        [commentId]: [...(replies[commentId] || []), ...response.replies],
      });
      setRepliesPage({
        ...repliesPage,
        [commentId]: currentPage + 1,
      });
    } else {
      console.error("Error fetching replies:", response.message);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setCommentPage((prevPage) => prevPage + 1);
    }
  };

  // Add a new comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      const response = await SocialHelper.postEpisodeComment(
        newComment,
        episodeIdOrCommentId,
      );
      if (response.status === 200) {
        // Update the UI to reflect the new comment
        setNoOfComments((noOfComments) => noOfComments + 1);
      } else {
        //User is not logged in, prompt them to do so
        setShowLoginPrompt(true);
        console.log("Error posting comment:", response.message);
      }
      setNewComment("");
    }
  };

  // Reply to a comment
  const handleReply = async (index: number) => {
    if (replyTexts[index] == "") {
      return;
    }
    const comment = comments[index];
    const commentId = comment.id;
    const updatedComments = [...comments];

    const response = await SocialHelper.postEpisodeComment(
      replyTexts[index],
      commentId,
    );
    if (response.status === 200) {
      // Update the UI to reflect the new reply
      setReplyChange((replyChange) => replyChange + 1);
    } else {
      //User is not logged in, prompt them to do so
      setShowLoginPrompt(true);
      console.log("Error posting comment:", response.message);
    }
    const updatedReplyTexts = [...replyTexts];
    updatedReplyTexts[index] = "";
    setReplyTexts(updatedReplyTexts);
  };

  // Deletes the Comment
  const handleDeleteComment = (commentOrReplyId, isComment) => {
    SocialHelper.deleteComment(commentOrReplyId).then((response) => {
      if (response.status === 200) {
        if (isComment) {
          setNoOfComments((noOfComments) => noOfComments - 1);
        } else {
          setReplyChange((replyChange) => replyChange - 1);
        }
      } else {
        console.log("Error deleting comment:", response.message);
      }
    });
  };

  return (
    <>
      <VStack
        spacing={5}
        onScroll={handleScroll}
        align="start"
        maxHeight="60vh"
        width="100%"
        overflowY="auto"
        mt={"50px"}
      >
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <Box
              key={index}
              p={3}
              borderRadius="md"
              boxShadow="sm"
              bg={"gray.550"}
              _hover={{ transition: "0.3s" }}
              width="100%"
            >
              <HStack spacing={5}>
                <Avatar src={comment.user.avatarUrl} />
                <VStack align="start" spacing={1} flex="1">
                  <HStack justifyContent="space-between" w="100%">
                    <VStack align="start" spacing={1} flex="1">
                      <Text fontWeight="bold" isTruncated>
                        {comment.user.username}:
                      </Text>
                      <Text isTruncated whiteSpace="pre-line">
                        {comment.text.replace(/(.{40})/g, "$1\n")}
                      </Text>
                    </VStack>
                    <HStack spacing={2}>
                      <LikeComponent
                        episodeOrCommentId={comment.id}
                        initialLikes={comment.likes}
                        showCount={true}
                      />
                      {user && user.id === comment.user.id ? (
                        <IconButton
                          icon={<Icon as={FaTrash} />}
                          variant={"ghost"}
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
              <HStack spacing={1} p={2} borderRadius="md">
                <Icon as={FaClock} color="gray.500" />
                <Text fontSize="xs" color="gray.500">
                  {comment.dateCreated.toLocaleString()}
                </Text>
              </HStack>
              <VStack align="start" spacing={2} mt={3} pl={8}>
                {replies[comment.id] &&
                  replies[comment.id].map((reply, replyIndex) => (
                    <Box
                      key={index}
                      bg="gray.650"
                      p={2}
                      borderRadius="md"
                      width="100%"
                    >
                      <HStack spacing={5} flex={1}>
                        <Avatar src={reply.user.avatarUrl} />
                        <VStack align="start" spacing={1} flex="1">
                          <Text fontWeight="bold">{reply.user.username}:</Text>
                          <Text whiteSpace="pre-line">
                            {reply.text.replace(/(.{40})/g, "$1\n")}
                          </Text>
                        </VStack>
                        <HStack spacing={2}>
                          {user.id === reply.user.id ? (
                            <IconButton
                              icon={<Icon as={FaTrash} />}
                              variant={"ghost"}
                              aria-label="Delete Reply"
                              onClick={() =>
                                handleDeleteComment(reply.id, false)
                              }
                              size="sm"
                            />
                          ) : null}
                        </HStack>
                      </HStack>

                      <HStack spacing={1} p={2} borderRadius="md">
                        <Icon as={FaClock} color="gray.500" />
                        <Text fontSize="xs" color="gray.500">
                          {new Date(reply.dateCreated).toLocaleString()}
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                {comment.noOfReplies && comment.noOfReplies > 0 && (
                  <Button onClick={() => fetchReplies(comment.id)} size="sm">
                    Load Replies
                  </Button>
                )}
                <Box mt={2} width="100%">
                  <HStack spacing={2}>
                    <Input
                      flex="1"
                      placeholder="Reply to this comment..."
                      value={replyTexts[index]}
                      onChange={(e) => {
                        const updatedReplyTexts = [...replyTexts];
                        updatedReplyTexts[index] = e.target.value;
                        setReplyTexts(updatedReplyTexts);
                      }}
                    />
                    <Tooltip
                      label="Reply to this comment"
                      aria-label="Reply tooltip"
                    >
                      <IconButton
                        icon={<Icon as={FaReply} />}
                        onClick={() => handleReply(index)}
                        aria-label="Reply to Comment"
                        size="sm"
                        data-cy={`reply-button`}
                      />
                    </Tooltip>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          ))
        ) : (
          <Text color="gray.500" alignSelf={"center"} fontSize={"18px"}>
            No comments yet. Be the first!
          </Text>
        )}
      </VStack>
      <VStack position="fixed" bottom="0" width="100%" pr={"40px"} pb={"20px"}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          borderRadius={"1em"}
        />
        <Button
          leftIcon={<Icon as={FaPaperPlane} />}
          onClick={handleAddComment}
          zIndex="1"
          variant="gradient"
        >
          Add Comment
        </Button>
      </VStack>

      {showLoginPrompt && (
        <AuthPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="Login To add a Reply or a Comment."
        />
      )}
    </>
  );
};

export default Comments;
