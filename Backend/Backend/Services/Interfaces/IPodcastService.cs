﻿using Backend.Controllers.Requests;
using Backend.Controllers.Responses;
using Backend.Models;
using Microsoft.Extensions.FileProviders.Physical;

namespace Backend.Services.Interfaces;
public interface IPodcastService
{
    // PODCASTS
    public Task<bool> CreatePodcastAsync(CreatePodcastRequest request, User user);
    public Task<bool> EditPodcastAsync(EditPodcastRequest request, User user);
    public Task<bool> DeletePodcastAsync(Guid podcastId, User user);
    public Task<string> GetPodcastCoverArtNameAsync(Guid podcastId);
    public Task<List<PodcastResponse>> GetAllPodcastsAsync(int page, int pageSize, string domainUrl);
    public Task<PodcastResponse> GetPodcastByIdAsync(string domainUrl, Guid podcastId);
    public Task<List<PodcastResponse>> GetUserPodcastsAsync(int page, int pageSize, string domainUrl, User user);
    public Task<List<PodcastResponse>> GetUserPodcastsAsync(int page, int pageSize, string domainUrl, Guid userId);
    public Task<List<PodcastResponse>> GetSearchPodcastsAsync(int page, int pageSize, string domainUrl, PodcastFilter filter);
    public Task<List<PodcastResponse>> GetPodcastsByTagsAsync(int page, int pageSize, string domainUrl, string[] tags);
    public Task<List<PodcastResponse>> GetRecentPodcasts(int page, int pageSize, string domainUrl);
    public Task<List<adminRecommendationResponse>> GetDailyAdminRecomendationsAsync(string domainUrl);



    // EPISODES
    public Task<Guid> CreateEpisodeAsync(CreateEpisodeRequest request, Guid podcastId, User user);
    public Task<bool> EditEpisodeAsync(EditEpisodeRequest request, Guid podcastId, User user);
    public Task<bool> AddEpisodeAudioAsync(AddEpisodeAudioRequest request, Guid episodeId, User user);
    public Task<bool> DeleteEpisodeAsync(Guid episodeId, User user);
    public Task<EpisodeResponse> GetEpisodeByIdAsync(Guid episodeId, string domainUrl);
    public Task<string> GetEpisodeAudioNameAsync(Guid episodeId);
    public Task<string> GetEpisodeThumbnailNameAsync(Guid episodeId);
    public Task<bool> SaveWatchHistory(User user, Guid episodeId, double listenPosition);
    public Task<ListenPositionResponse> GetWatchHistory(User user, Guid episodeId);
    public Task<AdjecentEpisodeResponse> GetAdjecentEpisodeAsync(Guid episodeId);
    public Task<PodcastMetricsResponse> GetMetrics(User user, Guid podcastId, string domainUrl);
    public Task<List<EpisodeResponse>> SearchEpisodeAsync(int page, int pageSize,EpisodeFilter episodeFilter,string domainUrl);
    public Task<List<EpisodeResponse>> GetRecentEpisodes(int page, int pageSize, string domainUrl);
    public Task<List<History>> GetUserWatchHistory (int page,int pageSize,User user);
    public Task<bool> DeleteWatchHistory(User user,Guid episodeId);
    public Task<bool> DeleteAllWatchHistory(User user);

    // AI GENERATED EPISODES
    public Task<bool> GenerateAIEpisodeAsync(GenerateAIEpisodeRequest request, Guid podcastId, User user, string domainUrl);
    public Task<bool> GenerateAIEpisodeFromTextAsync(GenerateAIEpisodeFromTextRequest request, Guid podcastId, User user, string domainUrl);


    // TRANSCRIPT
    public Task<EpisodeTranscriptResponse> GetEpisodeTranscriptAsync(Guid episodeId, float? seekTime, bool includeWords);
    public Task<EpisodeTranscriptTextResponse> GetEpisodeTranscriptTextAsync(Guid episodeId);
    public Task<bool> EditEpisodeTranscriptLinesAsync(User user,Guid episodeId, TranscriptLineResponse[] lines);
    public Task<bool> GenerateEpisodeTranscriptAsync(Guid episodeId, User user);


    // EPISODE CHAT
    public Task<EpisodeChatResponse> GetEpisodeChatAsync(int page, int pageSize, Guid episodeId, User user, string domainUrl);
    public Task<EpisodeChatMessageResponse> PromptEpisodeChatAsync(Guid episodeId, User user, string prompt, string domainUrl);

    
    // Recommendation
    public Task<List<EpisodeResponse>> GetRecommendedEpisodes(User user,string domainUrl);
    public Task<List<Guid>> GetRecommendedPodcast(User? user, int page, int pageSize);


    // HIGHLIGHT
    public Task<HighlightResponse> CreateHighlightAsync(HighlightRequest request, Guid episodeId, User user);
    public Task<bool> EditHighlightAsync(EditHighlightRequest request, Guid highlightId, User user);
    public Task<bool> RemoveHighlightAsync(Guid highlightId, User user);
    public Task<List<HighlightResponse>> GetAllUserHighlightsAsync(Guid userId);
    public Task<List<HighlightResponse>> GetAllEpisodeHighlightsAsync(Guid episodeId);
    public Task<Dictionary<string, string>> GetHighlightAudioAysnc(Guid highlightId);
    public Task<List<HighlightResponse>> GetRandomHighlightsAsync(int quantity);
    public Task<List<HighlightResponse>> GetRecommendedHighlightsAsync(User user, string domainUrl, int amount);
}