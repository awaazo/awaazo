import axios from "axios";
import EndpointHelper from "../helpers/EndpointHelper";
import { BaseResponse } from "../types/Responses";

export default class NotificationHelper {
  static getNotification() {
    throw new Error("Method not implemented.");
  }

  public static getNotifications = async (): Promise<BaseResponse> => {
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getAllNotificationsEndpoint(),
      withCredentials: true, // This will send the session cookie with the request
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

  public static getRangedNotifications = async (
    page,
    pageSize,
  ): Promise<BaseResponse> => {
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getRangeNotificationsEndpoint(page, pageSize),
      withCredentials: true, // This will send the session cookie with the request
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

  public static NotificationCount = async (): Promise<BaseResponse> => {
    const url = EndpointHelper.getNotificationsCountEndpoint();
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      url: EndpointHelper.getNotificationsCountEndpoint(),
      withCredentials: true, // This will send the session cookie with the request
      cache: false,
    };

    try {
      const response = await axios(options);
      console.log("NotificationCount response.data:", response.data); // Add this line
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };
}
