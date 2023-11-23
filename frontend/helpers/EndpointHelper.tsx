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
  static getPodcastMyPodcastsEndpoint = () => {
    return this.getBackendAddress() + "/podcast/myPodcasts";
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
  static getSearchPodcastEndpoint = (searchTerm, page, pageSize) => {
    return (
      this.getBackendAddress() +
      "/podcast/search?searchterm=" +
      searchTerm +
      "&page=" +
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

  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   * */

  static getPodcastRatingEndpoint = () => {
    return this.getBackendAddress() + "/social/rating";
  };
  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   * */

  static getPodcastRatingDeleteEndpoint = (podcastId) => {
    return (
      this.getBackendAddress() + "/social/deleteRating?podcastId=" + podcastId
    );
  };
  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   * */

  static getPodcastReviewEndpoint = () => {
    return this.getBackendAddress() + "/social/review";
  };
  /**
   * Returns the Podcast rating endpoint.
   * @returns The Podcast rating Endpoint
   * */

  static getPodcastReviewDeleteEndpoint = (podcastId) => {
    return (
      this.getBackendAddress() + "/social/deleteReview?podcastId=" + podcastId
    );
  };

  /**
   * Returns the Podcast COMMENTS + LIKES endpoint.
   * @returns The Podcast COMMENTS + LIKES Endpoint
   * */
  static getCommentEndpoint = (episodeOrCommentId: string) => {
    return (
      this.getBackendAddress() + "/social/" + episodeOrCommentId + "/comment"
    );
  };

  static getCommentDeleteEndpoint = (commentId) => {
    return this.getBackendAddress() + "/social/" + commentId + "/deleteComment";
  };

  static getLikeEndpoint = (episodeOrCommentId) => {
    return this.getBackendAddress() + "/social/" + episodeOrCommentId + "/like";
  };

  static getUnlikeEndpoint = (episodeOrCommentId) => {
    return (
      this.getBackendAddress() + "/social/" + episodeOrCommentId + "/unLike"
    );
  };

  static getPodcastEpisodePlayEndpoint = (
    podcastId: string,
    episodeId: string,
  ) => {
    return `${this.getBackendAddress()}/podcast/${podcastId}/${episodeId}/getAudio`;
  };

  static profileGetRequest: any;
}
