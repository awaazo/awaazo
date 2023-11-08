import axios from "axios";
import { BaseResponse } from "../utilities/Responses";
import EndpointHelper from "./EndpointHelper";

export interface CommentRequest {
    episodeId: string;
    replyToCommentId?: string;
    text: string;
}

export default class SocialHelper {

    /**
     * Posts a new comment or reply to the server.
     * @param requestData Request data to be sent to the server.
     * @returns A BaseResponse object with the server's response.
     */
    public static postComment = async (episodeOrCommentId, requestData: CommentRequest): Promise<BaseResponse> => {
        const dataWithTemporaryEpisodeId = {
            ...requestData,
            episodeId: requestData.episodeId || 'tempEpisodeId' // Replace 'tempEpisodeId' with a valid ID if needed
          };
        
        const options = {
            method: 'POST',
            data: dataWithTemporaryEpisodeId,
            url: EndpointHelper.getCommentEndpoint(episodeOrCommentId),
            headers: {
                accept: '*/*',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        };

        try {
            console.debug("Sending the following comment...");
            console.debug(options);

            const requestResponse = await axios(options);

            console.debug("Received the following response...");
            console.debug(requestResponse);

            return {
                status: requestResponse.status,
                message: requestResponse.statusText
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.statusText
            };
        }
    }

    /**
     * Gets comments for an episode from the server.
     * @returns A CommentsResponse object with the server's response.
     */
    public static getEpisodeComments = async (episodeOrCommentId) => {
        const options = {
            method: 'GET',
            url: EndpointHelper.getEpisodeCommentEndpoint(episodeOrCommentId),
            headers: {
                accept: '*/*',
            },
            withCredentials: true
        };

        try {
            console.debug("Fetching episode comments...");
            const requestResponse = await axios(options);
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                comments: requestResponse.data
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.statusText,
                comments: []
            };
        }
    };



    /**
     * Gets user comments from the server.
     * @returns A CommentsResponse object with the server's response.
     */
    public static getUserComments = async (episodeOrCommentId)=> {
        const options = {
            method: 'GET',
            url: EndpointHelper.getUserCommentsEndpoint(episodeOrCommentId),
            headers: {
                accept: '*/*',
            },
            withCredentials: true
        };

        try {
            console.debug("Fetching user comments...");
            const requestResponse = await axios(options);
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
                comments: requestResponse.data
                
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.statusText,
                comments: []
                
            };
        }
    };

        /**
         * Likes a comment on the server.
         * @param commentId The ID of the comment to be liked.
         * @returns A BaseResponse object with the server's response.
         */
        public static likeComment = async (episodeOrCommentId): Promise<BaseResponse> => {
            const options = {
            method: 'POST', // Assuming liking is a POST request
            url: `${EndpointHelper.getLikeEndpoint(episodeOrCommentId)}?commentId=${episodeOrCommentId}`,
            headers: {
                accept: '*/*',
            },
            withCredentials: true
            };

            try {
            console.debug(`Liking comment with ID: ${episodeOrCommentId}`);
            const requestResponse = await axios(options);
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
            };
            } catch (error) {
            return {
                status: error.response.status,
                message: error.response.statusText,
            };
            }
        };

        /**
        * UnLikes a comment on the server.
        * @param commentId The ID of the comment to be liked.
        * @returns A BaseResponse object with the server's response.
        */
        public static unlikeComment = async (episodeOrCommentId, ): Promise<BaseResponse> => {
            const options = {
            method: 'DELETE', 
            url: `${EndpointHelper.getUnlikeEndpoint(episodeOrCommentId)}?commentId=${episodeOrCommentId}`,
            headers: {
                accept: '*/*',
            },
            withCredentials: true
            };

            try {
            console.debug(`Unliking comment with ID: ${episodeOrCommentId}`);
            const requestResponse = await axios(options);
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
            };
            } catch (error) {
            return {
                status: error.response.status,
                message: error.response.statusText,
            };
            }
        };

    /**
     * Deletes a comment from the server.
     * @param commentId The ID of the comment to be deleted.
     * @returns A BaseResponse object with the server's response.
     */
    public static deleteComment = async (episodeOrCommentId, commentId: string): Promise<BaseResponse> => {
        const options = {
            method: 'DELETE',
            url: `${EndpointHelper.getDeleteCommentEndpoint(episodeOrCommentId)}?commentId=${commentId}`,
            headers: {
                accept: '*/*',
            },
            withCredentials: true
        };

        try {
            console.debug(`Deleting comment with ID: ${commentId}`);
            const requestResponse = await axios(options);
            return {
                status: requestResponse.status,
                message: requestResponse.statusText,
               
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.statusText,
                
            };
        }
    };

 
    }


