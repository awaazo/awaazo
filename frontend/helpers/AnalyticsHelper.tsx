import axios from 'axios'
import EndpointHelper from './EndpointHelper'
import { GetEngagementMetricsResponse } from '../types/Responses'

export default class AnalyicsHelper {
  static getUserProfile() {
    throw new Error('Method not implemented.')
  }

  static getEngagementMetricsResponse = async (podcastOrEpisodeId): Promise<GetEngagementMetricsResponse> => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getUserEngagementMetrics(podcastOrEpisodeId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getEngagementMetricsResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getEngagementMetricsResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        metrics: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        metrics: null,
      }
    }
  }

  /**
   * Gets the most commented items from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getMostCommentedResponse = async (podcastId, count, getLessCommented) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getMostCommented(podcastId, count, getLessCommented),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getMostCommentedResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getMostCommentedResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the most liked items from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getMostLikedResponse = async (podcastId, count, getLessLiked) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getMostLiked(podcastId, count, getLessLiked),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getMostLikedResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getMostLikedResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the most clicked items from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getMostClickedResponse = async (podcastId, count, getLessClicked) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getMostClicked(podcastId, count, getLessClicked),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getMostClickedResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getMostClickedResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the most watched items from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getMostWatchedResponse = async (podcastId, count, getLessWatched) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getMostWatched(podcastId, count, getLessWatched),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getMostWatchedResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getMostWatchedResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the average watch time from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getAverageWatchTimeResponse = async (podcastOrEpisodeId) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getAverageWatchTime(podcastOrEpisodeId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getAverageWatchTimeResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getAverageWatchTimeResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the total watch time from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getTotalWatchTimeResponse = async (podcastOrEpisodeId) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getTotalWatchTime(podcastOrEpisodeId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getTotalWatchTimeResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getTotalWatchTimeResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the watch time distribution from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getWatchTimeDistributionResponse = async (podcastOrEpisodeId, timeInterval, intervalIsInMinutes) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getWatchTimeDistribution(podcastOrEpisodeId, timeInterval, intervalIsInMinutes),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getWatchTimeDistributionResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getWatchTimeDistributionResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the watch time range info from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getWatchTimeRangeInfoResponse = async (podcastOrEpisodeId) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getWatchTimeRangeInfo(podcastOrEpisodeId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getWatchTimeRangeInfoResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getWatchTimeRangeInfoResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the average audience age from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getAverageAudienceAgeResponse = async (podcastOrEpisodeId) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getAverageAudienceAge(podcastOrEpisodeId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getAverageAudienceAgeResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getAverageAudienceAgeResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the age range info from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getAgeRangeInfoResponse = async (podcastOrEpisodeId, min, max) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getAgeRangeInfo(podcastOrEpisodeId, min, max),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getAgeRangeInfoResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getAgeRangeInfoResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the age range distribution info from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getAgeRangeDistributionInfoResponse = async (podcastOrEpisodeId, ageInterval) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getAgeRangeDistributionInfo(podcastOrEpisodeId, ageInterval),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getAgeRangeDistributionInfoResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getAgeRangeDistributionInfoResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }
  /**
   * Gets the user average watch time from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getUserAverageWatchTimeResponse = async (podcastOrEpisodeId) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getUserAverageWatchTime(podcastOrEpisodeId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getUserAverageWatchTimeResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getUserAverageWatchTimeResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the user total watch time from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getUserTotalWatchTimeResponse = async (podcastOrEpisodeId) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getUserTotalWatchTime(podcastOrEpisodeId),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getUserTotalWatchTimeResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getUserTotalWatchTimeResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the top watched items from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getTopWatchedResponse = async (isEpisodes, count, getLessWatched, page, pageSize) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getTopWatched(isEpisodes, count, getLessWatched, page, pageSize),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getTopWatchedResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getTopWatchedResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the top genre from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getTopGenreResponse = async () => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getTopGenre(),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getTopGenreResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getTopGenreResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }

  /**
   * Gets the listening history from the server.
   * @returns A BaseResponse object with the server's response.
   */
  static getListeningHistoryResponse = async (page, pageSize) => {
    const options = {
      method: 'GET',
      url: EndpointHelper.getListeningHistory(page, pageSize),
      headers: {
        accept: '*/*',
      },
      withCredentials: true,
      cache: false,
    }

    try {
      console.debug('Sending the following getListeningHistoryResponse...')
      console.debug(options)

      const requestResponse = await axios(options)

      console.debug('Received the following getListeningHistoryResponse...')
      console.debug(requestResponse)

      return {
        status: requestResponse.status,
        message: requestResponse.statusText,
        data: requestResponse.data,
      }
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.statusText,
        data: null,
      }
    }
  }
}
