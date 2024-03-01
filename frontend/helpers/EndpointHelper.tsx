/**
 * Provides the appropriate backend endpoints, depending on the environment
 */
export default class EndpointHelper {
  /**
   * Returns the address of the backend, which will vary
   * depending on the environment.
   * @returns The address of the backend
   */
  static getBackendAddress = () => {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") return process.env.NEXT_PUBLIC_BASE_URL;
    else return process.env.NEXT_PUBLIC_BASE_URL;
  };

  // --------------------------------
  // AUTH ENDPOINTS
  // --------------------------------

  /**
   * Returns the backend login endpoint.
   * @returns The Login API Endpoint
   */
  static getAuthLoginEndpoint = () => {
    return this.getBackendAddress() + "/auth/login";
  };

  /**
   * Returns the backend logout endpoint.
   * @returns The Logout API Endpoint
   */
  static getAuthLogoutEndpoint = () => {
    return this.getBackendAddress() + "/auth/logout";
  };

  /**
   * Returns the backend register endpoint.
   * @returns The Register API Endpoint
   */
  static getAuthRegisterEndpoint = () => {
    return this.getBackendAddress() + "/auth/register";
  };

  /**
   * Returns the backend Me endpoint.
   * @returns The Me API Endpoint
   */
  static getAuthMeEndpoint = () => {
    return this.getBackendAddress() + "/auth/me";
  };

  /**
   * Returns the Google SSO endpoint.
   * @returns The Google SSO Endpoint
   */
  static getGoogleSSOEndpoint = () => {
    return this.getBackendAddress() + "/auth/googleSSO";
  };

  /**
   * Returns the password reset endpoint.
   * @returns The Password Reset Endpoint
   * */

  static getForgotPasswordEndpoint = () => {
    return this.getBackendAddress() + "/auth/sentForgotPasswordEmail";
  };

  static getCheckEmailEndpoint = () => {
    return this.getBackendAddress() + "/auth/CheckEmail";
  }



  // --------------------------------
  // PROFILE ENDPOINTS
  // --------------------------------

  /**
   * Returns the Profile Setup endpoint.
   * @returns The Profile Setup Endpoint
   */
  static getProfileSetupEndpoint = () => {
    return this.getBackendAddress() + "/profile/setup";
  };

  /**
   * Returns the Profile Edit endpoint.
   * @returns The Profile Edit Endpoint
   */
  static getProfileEditEndpoint = () => {
    return this.getBackendAddress() + "/profile/edit";
  };

  /**
   * Returns the Profile Get endpoint.
   * @returns The Profile Get Endpoint
   */
  static getProfileGetEndpoint = () => {
    return this.getBackendAddress() + "/profile/get";
  };

  /**
   * Returns the Profile Get endpoint.
   * @returns The Profile Get Endpoint
   */
  static getProfileByIdEndpoint = (userId: string) => {
    return this.getBackendAddress() + "/profile/" + userId + "/get";
  };

  /**
   * Returns the Profile search endpoint.
   * @returns The Profile search Endpoint
   */
  static getProfileSearchEndpoint = (searchTerm: string, page: number, pageSize: number) => {
    return this.getBackendAddress() + "/profile/search?searchterm=" + searchTerm + "&page=" + page + "&pageSize=" + pageSize;
  };

  static getChangePasswordEndpoint = () => {
    return this.getBackendAddress() + "/profile/changePassword";
  };

  static getResetPasswordEndpoint = () => {
    return this.getBackendAddress() + "/profile/resetPassword";
  }

  static getforgotPasswordEndpoint = () => {
    return this.getBackendAddress() + "/profile/sentForgotPasswordEmail";
  };
  // --------------------------------
  // PODCAST ENDPOINTS (INCLUDES PODCAST+EPISODES)
  // --------------------------------

  /**
   * Returns the Podcast Create endpoint.
   * @returns The Podcast Create Endpoint
   */
  static getPodcastCreateEndpoint = () => {
    return this.getBackendAddress() + "/podcast/create";
  };

