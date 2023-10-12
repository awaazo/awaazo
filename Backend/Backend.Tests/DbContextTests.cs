using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;

namespace Backend.Tests;

public class DbContextTests
{
    /// <summary>
    /// Tests that the Connection String is set in the appsettings.json file.
    /// </summary>
    [Fact]
    public void DbConnectionString_Test()
    {
        // ARRANGE
        // Connection Type depends on whether we are running in a container or not
        string connectionType = GetConnectionType();

        // ACT
        // Get the connection string from appsettings.json
        string? connectionString = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build()
            .GetConnectionString(connectionType);
        
        // ASSERT
        // Check if the connection string is not null
        Assert.NotNull(connectionString);
    }

    /// <summary>
    /// Tests that the DbContext can connect to the Database.
    /// </summary>
    [Fact]
    public void DbConnection_Test()
    {
        // ARRANGE
        // Connection Type depends on whether we are running in a container or not
        string connectionType = GetConnectionType();
        // Get the connection string from appsettings.json
        string? connectionString = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build()
            .GetConnectionString(connectionType);

        // Create a new instance of the AppDbContext class
        AppDbContext dbContext = new(connectionString!);

        // ACT
        bool isDbConnected = dbContext.Database.CanConnect();

        // ASSERT
        // Check if the Database is Created
        Assert.True(isDbConnected);
    }


    /// <summary>
    /// Returns the Connection Type based on whether we are running in a container or not. 
    /// </summary>
    /// <returns></returns>
    private static string GetConnectionType(){
        return Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true" ? "DockerConnection" : "DefaultConnection";
    }
}