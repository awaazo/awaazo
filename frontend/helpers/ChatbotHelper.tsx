import axios from "axios";
import EndpointHelper from "../helpers/EndpointHelper";
import { GetChatbotResponse } from "../types/Responses";

export default class ChatbotHelper {
  public static getEpisodeChat = async (
    episodeId: string,
    page: number,
    pageSize: number
  ): Promise<GetChatbotResponse> => {
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getEpisodeChatEndpoint(episodeId, page, pageSize),
      withCredentials: true,
      cache: false,
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  public static addEpisodeChat = async (
    episodeId: string,
    prompt: string
  ): Promise<any> => { // Replace `any` with the appropriate response type
    const options = {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getAddEpisodeChatEndpoint(),
      data: {
        episodeId,
        prompt
      },
      withCredentials: true,
      cache: false,
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };
}
