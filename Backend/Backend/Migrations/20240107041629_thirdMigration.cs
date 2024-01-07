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
                name: "FK_Annotations_Sponsors_SponsorshipId",
                table: "Annotations");

            migrationBuilder.DropIndex(
                name: "IX_Annotations_SponsorshipId",
                table: "Annotations");

            migrationBuilder.DropColumn(
                name: "SponsorshipId",
                table: "Annotations");

            migrationBuilder.AlterColumn<string>(
                name: "Website",
                table: "Sponsors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AnnotationId",
                table: "Sponsors",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_AnnotationId",
                table: "Sponsors",
                column: "AnnotationId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Sponsors_Annotations_AnnotationId",
                table: "Sponsors",
                column: "AnnotationId",
                principalTable: "Annotations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sponsors_Annotations_AnnotationId",
                table: "Sponsors");

            migrationBuilder.DropIndex(
                name: "IX_Sponsors_AnnotationId",
                table: "Sponsors");

            migrationBuilder.DropColumn(
                name: "AnnotationId",
                table: "Sponsors");

            migrationBuilder.AlterColumn<string>(
                name: "Website",
                table: "Sponsors",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<Guid>(
                name: "SponsorshipId",
                table: "Annotations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Annotations_SponsorshipId",
                table: "Annotations",
                column: "SponsorshipId");

            migrationBuilder.AddForeignKey(
                name: "FK_Annotations_Sponsors_SponsorshipId",
                table: "Annotations",
                column: "SponsorshipId",
                principalTable: "Sponsors",
                principalColumn: "Id");
        }
    }
}
