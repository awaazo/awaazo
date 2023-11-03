import axios from "axios";
import { BaseResponse, CommentsResponse } from "../utilities/Responses";
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
    public static postComment = async (requestData: CommentRequest): Promise<BaseResponse> => {
        const dataWithTemporaryEpisodeId = {
            ...requestData,
            episodeId: requestData.episodeId || 'tempEpisodeId' // Replace 'tempEpisodeId' with a valid ID if needed
          };
        
        const options = {
            method: 'POST',
            data: dataWithTemporaryEpisodeId,
            url: EndpointHelper.getCommentEndpoint(),
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
    public static getEpisodeComments = async (): Promise<CommentsResponse> => {
        const options = {
            method: 'GET',
            url: EndpointHelper.getEpisodeCommentEndpoint(),
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
    public static getUserComments = async (): Promise<CommentsResponse> => {
        const options = {
            method: 'GET',
            url: EndpointHelper.getUserCommentsEndpoint(),
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
        public static likeComment = async (commentId: string): Promise<BaseResponse> => {
            const options = {
            method: 'POST', // Assuming liking is a POST request
            url: `${EndpointHelper.getLikeEndpoint()}?commentId=${commentId}`,
            headers: {
                accept: '*/*',
            },
            withCredentials: true
            };

            try {
            console.debug(`Liking comment with ID: ${commentId}`);
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
        public static unlikeComment = async (commentId: string): Promise<BaseResponse> => {
            const options = {
            method: 'DELETE', 
            url: `${EndpointHelper.getUnlikeEndpoint()}?commentId=${commentId}`,
            headers: {
                accept: '*/*',
            },
            withCredentials: true
            };

            try {
            console.debug(`Unliking comment with ID: ${commentId}`);
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
    public static deleteComment = async (commentId: string): Promise<BaseResponse> => {
        const options = {
            method: 'DELETE',
            url: `${EndpointHelper.getDeleteCommentEndpoint()}?commentId=${commentId}`,
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


