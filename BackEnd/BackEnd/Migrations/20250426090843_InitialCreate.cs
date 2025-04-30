using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Author",
                table: "Bookeds");

            migrationBuilder.DropColumn(
                name: "BookName",
                table: "Bookeds");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Bookeds");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Bookeds");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Bookeds");

            migrationBuilder.DropColumn(
                name: "User",
                table: "Bookeds");

            migrationBuilder.AddColumn<Guid>(
                name: "BookId",
                table: "Bookeds",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Bookeds",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Modifydate = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsAdmin = table.Column<bool>(type: "bit", nullable: true),
                    LastLogin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookeds_BookId",
                table: "Bookeds",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookeds_UserId",
                table: "Bookeds",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookeds_Books_BookId",
                table: "Bookeds",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookeds_User_UserId",
                table: "Bookeds",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookeds_Books_BookId",
                table: "Bookeds");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookeds_User_UserId",
                table: "Bookeds");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropIndex(
                name: "IX_Bookeds_BookId",
                table: "Bookeds");

            migrationBuilder.DropIndex(
                name: "IX_Bookeds_UserId",
                table: "Bookeds");

            migrationBuilder.DropColumn(
                name: "BookId",
                table: "Bookeds");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Bookeds");

            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "Bookeds",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BookName",
                table: "Bookeds",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Bookeds",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Bookeds",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Bookeds",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "Bookeds",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
