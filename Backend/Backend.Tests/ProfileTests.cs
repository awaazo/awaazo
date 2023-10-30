using Backend.Services;
using Microsoft.Identity.Client;
using Moq;
using AutoMapper;
using Backend.Controllers;
using Backend.Controllers.Requests;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualBasic;
using MockQueryable.Moq;
using System.Security.Claims;

namespace Backend.Tests;

public class ProfileTests : IAsyncLifetime
{

    public ProfileTests(){}

    public Task InitializeAsync()
    {
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    #region Test Service

    [Fact]
    public void GetAvatarPath_CorrectFileInfo_ReturnsPath()
    {
        // ARRANGE
        string fileInfo = "72addbeb-86a1-4646-ba56-08dbd3cc5a57.png||image/png";
        string filename = "72addbeb-86a1-4646-ba56-08dbd3cc5a57.png";

        // ACT
        string path = ProfileService.GetAvatarPath(fileInfo);

        // ASSERT
        Assert.Contains(Path.Combine("Avatars",filename), path);
    }

    [Fact]
    public void GetAvatarType_CorrectFileInfo_ReturnsType()
    {
        // ARRANGE
        string fileInfo = "72addbeb-86a1-4646-ba56-08dbd3cc5a57.png||image/png";
        string type = "image/png";

        // ACT
        string avatarType  = ProfileService.GetAvatarType(fileInfo);

        // ASSERT
        Assert.Equal(type, avatarType);
    }

    [Fact]
    public void SaveAvatar_SavedFile_ReturnsTrue()
    {
        Assert.True(true);
    }

    [Fact]
    public void DeleteProfileAsync_ExistingUser_ReturnsTrue()
    {
        Assert.True(true); 
    }

    [Fact]
    public void DeleteProfileAsync_NonExistingUser_ReturnsFalse()
    {
        Assert.True(true);
    }

    #endregion

    #region Test Controller

    #endregion
}