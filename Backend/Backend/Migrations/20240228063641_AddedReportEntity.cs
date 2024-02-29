using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedReportEntity : Migration
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

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TargetEntityName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TargetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReportedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reports");

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