  /**
   * Returns the Podcast getRecentPodcasts endpoint.
   * @returns The Podcast getRecentPodcasts Endpoint
   */
  static getRecentPodcastsEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/getRecentPodcasts?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcast getRecentEpisodes endpoint.
   * @returns The Podcast getRecentEpisodes Endpoint
   */
  static getRecentEpisodesEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/getRecentEpisodes?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getPodcastMyPodcastsEndpoint = (page: number, pageSize: number) => {
    return this.getBackendAddress() + "/podcast/myPodcasts?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the Podcast all podcasts endpoint.
   * @returns The Podcast all podcasts Endpoint
   */
  static getPodcastAllPodcastsEndpoint = (page: number, pageSize: number) => {
    return this.getBackendAddress() + "/podcast/all?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getEpisodeAddEndpoint = (podcastId: string) => {
    return this.getBackendAddress() + "/podcast/" + podcastId + "/add";
  };

  /**
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getPodcastEndpoint = (podcastId: string) => {
    return this.getBackendAddress() + "/podcast/" + podcastId;
  };

  /**
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getPodcastByUserIdEndpoint = (userId: string, page: number, pageSize: number) => {
    return this.getBackendAddress() + "/podcast/userPodcasts?userId=" + userId + "&page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the Podcasts by tags endpoint.
   * @returns The Podcasts by tags Endpoint
   */
  static getByTagsPodcastEndpoint = (page: number, pageSize: number) => {
    return this.getBackendAddress() + "/podcast/byTags?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the Podcast search endpoint.
   * @returns The Podcast search Endpoint
   */
  static getSearchPodcastEndpoint = (page: number, pageSize: number) => {
    return this.getBackendAddress() + "/podcast/search?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the Podcast search endpoint.
   * @returns The Podcast search Endpoint
   */
  static getSearchEpisodeEndpoint = (page: number, pageSize: number) => {
    return this.getBackendAddress() + "/podcast/episode/search?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the Podcast delete endpoint.
   * @returns The Podcast delete Endpoint
   */
  static getPodcastDeleteEndpoint = (podcastId: string) => {
    return this.getBackendAddress() + "/podcast/delete?podcastId=" + podcastId;
  };

  /**
   * Returns the Podcast edit endpoint.
   * @returns The Podcast edit Endpoint
   */
  static getPodcastEditEndpoint = () => {
    return this.getBackendAddress() + "/podcast/edit";
  };

  /**
   * Returns the Episode delete endpoint.
   * @returns The Episode delete Endpoint
   */
  static getPodcastEpisodeDeleteEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/podcast/" + episodeId + "/delete";
  };

  /**
   * Returns the Episode by id endpoint.
   * @returns The Episode by id Endpoint
   */
  static getPodcastEpisodeByIdEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/podcast/episode/" + episodeId;
  };
  /**
   * Returns the Episode edit endpoint.
   * @returns The Episode edit Endpoint
   */
  static getPodcastEpisodeEditEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/podcast/" + episodeId + "/edit";
  };

  // --------------------------------
  // SOCIAL ENDPOINTS
  // --------------------------------

  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   */

  static getPodcastRatingEndpoint = () => {
    return this.getBackendAddress() + "/social/rating";
  };
  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   */

  static getPodcastRatingDeleteEndpoint = (podcastId: string) => {
    return this.getBackendAddress() + "/social/deleteRating?podcastId=" + podcastId;
  };
  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   */

  static getPodcastReviewEndpoint = () => {
    return this.getBackendAddress() + "/social/review";
  };
  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   */

  static getPodcastReviewDeleteEndpoint = (podcastId: string) => {
    return this.getBackendAddress() + "/social/deleteReview?podcastId=" + podcastId;
  };

  /**
   * Returns the Podcast COMMENTS + LIKES endpoint.
   * @returns The Podcast COMMENTS + LIKES Endpoint
   */
  static getCommentEndpoint = (episodeOrCommentId: string) => {
    return this.getBackendAddress() + "/social/" + episodeOrCommentId + "/comment";
  };

  /**
   * Returns the Podcast COMMENTS Delete endpoint.
   * @returns The Podcast COMMENTS Delete Endpoint
   */
  static getCommentDeleteEndpoint = (commentId: string) => {
    return this.getBackendAddress() + "/social/" + commentId + "/delete";
  };

  /**
   * Returns the Podcast like endpoint.
   * @returns The Podcast like Endpoint
   */
  static getLikeEndpoint = (episodeOrCommentId: string) => {
    return this.getBackendAddress() + "/social/" + episodeOrCommentId + "/like";
  };

  /**
   * Returns the Podcast unlike endpoint.
   * @returns The Podcast unlike Endpoint
   */
  static getUnlikeEndpoint = (episodeOrCommentId: string) => {
    return this.getBackendAddress() + "/social/" + episodeOrCommentId + "/unLike";
  };

  /**
   * Returns the Podcast isLiked endpoint.
   * @returns The Podcast isLiked Endpoint
   */
  static getIsLikedEndpoint = (episodeOrCommentId: string) => {
    return this.getBackendAddress() + "/social/" + episodeOrCommentId + "/isLiked";
  };

  /**
   * Returns the Episode Play endpoint.
   * @returns The Episode Play Endpoint
   */

  // --------------------------------
  // BOOKMARKS ENDPOINTS
  // --------------------------------

  /**
   * Returns the Episode Bookmarks endpoint.
   * @returns The Episode Bookmarks Endpoint
   * */
  static getBookmarksEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/bookmark/" + episodeId + "/allBookmarks";
  };

