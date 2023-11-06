using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class fifthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_File_AudioFileId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_AudioFileId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "AudioFileId",
                table: "Episodes");

            migrationBuilder.AddColumn<string>(
                name: "Audio",
                table: "Episodes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Episodes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Audio",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Episodes");

            migrationBuilder.AddColumn<Guid>(
                name: "AudioFileId",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_AudioFileId",
                table: "Episodes",
                column: "AudioFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_File_AudioFileId",
                table: "Episodes",
                column: "AudioFileId",
                principalTable: "File",
                principalColumn: "FileId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
