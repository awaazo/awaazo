﻿// <auto-generated />
using System;
using Backend.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20240207221707_XMigration1")]
    partial class XMigration1
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.Annotation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<double>("Timestamp")
                        .HasColumnType("float");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("EpisodeId");

                    b.ToTable("Annotations");
                });

            modelBuilder.Entity("Backend.Models.Bookmark", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Note")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Time")
                        .HasColumnType("float");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("EpisodeId");

                    b.HasIndex("UserId");

                    b.ToTable("Bookmarks");
                });

            modelBuilder.Entity("Backend.Models.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("EpisodeId");

                    b.HasIndex("UserId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("Backend.Models.CommentLike", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CommentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("UserId", "CommentId");

                    b.HasIndex("CommentId");

                    b.ToTable("CommentLikes");
                });

            modelBuilder.Entity("Backend.Models.CommentReply", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("ReplyToCommentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("ReplyToCommentId");

                    b.HasIndex("UserId");

                    b.ToTable("CommentReplies");
                });

            modelBuilder.Entity("Backend.Models.CommentReplyLike", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CommentReplyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("UserId", "CommentReplyId");

                    b.HasIndex("CommentReplyId");

                    b.ToTable("CommentReplyLikes");
                });

            modelBuilder.Entity("Backend.Models.Episode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Audio")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Duration")
                        .HasColumnType("float");

                    b.Property<string>("EpisodeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsExplicit")
                        .HasColumnType("bit");

                    b.Property<decimal>("PlayCount")
                        .HasColumnType("decimal(20,0)");

                    b.Property<Guid>("PodcastId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Thumbnail")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("PodcastId");

                    b.ToTable("Episodes");
                });

            modelBuilder.Entity("Backend.Models.EpisodeChatMessage", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("IsPrompt")
                        .HasColumnType("bit");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("EpisodeChatMessages");
                });

            modelBuilder.Entity("Backend.Models.EpisodeLike", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("UserId", "EpisodeId");

                    b.HasIndex("EpisodeId");

                    b.ToTable("EpisodeLikes");
                });

            modelBuilder.Entity("Backend.Models.EpisodeSections", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<double>("End")
                        .HasColumnType("float");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<double>("Start")
                        .HasColumnType("float");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("EpisodeId");

                    b.ToTable("EpisodeSections");
                });

            modelBuilder.Entity("Backend.Models.ForgetPasswordToken", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("ForgetPasswordTokens");
                });

            modelBuilder.Entity("Backend.Models.MediaLink", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AnnotationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("Platform")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AnnotationId")
                        .IsUnique();

                    b.ToTable("MediaLinks");
                });

            modelBuilder.Entity("Backend.Models.Notification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");

                    b.Property<string>("Link")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Media")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("Backend.Models.Playlist", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("CoverArt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsHandledByUser")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Privacy")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Playlists");
                });

            modelBuilder.Entity("Backend.Models.PlaylistEpisode", b =>
                {
                    b.Property<Guid>("PlaylistId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("PlaylistId", "EpisodeId");

                    b.HasIndex("EpisodeId");

                    b.ToTable("PlaylistEpisodes");
                });

            modelBuilder.Entity("Backend.Models.Podcast", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<float>("AverageRating")
                        .HasColumnType("real");

                    b.Property<string>("CoverArt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsExplicit")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("PodcasterId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Tags")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("TotalRatings")
                        .HasColumnType("decimal(20,0)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("PodcasterId");

                    b.ToTable("Podcasts");
                });

            modelBuilder.Entity("Backend.Models.PodcastFollow", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("PodcastId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("PodcastFollows");
                });

            modelBuilder.Entity("Backend.Models.PodcastRating", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("PodcastId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<long>("Rating")
                        .HasColumnType("bigint");

                    b.Property<string>("Review")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("PodcastId");

                    b.HasIndex("UserId");

                    b.ToTable("PodcastRatings");
                });

            modelBuilder.Entity("Backend.Models.Sponsor", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AnnotationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid?>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Website")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AnnotationId")
                        .IsUnique();

                    b.HasIndex("EpisodeId");

                    b.ToTable("Sponsors");
                });

            modelBuilder.Entity("Backend.Models.Subscription", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Subscriptions");
                });

            modelBuilder.Entity("Backend.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Bio")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<string>("GitHubUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Interests")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsPodcaster")
                        .HasColumnType("bit");

                    b.Property<string>("LinkedInUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TwitterUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("WebsiteUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Backend.Models.UserEpisodeInteraction", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("EpisodeId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateListened")
                        .HasColumnType("datetime2");

                    b.Property<bool>("HasLiked")
                        .HasColumnType("bit");

                    b.Property<bool>("HasListened")
                        .HasColumnType("bit");

                    b.Property<double>("LastListenPosition")
                        .HasColumnType("float");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("UserId", "EpisodeId");

                    b.HasIndex("EpisodeId");

                    b.ToTable("UserEpisodeInteractions");
                });

            modelBuilder.Entity("Backend.Models.UserFollow", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("FollowerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("FollowingId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("FollowerId");

                    b.ToTable("UserFollows");
                });

            modelBuilder.Entity("Backend.Models.Annotation", b =>
                {
                    b.HasOne("Backend.Models.Episode", "Episode")
                        .WithMany("Annotations")
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Episode");
                });

            modelBuilder.Entity("Backend.Models.Bookmark", b =>
                {
                    b.HasOne("Backend.Models.Episode", "Episode")
                        .WithMany("Bookmarks")
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("Bookmarks")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.Navigation("Episode");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.Comment", b =>
                {
                    b.HasOne("Backend.Models.Episode", "Episode")
                        .WithMany("Comments")
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("Comments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Episode");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.CommentLike", b =>
                {
                    b.HasOne("Backend.Models.Comment", "Comment")
                        .WithMany("Likes")
                        .HasForeignKey("CommentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Comment");
                });

            modelBuilder.Entity("Backend.Models.CommentReply", b =>
                {
                    b.HasOne("Backend.Models.Comment", "ReplyToComment")
                        .WithMany("Comments")
                        .HasForeignKey("ReplyToCommentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("CommentReplies")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("ReplyToComment");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.CommentReplyLike", b =>
                {
                    b.HasOne("Backend.Models.CommentReply", "CommentReply")
                        .WithMany("Likes")
                        .HasForeignKey("CommentReplyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CommentReply");
                });

            modelBuilder.Entity("Backend.Models.Episode", b =>
                {
                    b.HasOne("Backend.Models.Podcast", "Podcast")
                        .WithMany("Episodes")
                        .HasForeignKey("PodcastId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Podcast");
                });

            modelBuilder.Entity("Backend.Models.EpisodeLike", b =>
                {
                    b.HasOne("Backend.Models.Episode", "Episode")
                        .WithMany("Likes")
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Episode");
                });

            modelBuilder.Entity("Backend.Models.EpisodeSections", b =>
                {
                    b.HasOne("Backend.Models.Episode", "Episode")
                        .WithMany("episodeSections")
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Episode");
                });

            modelBuilder.Entity("Backend.Models.MediaLink", b =>
                {
                    b.HasOne("Backend.Models.Annotation", "Annotation")
                        .WithOne("MediaLink")
                        .HasForeignKey("Backend.Models.MediaLink", "AnnotationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Annotation");
                });

            modelBuilder.Entity("Backend.Models.Notification", b =>
                {
                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("Notifications")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.Playlist", b =>
                {
                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("Playlists")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.PlaylistEpisode", b =>
                {
                    b.HasOne("Backend.Models.Episode", "Episode")
                        .WithMany("PlaylistEpisodes")
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Playlist", "Playlist")
                        .WithMany("PlaylistEpisodes")
                        .HasForeignKey("PlaylistId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.Navigation("Episode");

                    b.Navigation("Playlist");
                });

            modelBuilder.Entity("Backend.Models.Podcast", b =>
                {
                    b.HasOne("Backend.Models.User", "Podcaster")
                        .WithMany("Podcasts")
                        .HasForeignKey("PodcasterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Podcaster");
                });

            modelBuilder.Entity("Backend.Models.PodcastFollow", b =>
                {
                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("PodcastFollows")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.PodcastRating", b =>
                {
                    b.HasOne("Backend.Models.Podcast", "Podcast")
                        .WithMany("Ratings")
                        .HasForeignKey("PodcastId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("Ratings")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Podcast");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.Sponsor", b =>
                {
                    b.HasOne("Backend.Models.Annotation", "Annotation")
                        .WithOne("Sponsorship")
                        .HasForeignKey("Backend.Models.Sponsor", "AnnotationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Episode", null)
                        .WithMany("Sponsors")
                        .HasForeignKey("EpisodeId");

                    b.Navigation("Annotation");
                });

            modelBuilder.Entity("Backend.Models.Subscription", b =>
                {
                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("Subscriptions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.UserEpisodeInteraction", b =>
                {
                    b.HasOne("Backend.Models.Episode", "Episode")
                        .WithMany()
                        .HasForeignKey("EpisodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany("EpisodeInteractions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.Navigation("Episode");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.UserFollow", b =>
                {
                    b.HasOne("Backend.Models.User", "Follower")
                        .WithMany("UserFollows")
                        .HasForeignKey("FollowerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Follower");
                });

            modelBuilder.Entity("Backend.Models.Annotation", b =>
                {
                    b.Navigation("MediaLink");

                    b.Navigation("Sponsorship");
                });

            modelBuilder.Entity("Backend.Models.Comment", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Likes");
                });

            modelBuilder.Entity("Backend.Models.CommentReply", b =>
                {
                    b.Navigation("Likes");
                });

            modelBuilder.Entity("Backend.Models.Episode", b =>
                {
                    b.Navigation("Annotations");

                    b.Navigation("Bookmarks");

                    b.Navigation("Comments");

                    b.Navigation("Likes");

                    b.Navigation("PlaylistEpisodes");

                    b.Navigation("Sponsors");

                    b.Navigation("episodeSections");
                });

            modelBuilder.Entity("Backend.Models.Playlist", b =>
                {
                    b.Navigation("PlaylistEpisodes");
                });

            modelBuilder.Entity("Backend.Models.Podcast", b =>
                {
                    b.Navigation("Episodes");

                    b.Navigation("Ratings");
                });

            modelBuilder.Entity("Backend.Models.User", b =>
                {
                    b.Navigation("Bookmarks");

                    b.Navigation("CommentReplies");

                    b.Navigation("Comments");

                    b.Navigation("EpisodeInteractions");

                    b.Navigation("Notifications");

                    b.Navigation("Playlists");

                    b.Navigation("PodcastFollows");

                    b.Navigation("Podcasts");

                    b.Navigation("Ratings");

                    b.Navigation("Subscriptions");

                    b.Navigation("UserFollows");
                });
#pragma warning restore 612, 618
        }
    }
}
