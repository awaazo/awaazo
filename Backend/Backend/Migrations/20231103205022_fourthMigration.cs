using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class fourthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Podcasts_File_CoverId",
                table: "Podcasts");

            migrationBuilder.DropIndex(
                name: "IX_Podcasts_CoverId",
                table: "Podcasts");

            migrationBuilder.DropColumn(
                name: "CoverId",
                table: "Podcasts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CoverId",
                table: "Podcasts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Podcasts_CoverId",
                table: "Podcasts",
                column: "CoverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Podcasts_File_CoverId",
                table: "Podcasts",
                column: "CoverId",
                principalTable: "File",
                principalColumn: "FileId");
        }
    }
}
