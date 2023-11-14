using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class xMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserEpisodeInteractions",
                table: "UserEpisodeInteractions");

            migrationBuilder.DropIndex(
                name: "IX_UserEpisodeInteractions_UserId",
                table: "UserEpisodeInteractions");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserEpisodeInteractions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserEpisodeInteractions",
                table: "UserEpisodeInteractions",
                columns: new[] { "UserId", "EpisodeId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserEpisodeInteractions",
                table: "UserEpisodeInteractions");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "UserEpisodeInteractions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserEpisodeInteractions",
                table: "UserEpisodeInteractions",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserEpisodeInteractions_UserId",
                table: "UserEpisodeInteractions",
                column: "UserId");
        }
    }
}
