using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class sixthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_File_AudioFileFileId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_AudioFileFileId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "AudioFileFileId",
                table: "Episodes");

            migrationBuilder.RenameColumn(
                name: "FileId",
                table: "Episodes",
                newName: "AudioFileId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_File_AudioFileId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_AudioFileId",
                table: "Episodes");

            migrationBuilder.RenameColumn(
                name: "AudioFileId",
                table: "Episodes",
                newName: "FileId");

            migrationBuilder.AddColumn<Guid>(
                name: "AudioFileFileId",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_AudioFileFileId",
                table: "Episodes",
                column: "AudioFileFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_File_AudioFileFileId",
                table: "Episodes",
                column: "AudioFileFileId",
                principalTable: "File",
                principalColumn: "FileId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
