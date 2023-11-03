import { useState, useEffect  } from 'react';
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
    Flex,
    Tooltip,
    Input,
    IconButton,
    Spacer
} from "@chakra-ui/react";
import { FaComments, FaClock, FaPaperPlane, FaHeart, FaReply } from 'react-icons/fa';
import EndpointHelper from '../../helpers/EndpointHelper';
import axios from 'axios';
import SocialHelper from '../../helpers/SocialHelper';

const CommentComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [comments, setComments] = useState<Array<{
       replies: any;
       likes: number;
       isLiked: any; user: string, avatar: string, timestamp: Date, text: string 
}>>([]);
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState('');

    const handleAddComment = async () => {
      if (newComment.trim()) {
          const newCommentData = {
              user: "John Doe",
              avatar: "https://via.placeholder.com/150",
              timestamp: new Date(),
              text: newComment.trim(),
              likes: 0,
              isLiked: false,
              replies: []
          };
          setComments(prevComments => [...prevComments, newCommentData]);
          setNewComment('');

          // Send the comment to the server
          const commentRequest = {
            episodeId: "tempEpisodeId", // Replace with the actual episode ID
            text: newComment.trim()
        };
        
            const response = await SocialHelper.postComment(commentRequest);
                if (response.status !== 200) {
                   console.error("Error posting comment:", response.message);
                } else {
                    // Optionally update the state with the new comment returned from the server
                }
      };
    
        // Send the comment to the server
        const commentRequest = {
            text: newComment.trim()
        }

    };
        

  const handleReply = (index: number) => {
      if (replyText.trim()) {
          const reply = {
              user: "John Doe", // This should be replaced with the actual user's name
              text: replyText.trim(),
              timestamp: new Date()
          };
          const updatedComments = [...comments];
          updatedComments[index].replies.push(reply);
          setComments(updatedComments);
          setReplyText('');
      }
  };

  const handleLike = (index: number) => {
      const updatedComments = [...comments];
      if (updatedComments[index].isLiked) {
          updatedComments[index].likes -= 1;
          updatedComments[index].isLiked = false;
      } else {
          updatedComments[index].likes += 1;
          updatedComments[index].isLiked = true;
      }
      setComments(updatedComments);
  };

  const handleDeleteComment = (commentId) => {
    SocialHelper.deleteComment(commentId)
        .then(response => {
            if (response.status === 200) {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            } else {
                console.error("Error deleting comment:", response.message);
            }
        });
};


  useEffect(() => {
    if (isOpen) {
        SocialHelper.getEpisodeComments()
            .then(response => {
                if (response.status === 200) {
                    setComments(response.comments);
                } else {
                    console.error("Error fetching episode comments:", response.message);
                }
            });
    }
}, [isOpen]);

  return (
   <>
       <Tooltip label="Post a comment" aria-label="Comment tooltip">
           <Button p={2} m={1} leftIcon={<Icon as={FaComments} />} onClick={onOpen}>
               {comments.length}
           </Button>
       </Tooltip>

       <Modal isOpen={isOpen} onClose={onClose} size="xl">
           <ModalOverlay />
           <ModalContent>
               <ModalHeader>Comments</ModalHeader>
               <ModalCloseButton />
               <ModalBody>
                   <VStack spacing={5} align="start" height="300px" overflowY="auto">
                       {comments.length > 0 ? comments.map((comment, index) => (
                           <Box 
                               key={index} 
                               p={3} 
                               borderRadius="md" 
                               boxShadow="sm" 
                               bg={index % 2 === 0 ? "gray.550" : "gray.600"} 
                               _hover={{ bg: "gray.400", transition: "0.3s" }} 
                               width="100%" 
                           >
                               <HStack spacing={5}>
                                   <Avatar src={comment.avatar} />
                                   <VStack align="start" spacing={1} flex="1">
                                       <Text fontWeight="bold" isTruncated>{comment.user}</Text>
                                       <Text isTruncated>{comment.text}</Text>
                                   </VStack>
                               </HStack>
                               <HStack spacing={1}   p={2} borderRadius="md"> 
                                    <Icon as={FaClock} color="gray.500" />
                                    <Text fontSize="xs" color="gray.500">{comment.timestamp.toLocaleString()}</Text>
                                </HStack>
                               <HStack mt={3} spacing={2}>
                                   <Tooltip label="Like this comment" aria-label="Like tooltip">
                                       <IconButton 
                                           icon={<Icon as={FaHeart} color={comment.isLiked ? "red.500" : "gray.500"} />} 
                                           onClick={() => handleLike(index)}
                                           aria-label="Like Comment"
                                           size="sm"
                                       />
                                   </Tooltip>
                                   <Text fontSize="sm">{comment.likes}</Text>
                                   <Tooltip label="Reply to this comment" aria-label="Reply tooltip">
                                       <IconButton 
                                           icon={<Icon as={FaReply} />} 
                                           onClick={() => handleReply(index)}
                                           aria-label="Reply to Comment"
                                           size="sm"
                                       />
                                   </Tooltip>
                               </HStack>
                               <VStack align="start" spacing={2} mt={3} pl={8}>
                                   {comment.replies.map(reply => (
                                       <Box key={reply.timestamp.toString()} bg="gray.650" p={2} borderRadius="md">
                                           <Text fontWeight="bold">{reply.user}:</Text>
                                           <Text>{reply.text}</Text>
                                           <Text fontSize="xs" color="gray.500">{reply.timestamp.toLocaleString()}</Text>
                                       </Box>
                                   ))}
                                   <Input 
                                       placeholder="Reply to this comment..."
                                       value={replyText}
                                       onChange={(e) => setReplyText(e.target.value)}
                                   />
                               </VStack>
                           </Box>
                       )) : <Text color="gray.500">Be the first to comment!</Text>}
                   </VStack>
                   <Box position="relative" mt={4}>
                       <Textarea
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           placeholder="Add a comment..."
                           paddingRight="40px"
                       />
                       <Button 
                           position="absolute" 
                           right="5px" 
                           bottom="5px" 
                           leftIcon={<Icon as={FaPaperPlane} />} 
                           colorScheme="blue" 
                           onClick={handleAddComment}
                           zIndex="1"
                       />
                   </Box>
               </ModalBody>
           </ModalContent>
       </Modal>
   </>
);


};

export default CommentComponent;