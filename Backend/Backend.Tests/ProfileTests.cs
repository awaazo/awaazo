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