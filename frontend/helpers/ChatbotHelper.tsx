import axios from "axios";
import EndpointHelper from "../helpers/EndpointHelper";
import { GetChatbotResponse } from "../types/Responses";

export default class ChatbotHelper {
  private static async requestWrapper<T>(request: Promise<T>): Promise<T> {
    try {
      const response = await request;
      return response;
    } catch (error) {
      console.error("Chatbot Helper Error:", error.message, error.response?.data);
      throw new Error(error.response?.data?.message || "An unexpected error occurred");
    }
  }

  public static async getEpisodeChat(
    episodeId: string,
    page: number,
    pageSize: number
  ): Promise<GetChatbotResponse> {
    if (!episodeId || page <= 0 || pageSize <= 0) {
      throw new Error("Invalid parameters for getEpisodeChat");
    }
    const options = {
      method: "GET",
      headers: { accept: "*/*", "Content-Type": "application/json" },
      url: EndpointHelper.getEpisodeChatEndpoint(episodeId, page, pageSize),
      withCredentials: true,
    };
    return this.requestWrapper<GetChatbotResponse>(axios(options));
  }

  public static async addEpisodeChat(
    episodeId: string,
    prompt: string
  ): Promise<GetChatbotResponse> {
    if (!episodeId || !prompt) {
      throw new Error("Invalid parameters for addEpisodeChat");
    }
    const options = {
      method: "POST",
      headers: { accept: "*/*", "Content-Type": "application/json" },
      url: EndpointHelper.getAddEpisodeChatEndpoint(),
      data: { episodeId, prompt },
      withCredentials: true,
    };
    return this.requestWrapper<GetChatbotResponse>(axios(options));
  }
}
