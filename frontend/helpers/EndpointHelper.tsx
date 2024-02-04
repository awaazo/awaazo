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
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    )
      return process.env.NEXT_PUBLIC_BASE_URL;
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
    return this.getBackendAddress() + "/auth/googleSSO";
  };

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
  static getProfileByIdEndpoint = (userId) => {
    return this.getBackendAddress() + "/profile/" + userId + "/get";
  };

  /**
   * Returns the Profile search endpoint.
   * @returns The Profile search Endpoint
   */
  static getProfileSearchEndpoint = (searchTerm, page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/profile/search?searchterm=" +
      searchTerm +
      "&page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  static getChangePasswordEndpoint = () => {
    return this.getBackendAddress() + "/profile/changePassword";
  };

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
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getPodcastMyPodcastsEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/myPodcasts?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcast all podcasts endpoint.
   * @returns The Podcast all podcasts Endpoint
   */
  static getPodcastAllPodcastsEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/all?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getEpisodeAddEndpoint = (podcastId) => {
    return this.getBackendAddress() + "/podcast/" + podcastId + "/add";
  };

  /**
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getPodcastEndpoint = (podcastId) => {
    return this.getBackendAddress() + "/podcast/" + podcastId;
  };

  /**
   * Returns the Podcast myPodcasts endpoint.
   * @returns The Podcast myPodcasts Endpoint
   */
  static getPodcastByUserIdEndpoint = (userId, page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/userPodcasts?userId=" +
      userId +
      "&page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcasts by tags endpoint.
   * @returns The Podcasts by tags Endpoint
   */
  static getByTagsPodcastEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/byTags?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcast search endpoint.
   * @returns The Podcast search Endpoint
   */
  static getSearchPodcastEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/search?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcast search endpoint.
   * @returns The Podcast search Endpoint
   */
  static getSearchEpisodeEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/episode/search?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the Podcast delete endpoint.
   * @returns The Podcast delete Endpoint
   */
  static getPodcastDeleteEndpoint = (podcastId) => {
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
  static getPodcastEpisodeDeleteEndpoint = (episodeId) => {
    return this.getBackendAddress() + "/podcast/" + episodeId + "/delete";
  };

  /**
   * Returns the Episode by id endpoint.
   * @returns The Episode by id Endpoint
   */
  static getPodcastEpisodeByIdEndpoint = (episodeId) => {
    return this.getBackendAddress() + "/podcast/episode/" + episodeId;
  };
  /**
   * Returns the Episode edit endpoint.
   * @returns The Episode edit Endpoint
   */
  static getPodcastEpisodeEditEndpoint = (episodeId) => {
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

  static getPodcastRatingDeleteEndpoint = (podcastId) => {
    return (
      this.getBackendAddress() + "/social/deleteRating?podcastId=" + podcastId
    );
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

  static getPodcastReviewDeleteEndpoint = (podcastId) => {
    return (
      this.getBackendAddress() + "/social/deleteReview?podcastId=" + podcastId
    );
  };

  /**
   * Returns the Podcast COMMENTS + LIKES endpoint.
   * @returns The Podcast COMMENTS + LIKES Endpoint
   */
  static getCommentEndpoint = (episodeOrCommentId: string) => {
    return (
      this.getBackendAddress() + "/social/" + episodeOrCommentId + "/comment"
    );
  };

  /**
   * Returns the Podcast COMMENTS Delete endpoint.
   * @returns The Podcast COMMENTS Delete Endpoint
   */
  static getCommentDeleteEndpoint = (commentId) => {
    return this.getBackendAddress() + "/social/" + commentId + "/delete";
  };

  /**
   * Returns the Podcast like endpoint.
   * @returns The Podcast like Endpoint
   */
  static getLikeEndpoint = (episodeOrCommentId) => {
    return this.getBackendAddress() + "/social/" + episodeOrCommentId + "/like";
  };

  /**
   * Returns the Podcast unlike endpoint.
   * @returns The Podcast unlike Endpoint
   */
  static getUnlikeEndpoint = (episodeOrCommentId) => {
    return (
      this.getBackendAddress() + "/social/" + episodeOrCommentId + "/unLike"
    );
  };

  /**
   * Returns the Podcast isLiked endpoint.
   * @returns The Podcast isLiked Endpoint
   */
  static getIsLikedEndpoint = (episodeOrCommentId) => {
    return (
      this.getBackendAddress() + "/social/" + episodeOrCommentId + "/isLiked"
    );
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
  static getBookmarksEndpoint = (episodeId) => {
    return (
      this.getBackendAddress() + "/bookmark/" + episodeId + "/allBookmarks"
    );
  };

  /**
   * Returns the Episode Add Bookmark endpoint.
   * @returns The Episode Add Bookmark Endpoint
   * */

  static getBookmarkAddEndpoint = (episodeId) => {
    return this.getBackendAddress() + "/bookmark/" + episodeId + "/add";
  };

  /**
   * Returns the Episode Delete Bookmark endpoint.
   * @returns The Episode Delete Bookmark Endpoint
   * */
  static getBookmarkDeleteEndpoint = (bookmarkId) => {
    return this.getBackendAddress() + "/bookmark/" + bookmarkId + "/delete";
  };

  static getPodcastEpisodePlayEndpoint = (
    podcastId: string,
    episodeId: string,
  ) => {
    return `${this.getBackendAddress()}/podcast/${podcastId}/${episodeId}/getAudio`;
  };

  // --------------------------------
  // NOTIFICATION ENDPOINTS
  // --------------------------------
  /**
   * Returns the Notification endpoint.
   * @returns The Notification Endpoint
   */
  static getRangeNotificationsEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/notification/all?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
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
  static addSubscriptionEndpoint = (PodcastId) => {
    return (
      this.getBackendAddress() + "/subscription/" + PodcastId + "/subscribe"
    );
  };

  /**
   * Returns the Unsubscribe endpoint.
   * @returns The Unsubscribe Endpoint
   */
  static addUnsubscriptionEndpoint = (PodcastId) => {
    return (
      this.getBackendAddress() + "/subscription/" + PodcastId + "/unsubscribe"
    );
  };

  /**
   * Returns the isSubscribed endpoint.
   * @returns The isSubscribed Endpoint
   */
  static getIsSubscribedEndpoint = (PodcastId) => {
    return (
      this.getBackendAddress() + "/subscription/" + PodcastId + "/IsSubscribed"
    );
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
  static getAllPodcastSubscriptionsEndpoint = (PodcastId) => {
    return (
      this.getBackendAddress() +
      "/subscription/" +
      PodcastId +
      "/GetAllPodcastSubscriber"
    );
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
  static getEditPlaylistEndpoint = (playlistID) => {
    return this.getBackendAddress() + "/playlist/" + playlistID + "/edit";
  };

  /**
   * Returns the get AddToPlaylist endpoint.
   * @returns The get AddToPlaylist Endpoint
   * */
  static getAddToPlaylistEndpoint = (playlistID) => {
    return this.getBackendAddress() + "/playlist/" + playlistID + "/add";
  };

  /**
   * Returns the get RemoveFromPlaylist endpoint.
   * @returns The get RemoveFromPlaylist Endpoint
   * */
  static getRemoveFromPlaylistEndpoint = (playlistID) => {
    return (
      this.getBackendAddress() + "/playlist/" + playlistID + "/removeEpisodes"
    );
  };

  /**
   * Returns the get DeletePlaylist endpoint.
   * @returns The get DeletePlaylist Endpoint
   * */
  static getDeletePlaylistEndpoint = (playlistID) => {
    return this.getBackendAddress() + "/playlist/" + playlistID + "/delete";
  };

  /**
   * Returns the get myPlaylists endpoint.
   * @returns The get myPlaylists Endpoint
   * */
  static getMyPlaylistsEndpoint = (page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/playlist/myPlaylists?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the get UserPlaylists endpoint.
   * @returns The get UserPlaylists Endpoint
   * */
  static getUserPlaylistsEndpoint = (userId, page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/playlist/" +
      userId +
      "/getUserPlaylists?page=" +
      page +
      "&pageSize=" +
      pageSize
    );
  };

  /**
   * Returns the get PlaylistEpsiodes endpoint.
   * @returns The get PlaylistEpsiodes Endpoint
   * */
  static getPlaylistEpisodesEndpoint = (playlistID) => {
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
  static addAnnotationsEndpoint = (episodeId) => {
    return (
      this.getBackendAddress() +
      "/annotation/" +
      episodeId +
      "/createAnnotation"
    );
  };

  static addMediaAnnotationsEndpoint = (episodeId) => {
    return (
      this.getBackendAddress() +
      "/annotation/" +
      episodeId +
      "/createMediaLinkAnnotation"
    );
  };

  static addSponsorAnnotationsEndpoint = (episodeId) => {
    return (
      this.getBackendAddress() +
      "/annotation/" +
      episodeId +
      "/createSponserAnnotation"
    );
  };

  static getAnnotationsEndpoint = (episodeId) => {
    return (
      this.getBackendAddress() + "/annotation/" + episodeId + "/getAnnotation"
    );
  };

  static deleteAnnotationEndpoint = (annotationId) => {
    return this.getBackendAddress() + "/annotation/" + annotationId + "/delete";
  };

  // --------------------------------
  // WATCH HISTORY ENDPOINT
  // --------------------------------

  /**
   * Returns the Episode Watch history endpoint.
   * @returns The Episode Watch history Endpoint
   * */
  static saveWatchHistoryEndpoint = (episodeId) => {
    return (
      this.getBackendAddress() + "/podcast/" + episodeId + "/saveWatchHistory"
    );
  };
  static getWatchHistoryEndpoint = (episodeId) => {
    return this.getBackendAddress() + "/podcast/" + episodeId + "/watchHistory";
  };

  // --------------------------------
  // METRICS ENDPOINT
  // --------------------------------
  /**
   * Returns the Podcast Metrics endpoint.
   * @returns The Podcast Metrics Endpoint
   * */
  static getMetricsEndpoint = (podcastId) => {
    return this.getBackendAddress() + "/podcast/" + podcastId + "/metrics";
  };
}
