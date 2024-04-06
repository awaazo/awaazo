import axios from 'axios'
import EndpointHelper from './EndpointHelper'

import { ReportRequest, SendEmailRequest } from '../types/Requests'
import { BaseResponse, GetEmailLogs, GetReports, GetUserCountResponse, GetUsersResponse } from '../types/Responses'

export default class AdminHelper {
  static getUserProfile() {
    throw new Error('Method not implemented.')
  }

  /**
   * Gets all users from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminGetUsers = async (withDeleted): Promise<GetUsersResponse> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getUsersEndpoint(withDeleted),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminGetUsers...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminGetUsers...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        users: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        users: null,
      }
    }
  }

  /**
   * Creates a email request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminEmailRequest = async (requestData: SendEmailRequest, userId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: 'POST',
      data: requestData,
      url: EndpointHelper.getSendEmailEndpoint(userId),
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminEmailRequest...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminEmailRequest...')
      console.debug(requestResponse)

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
      }
    }
  }

  /**
   * Gets all logs from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminGetLogs = async (page): Promise<GetEmailLogs> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getEmailLogsEndpoint(page),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminGetLogs...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminGetLogs...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        emails: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        emails: null,
      }
    }
  }

  /**
   * Creates a ban user request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminBanUserRequest = async (userId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: 'POST',
      url: EndpointHelper.getBanEndpoint(userId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminEmailRequest...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminEmailRequest...')
      console.debug(requestResponse)

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
      }
    }
  }

  /**
   * Gets all reports from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminGetPendingReports = async (): Promise<GetReports> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getPendingReportsEndpoint(),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminGetPendingReports...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminGetPendingReports...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        reports: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        reports: null,
      }
    }
  }
  /**
   * Gets all reports from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminGetResolvedReports = async (): Promise<GetReports> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getResolvedReportsEndpoint(),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminGetResolvedReports...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminGetResolvedReports...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        reports: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        reports: null,
      }
    }
  }
  /**
   * Gets all reports from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminGetRejectedReports = async (): Promise<GetReports> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getRejectedReportsEndpoint(),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminGetRejectedReports...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminGetRejectedReports...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        reports: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        reports: null,
      }
    }
  }

  /**
   * Creates a resolve report request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminResolveReportRequest = async (reportId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: 'POST',
      url: EndpointHelper.getResolveReportEndpoint(reportId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminResolveReportRequest...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminResolveReportRequest...')
      console.debug(requestResponse)

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
      }
    }
  }

  /**
   * Creates a reject report request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminRejectReportRequest = async (reportId): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: 'POST',
      url: EndpointHelper.getRejectReportEndpoint(reportId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminRejectReportRequest...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminRejectReportRequest...')
      console.debug(requestResponse)

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
      }
    }
  }

  /**
   * Creates a report request to the server.
   * @param requestData Request data to be sent to the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static userReportRequest = async (requestData: ReportRequest): Promise<BaseResponse> => {
    // Create the request options.
    const options = {
      method: 'POST',
      data: requestData,
      url: EndpointHelper.getReportEndpoint(),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following userReportRequest...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following userReportRequest...')
      console.debug(requestResponse)

      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
      }
    }
  }

  /**
   * Gets all reports from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminGetTotalUsers = async (withDeleted): Promise<GetUserCountResponse> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getTotalUsers(withDeleted),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminGetTotalUsers...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminGetTotalUsers...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        userCount: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        userCount: null,
      }
    }
  }

  /**
   * Gets all reports from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminGetRecentlyCreatedUsers = async (daySinceCreation): Promise<GetUserCountResponse> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getRecentlyCreatedUserCount(daySinceCreation),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminGetTotalUsers...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminGetTotalUsers...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        userCount: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        userCount: null,
      }
    }
  }

  /**
   * Gets all reports from the server.
   * @returns A BaseResponse object with the server's response.
   */
  public static adminTotalPodcaster = async (): Promise<GetUserCountResponse> => {
    // Create the request options.
    const options = {
      method: 'Get',
      url: EndpointHelper.getTotalPodcaster(),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following adminTotalPodcaster...')
      console.debug(options)

      console.log(options)
      // Send the request and wait for the response.
      const requestResponse = await axios(options)

      console.debug('Received the following adminTotalPodcaster...')
      console.debug(requestResponse)
      // Return the response.
      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        userCount: requestResponse.data,
      }
    } catch (error) {
      // Return the error.
      return {
        status: error.response.status,
        message: error.response.statusText,
        userCount: null,
      }
    }
  }
}
