using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class thirdMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Annotation_Episode_EpisodeId",
                table: "Annotation");

            migrationBuilder.DropForeignKey(
                name: "FK_Annotation_Sponsor_SponsorshipId",
                table: "Annotation");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookmark_Episode_EpisodeId",
                table: "Bookmark");

            migrationBuilder.DropForeignKey(
                name: "FK_Episode_Podcast_PodcastId",
                table: "Episode");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaLink_Annotation_AnnotationId",
                table: "MediaLink");

            migrationBuilder.DropForeignKey(
                name: "FK_Podcast_Users_PodcasterId",
                table: "Podcast");

            migrationBuilder.DropForeignKey(
                name: "FK_Sponsor_Episode_EpisodeId",
                table: "Sponsor");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sponsor",
                table: "Sponsor");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Podcast",
                table: "Podcast");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MediaLink",
                table: "MediaLink");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Episode",
                table: "Episode");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Annotation",
                table: "Annotation");

            migrationBuilder.RenameTable(
                name: "Sponsor",
                newName: "Sponsors");

            migrationBuilder.RenameTable(
                name: "Podcast",
                newName: "Podcasts");

            migrationBuilder.RenameTable(
                name: "MediaLink",
                newName: "MediaLinks");

            migrationBuilder.RenameTable(
                name: "Episode",
                newName: "Episodes");

            migrationBuilder.RenameTable(
                name: "Annotation",
                newName: "Annotations");

            migrationBuilder.RenameIndex(
                name: "IX_Sponsor_EpisodeId",
                table: "Sponsors",
                newName: "IX_Sponsors_EpisodeId");

            migrationBuilder.RenameIndex(
                name: "IX_Podcast_PodcasterId",
                table: "Podcasts",
                newName: "IX_Podcasts_PodcasterId");

            migrationBuilder.RenameIndex(
                name: "IX_MediaLink_AnnotationId",
                table: "MediaLinks",
                newName: "IX_MediaLinks_AnnotationId");

            migrationBuilder.RenameIndex(
                name: "IX_Episode_PodcastId",
                table: "Episodes",
                newName: "IX_Episodes_PodcastId");

            migrationBuilder.RenameIndex(
                name: "IX_Annotation_SponsorshipId",
                table: "Annotations",
                newName: "IX_Annotations_SponsorshipId");

            migrationBuilder.RenameIndex(
                name: "IX_Annotation_EpisodeId",
                table: "Annotations",
                newName: "IX_Annotations_EpisodeId");

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Website",
                table: "Sponsors",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<Guid>(
                name: "CoverId",
                table: "Podcasts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Podcasts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Podcasts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sponsors",
                table: "Sponsors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Podcasts",
                table: "Podcasts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MediaLinks",
                table: "MediaLinks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Episodes",
                table: "Episodes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Annotations",
                table: "Annotations",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "File",
                columns: table => new
                {
                    FileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MimeType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Data = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_File", x => x.FileId);
                });

            migrationBuilder.CreateTable(
                name: "PodcastFollows",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PodcastId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PodcastFollows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PodcastFollows_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PodcastRatings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PodcastId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Rating = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PodcastRatings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PodcastRatings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subscriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subscriptions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserEpisodeInteractions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EpisodeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HasListened = table.Column<bool>(type: "bit", nullable: false),
                    HasLiked = table.Column<bool>(type: "bit", nullable: false),
                    LastListenPosition = table.Column<double>(type: "float", nullable: false),
                    DateListened = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEpisodeInteractions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserEpisodeInteractions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFollows",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FollowerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FollowingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFollows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserFollows_Users_FollowerId",
                        column: x => x.FollowerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Podcasts_CoverId",
                table: "Podcasts",
                column: "CoverId");

            migrationBuilder.CreateIndex(
                name: "IX_PodcastFollows_UserId",
                table: "PodcastFollows",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PodcastRatings_UserId",
                table: "PodcastRatings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_UserId",
                table: "Subscriptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserEpisodeInteractions_UserId",
                table: "UserEpisodeInteractions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFollows_FollowerId",
                table: "UserFollows",
                column: "FollowerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Annotations_Episodes_EpisodeId",
                table: "Annotations",
                column: "EpisodeId",
                principalTable: "Episodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Annotations_Sponsors_SponsorshipId",
                table: "Annotations",
                column: "SponsorshipId",
                principalTable: "Sponsors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookmark_Episodes_EpisodeId",
                table: "Bookmark",
                column: "EpisodeId",
                principalTable: "Episodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Podcasts_PodcastId",
                table: "Episodes",
                column: "PodcastId",
                principalTable: "Podcasts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaLinks_Annotations_AnnotationId",
                table: "MediaLinks",
                column: "AnnotationId",
                principalTable: "Annotations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Podcasts_File_CoverId",
                table: "Podcasts",
                column: "CoverId",
                principalTable: "File",
                principalColumn: "FileId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Podcasts_Users_PodcasterId",
                table: "Podcasts",
                column: "PodcasterId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sponsors_Episodes_EpisodeId",
                table: "Sponsors",
                column: "EpisodeId",
                principalTable: "Episodes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Annotations_Episodes_EpisodeId",
                table: "Annotations");

            migrationBuilder.DropForeignKey(
                name: "FK_Annotations_Sponsors_SponsorshipId",
                table: "Annotations");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookmark_Episodes_EpisodeId",
                table: "Bookmark");

            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Podcasts_PodcastId",
                table: "Episodes");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaLinks_Annotations_AnnotationId",
                table: "MediaLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_Podcasts_File_CoverId",
                table: "Podcasts");

            migrationBuilder.DropForeignKey(
                name: "FK_Podcasts_Users_PodcasterId",
                table: "Podcasts");

            migrationBuilder.DropForeignKey(
                name: "FK_Sponsors_Episodes_EpisodeId",
                table: "Sponsors");

            migrationBuilder.DropTable(
                name: "File");

            migrationBuilder.DropTable(
                name: "PodcastFollows");

            migrationBuilder.DropTable(
                name: "PodcastRatings");

            migrationBuilder.DropTable(
                name: "Subscriptions");

            migrationBuilder.DropTable(
                name: "UserEpisodeInteractions");

            migrationBuilder.DropTable(
                name: "UserFollows");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sponsors",
                table: "Sponsors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Podcasts",
                table: "Podcasts");

            migrationBuilder.DropIndex(
                name: "IX_Podcasts_CoverId",
                table: "Podcasts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MediaLinks",
                table: "MediaLinks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Episodes",
                table: "Episodes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Annotations",
                table: "Annotations");

            migrationBuilder.DropColumn(
                name: "CoverId",
                table: "Podcasts");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Podcasts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Podcasts");

            migrationBuilder.RenameTable(
                name: "Sponsors",
                newName: "Sponsor");

            migrationBuilder.RenameTable(
                name: "Podcasts",
                newName: "Podcast");

            migrationBuilder.RenameTable(
                name: "MediaLinks",
                newName: "MediaLink");

            migrationBuilder.RenameTable(
                name: "Episodes",
                newName: "Episode");

            migrationBuilder.RenameTable(
                name: "Annotations",
                newName: "Annotation");

            migrationBuilder.RenameIndex(
                name: "IX_Sponsors_EpisodeId",
                table: "Sponsor",
                newName: "IX_Sponsor_EpisodeId");

            migrationBuilder.RenameIndex(
                name: "IX_Podcasts_PodcasterId",
                table: "Podcast",
                newName: "IX_Podcast_PodcasterId");

            migrationBuilder.RenameIndex(
                name: "IX_MediaLinks_AnnotationId",
                table: "MediaLink",
                newName: "IX_MediaLink_AnnotationId");

            migrationBuilder.RenameIndex(
                name: "IX_Episodes_PodcastId",
                table: "Episode",
                newName: "IX_Episode_PodcastId");

            migrationBuilder.RenameIndex(
                name: "IX_Annotations_SponsorshipId",
                table: "Annotation",
                newName: "IX_Annotation_SponsorshipId");

            migrationBuilder.RenameIndex(
                name: "IX_Annotations_EpisodeId",
                table: "Annotation",
                newName: "IX_Annotation_EpisodeId");

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Website",
                table: "Sponsor",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sponsor",
                table: "Sponsor",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Podcast",
                table: "Podcast",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MediaLink",
                table: "MediaLink",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Episode",
                table: "Episode",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Annotation",
                table: "Annotation",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Annotation_Episode_EpisodeId",
                table: "Annotation",
                column: "EpisodeId",
                principalTable: "Episode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Annotation_Sponsor_SponsorshipId",
                table: "Annotation",
                column: "SponsorshipId",
                principalTable: "Sponsor",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookmark_Episode_EpisodeId",
                table: "Bookmark",
                column: "EpisodeId",
                principalTable: "Episode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Episode_Podcast_PodcastId",
                table: "Episode",
                column: "PodcastId",
                principalTable: "Podcast",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaLink_Annotation_AnnotationId",
                table: "MediaLink",
                column: "AnnotationId",
                principalTable: "Annotation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Podcast_Users_PodcasterId",
                table: "Podcast",
                column: "PodcasterId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sponsor_Episode_EpisodeId",
                table: "Sponsor",
                column: "EpisodeId",
                principalTable: "Episode",
                principalColumn: "Id");
        }
    }
}
