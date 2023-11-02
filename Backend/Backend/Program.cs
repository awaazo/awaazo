using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Backend.Infrastructure;
using Backend.Services.Interfaces;
using Backend.Services;
using Backend.Helper;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace Backend;

[ExcludeFromCodeCoverage]
public class Program
{
    public static void Main(string[] args) {
        
        var builder = WebApplication.CreateBuilder(args);
        var config = builder.Configuration;
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.WriteIndented = true;
        });

        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IPodcastService, PodcastService>();
        builder.Services.AddScoped<IEpisodeService, EpisodeService>();
        builder.Services.AddScoped<IFileService,FileService>();
        builder.Services.AddScoped<IProfileService, ProfileService>();
        builder.Services.AddScoped<PlaylistService>();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition(name: "Bearer", securityScheme: new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Enter the Bearer Authorization string as following: `Bearer Generated-JWT-Token`",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Name = "Bearer",
                        In = ParameterLocation.Header,
                        Reference = new OpenApiReference
                        {
                            Id = "Bearer",
                            Type = ReferenceType.SecurityScheme
                        }
                    },
                    new List<string>()
                }
            });
        });
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(x => {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters() {
                ValidIssuer = config["Jwt:Issuer"],
                ValidAudience = config["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"])),
                ValidateIssuer = false, // TODO: Change this once backend port is stabalized
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
            };
            x.Events = new JwtBearerEvents()
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["jwt-token"];
                    return Task.CompletedTask;
                }
            };
        });
        builder.Services.AddAuthorization();
        
        // Check if we are running in a docker container.
        bool inDockerEnv = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
       
        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            // Set the connection string to the docker container if we are running in a docker container.
            if (inDockerEnv)
                options.UseSqlServer(config.GetConnectionString("DockerConnection"));
            else 
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
        });


        builder.Services.AddCors(o => o.AddPolicy("Dev-policy", builder =>
        {
            builder.WithOrigins("http://localhost:3000", "https://localhost:3000",
            "http://localhost:3500", "https://localhost:3500","http://fronted:3500", "https://fronted:3500")
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }));

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("Dev-policy");
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Database.Migrate();
        }

        app.Run();
    }
}