  /**
   * Returns the Episode Add Bookmark endpoint.
   * @returns The Episode Add Bookmark Endpoint
   * */

  static getBookmarkAddEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/bookmark/" + episodeId + "/add";
  };

  /**
   * Returns the Episode Delete Bookmark endpoint.
   * @returns The Episode Delete Bookmark Endpoint
   * */
  static getBookmarkDeleteEndpoint = (bookmarkId: string) => {
    return this.getBackendAddress() + "/bookmark/" + bookmarkId + "/delete";
  };

  static getPodcastEpisodePlayEndpoint = (podcastId: string, episodeId: string) => {
    return `${this.getBackendAddress()}/podcast/${podcastId}/${episodeId}/getAudio`;
  };

  // --------------------------------
  // NOTIFICATION ENDPOINTS
  // --------------------------------
  /**
   * Returns the Notification endpoint.
   * @returns The Notification Endpoint
   */
  static getRangeNotificationsEndpoint = (page: number, pageSize: number) => {
    return this.getBackendAddress() + "/notification/all?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the Notification endpoint.
   * @returns The Notification Endpoint
   */
  static getAllNotificationsEndpoint = () => {
    return this.getBackendAddress() + "/notification/all";
  };

  /**
   * Returns the Notification Count endpoint.
   * @returns The Notification Count Endpoint
   */
  static getNotificationsCountEndpoint = () => {
    return this.getBackendAddress() + "/notification/count";
  };

  // --------------------------------
  // SUBSCRIPTION ENDPOINTS
  // --------------------------------

  /**
   * Returns the Subscribe endpoint.
   * @returns The Subscribe Endpoint
   */
  static addSubscriptionEndpoint = (PodcastId: string) => {
    return this.getBackendAddress() + "/subscription/" + PodcastId + "/subscribe";
  };

  /**
   * Returns the Unsubscribe endpoint.
   * @returns The Unsubscribe Endpoint
   */
  static addUnsubscriptionEndpoint = (PodcastId: string) => {
    return this.getBackendAddress() + "/subscription/" + PodcastId + "/unsubscribe";
  };

  /**
   * Returns the isSubscribed endpoint.
   * @returns The isSubscribed Endpoint
   */
  static getIsSubscribedEndpoint = (PodcastId: string) => {
    return this.getBackendAddress() + "/subscription/" + PodcastId + "/IsSubscribed";
  };

  /**
   * Returns the MySubscriptions endpoint.
   * @returns The MySubscriptions Endpoint
   */
  static getMySubscriptionsEndpoint = () => {
    return this.getBackendAddress() + "/subscription/MySubscriptions";
  };

  /**
   * Returns the Podcast Subscriptions endpoint.
   * @returns The Podcast Subscriptions Endpoint
   */
  static getAllPodcastSubscriptionsEndpoint = (PodcastId: string) => {
    return this.getBackendAddress() + "/subscription/" + PodcastId + "/GetAllPodcastSubscriber";
  };

  // --------------------------------
  // SECTION ENDPOINTS
  // --------------------------------

  /**
   * Returns the Section add endpoint.
   * @returns The Section add Endpoint
   * */
  static getSectionAddEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/section/" + episodeId + "/add";
  };

  /**
   * Returns the Section get endpoint.
   * @returns The Section get Endpoint
   * */
  static getSectionGetEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/section/" + episodeId + "/get";
  };

  /**
   * Returns the Section delete endpoint.
   * @returns The Section delete Endpoint
   * */
  static getSectionDeleteEndpoint = (sectionId: string) => {
    return this.getBackendAddress() + "/section/" + sectionId + "/delete";
  };

  // --------------------------------
  // PLAYLIST ENDPOINTS
  // --------------------------------
  /**
   * Returns the get createPlaylist endpoint.
   * @returns The get createPlaylist Endpoint
   * */
  static getCreatePlaylistEndpoint = () => {
    return this.getBackendAddress() + "/playlist/create";
  };

  /**
   * Returns the get editPlaylist endpoint.
   * @returns The get editPlaylist Endpoint
   * */
  static getEditPlaylistEndpoint = (playlistID: string) => {
    return this.getBackendAddress() + "/playlist/" + playlistID + "/edit";
  };

  /**
   * Returns the get AddToPlaylist endpoint.
   * @returns The get AddToPlaylist Endpoint
   * */
  static getAddToPlaylistEndpoint = (playlistID: string) => {
    return this.getBackendAddress() + "/playlist/" + playlistID + "/add";
  };

  /**
   * Returns the get RemoveFromPlaylist endpoint.
   * @returns The get RemoveFromPlaylist Endpoint
   * */
  static getRemoveFromPlaylistEndpoint = (playlistID: string) => {
    return this.getBackendAddress() + "/playlist/" + playlistID + "/removeEpisodes";
  };

  /**
   * Returns the get DeletePlaylist endpoint.
   * @returns The get DeletePlaylist Endpoint
   * */
  static getDeletePlaylistEndpoint = (playlistID: string) => {
    return this.getBackendAddress() + "/playlist/" + playlistID + "/delete";
  };

  /**
   * Returns the get myPlaylists endpoint.
   * @returns The get myPlaylists Endpoint
   * */
  static getMyPlaylistsEndpoint = (page: number, pageSize: number) => {
    return this.getBackendAddress() + "/playlist/myPlaylists?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the get UserPlaylists endpoint.
   * @returns The get UserPlaylists Endpoint
   * */
  static getUserPlaylistsEndpoint = (userId: string, page: number, pageSize: number) => {
    return this.getBackendAddress() + "/playlist/" + userId + "/getUserPlaylists?page=" + page + "&pageSize=" + pageSize;
  };

  /**
   * Returns the get PlaylistEpsiodes endpoint.
   * @returns The get PlaylistEpsiodes Endpoint
   * */
  static getPlaylistEpisodesEndpoint = (playlistID: string) => {
    return this.getBackendAddress() + "/playlist/" + playlistID;
  };

  /**
   * Returns the get PlaylistEpsiodes endpoint.
   * @returns The get PlaylistEpsiodes Endpoint
   * */
  static getLikedEpisodesPlaylistEndpoint = () => {
    return this.getBackendAddress() + "/playlist/getLikedEpisodesPlaylist";
  };

// --------------------------------
  // TRANSCRIPT ENDPOINTS
  // --------------------------------
    /**
   * Returns the Episode get transcript Endpoint.
   * @returns The Episode get transcript Endpoint
   * */
    static getTranscriptEndpoint = (episodeId) => {
      return (
        this.getBackendAddress() + "/podcast/" + episodeId + "/getTranscript"
      );
    };

     /**
   * Returns the Episode get transcript Endpoint.
   * @returns The Episode get transcript Endpoint
   * */
     static getTranscriptTextEndpoint = (episodeId) => {
      return (
        this.getBackendAddress() + "/podcast/" + episodeId + "/getTranscriptText"
      );
    };

  /**
   * Returns the Episode edit transcript lines endpoint.
   * @returns The Episode edit transcript lines Endpoint
   * */
  static editTranscriptLinesEndpoint = (episodeId) => {
    return (
      this.getBackendAddress() + "/podcast/" + episodeId + "/editTranscriptLines"
    );
  };

  // --------------------------------
  // ANNOTATIONS ENDPOINT
  // --------------------------------

  /**
   * Returns the Episode Annotations endpoint.
   * @returns The Episode Annotations Endpoint
   * */
  static addAnnotationsEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/annotation/" + episodeId + "/createAnnotation";
  };

  static addMediaAnnotationsEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/annotation/" + episodeId + "/createMediaLinkAnnotation";
  };

  static addSponsorAnnotationsEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/annotation/" + episodeId + "/createSponserAnnotation";
  };

  static getAnnotationsEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/annotation/" + episodeId + "/getAnnotation";
  };

  static deleteAnnotationEndpoint = (annotationId: string) => {
    return this.getBackendAddress() + "/annotation/" + annotationId + "/delete";
  };

  // --------------------------------
  // WATCH HISTORY ENDPOINT
  // --------------------------------

  /**
   * Returns the Episode Watch history endpoint.
   * @returns The Episode Watch history Endpoint
   * */
  static saveWatchHistoryEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/podcast/" + episodeId + "/saveWatchHistory";
  };
  static getWatchHistoryEndpoint = (episodeId: string) => {
    return this.getBackendAddress() + "/podcast/" + episodeId + "/watchHistory";
  };

  // --------------------------------
  // METRICS ENDPOINT
  // --------------------------------
  /**
   * Returns the Podcast Metrics endpoint.
   * @returns The Podcast Metrics Endpoint
   * */
  static getMetricsEndpoint = (podcastId: string) => {
    return this.getBackendAddress() + "/podcast/" + podcastId + "/metrics";
  };

  // --------------------------------
  // Chatbot ENDPOINTS
  // --------------------------------
  /**
   * Returns the Chatbot endpoint for a specific episode.
   * @returns The Chatbot Endpoint
   * */
  static getEpisodeChatEndpoint = (episodeId: string, page: number, pageSize: number) => {
    return this.getBackendAddress() + "/podcast/" + episodeId + "/getEpisodeChat?page=" + page + "&pageSize=" + pageSize;
  };

  static getAddEpisodeChatEndpoint = () => {
    return this.getBackendAddress() + "/podcast/addEpisodeChat";
  };


  // --------------------------------
  // Payment Endpoints ENDPOINTS
  // --------------------------------

  static createPaymentEndpoint = (episodeId: string, points :number) => {
    return this.getBackendAddress() + "/social/"+episodeId+"/giftpoints?points="+points;
  }

  static confirmPaymentEndpoint = (pointId : string) => {
    return this.getBackendAddress() + "/social/"+pointId+"/confirmPoints"; 
  }

  static getUserBalanceEndpoint = () =>{
    return this.getBackendAddress()+"/wallet/balance";
  }

  static withdrawBalanceEndpoint = (amount:number) =>{
    return this.getBackendAddress()+"/wallet/withdraw?Amount="+amount;
  }
  static getAllTransactionEndpoint = (page,pageSize) =>{
    return this.getBackendAddress()+"/wallet/transactions?page="+page+"&pageSize="+pageSize;
  }

  static getUserAvatar = (userId:string) =>{
    return this.getBackendAddress()+"/profile/"+userId+"/avatar";
  }
  
  static getLast5DaysBalance = () =>{
    return this.getBackendAddress()+"/wallet/getRecentBalance";
  }

  static getLast5DaysEarning = () =>{
    return this.getBackendAddress()+"/wallet/getRecentEarning";

  }

  static getHighestEarningEpisode =(page,pageSize) =>{
    return this.getBackendAddress() +"/wallet/topEarningEpisodes?page="+page+"&pageSize="+pageSize;
  }
  static getHighestEarningPodcast =(page,pageSize) =>{
    return this.getBackendAddress() +"/wallet/topEarningPodcasts?page="+page+"&pageSize="+pageSize;
  }

 


}




