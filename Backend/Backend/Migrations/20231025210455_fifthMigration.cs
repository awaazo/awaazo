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
            migrationBuilder.DropColumn(
                name: "Data",
                table: "File");

            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "File",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AudioFileFileId",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "FileId",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_File_AudioFileFileId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_AudioFileFileId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "Path",
                table: "File");

            migrationBuilder.DropColumn(
                name: "AudioFileFileId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "FileId",
                table: "Episodes");

            migrationBuilder.AddColumn<byte[]>(
                name: "Data",
                table: "File",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
