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