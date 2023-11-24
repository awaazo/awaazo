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
import { Comment, User } from "../../utilities/Interfaces";
import AuthHelper from "../../helpers/AuthHelper";
import LikeComponent from "./likeComponent";

// CommentComponent is a component that displays comments and allows users to add new comments, reply to comments, and like/unlike comments
const CommentComponent = ({ episodeIdOrCommentId, initialComments }) => {
  // Component Values
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTexts, setReplyTexts] = useState(Array(initialComments).fill(""));
  const [replyChange, setReplyChange] = useState(0);
  const [noOfComments, setNoOfComments] = useState(initialComments);
  const [user, setUser] = useState(null);
  const [numRepliesToShow, setNumRepliesToShow] = useState(3);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch episode details and transform comments when the modal is opened
  useEffect(() => {
    if (isOpen) {
      const fetchEpisodeDetails = async () => {
        AuthHelper.authMeRequest().then((response) => {
          if (response.status == 200) {
            setUser(response.userMenuInfo);
          }
        });
        const response = await PodcastHelper.getEpisodeById(
          episodeIdOrCommentId,
        );
        if (response.status === 200) {
          if (response.episode) {
            // Transform the comments to match our format
            const transformedComments = response.episode.comments.map(
              (comment) => ({
                id: comment.id,
                episodeId: comment.episodeId,
                user: comment.user,
                dateCreated: new Date(comment.dateCreated),
                text: comment.text,
                likes: comment.likes,
                replies: comment.replies,
              }),
            );
            setComments(transformedComments);
          }
        } else {
          console.error("Error fetching episode details:", response.message);
        }
      };
      fetchEpisodeDetails();
    }
  }, [isOpen, episodeIdOrCommentId, noOfComments, replyChange]);

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

  const loadMoreReplies = () => {
    setNumRepliesToShow((prevNum) => prevNum + 3);
  };

  return (
    <>
      <Tooltip label="Comment" aria-label="Comment tooltip">
        <Button
          p={2}
          m={1}
          leftIcon={<Icon as={FaComments} />}
          onClick={onOpen}
          variant={"ghost"}
        >
          {noOfComments}
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          backdropFilter="blur(40px)"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          alignSelf={"center"}
          padding={"2em"}
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderRadius={"2em"}
          outlineColor="rgba(255, 255, 255, 0.25)"
        >
          <ModalHeader fontWeight={"light"} fontSize={"1.5em"}>
            Comments
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={5}
              align="start"
              width={isMobile ? "350px" : "500px"}
              height="400px"
              overflowY="auto"
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
                            />
                            {user.id === comment.user.id ? (
                              <IconButton
                                icon={<Icon as={FaTrash} />}
                                variant={"ghost"}
                                aria-label="Delete Comment"
                                onClick={() =>
                                  handleDeleteComment(comment.id, true)
                                }
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
                      {comment.replies
                        .slice(0, numRepliesToShow)
                        .map((reply, index) => (
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
                                <Text fontWeight="bold">
                                  {reply.user.username}:
                                </Text>
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
                            />
                          </Tooltip>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                ))
              ) : (
                <Text color="gray.500" alignSelf={"center"}>
                  No comments yet. Be the first!
                </Text>
              )}
            </VStack>
            <VStack position={"relative"}>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                borderRadius={"1em"}
              />
              <Button
                leftIcon={<Icon as={FaPaperPlane} />}
                colorScheme="blue"
                onClick={handleAddComment}
                zIndex="1"
                fontSize="md"
                borderRadius={"full"}
                minWidth={"10em"}
                color={"white"}
                marginTop={"15px"}
                marginBottom={"10px"}
                padding={"20px"}
                outline={"1px solid rgba(255, 255, 255, 0.6)"}
                style={{
                  background:
                    "linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)",
                  backgroundSize: "300% 300%",
                  animation: "Gradient 10s infinite linear",
                }}
              >
                Add Comment
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentComponent;
