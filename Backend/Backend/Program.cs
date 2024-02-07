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
using Backend.Middlewares;
using System.Reflection;

namespace Backend;

[ExcludeFromCodeCoverage]
public class Program
{
    public static void Main(string[] args)
    {

        var builder = WebApplication.CreateBuilder(args);
        var config = builder.Configuration;
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.WriteIndented = true;
        });

        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IPodcastService, PodcastService>();
        builder.Services.AddScoped<IProfileService, ProfileService>();
        builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
        builder.Services.AddScoped<INotificationService, NotificationService>();
        builder.Services.AddScoped<ISocialService, SocialService>();

        builder.Services.AddScoped<ISectionService, SectionService>();
        builder.Services.AddScoped<IPlaylistService,PlaylistService>();
        builder.Services.AddScoped<IAnnotationService, AnnotationService>();



        builder.Services.AddScoped<ValidateUser>();
        builder.Services.AddScoped<BookmarkService>();
        builder.Services.AddScoped<ILogger, FileLogger>();

        builder.Services.AddScoped<EmailService>(serviceProvider => new EmailService(builder.Configuration));

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
            var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
        });
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters()
            {
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
            builder.SetIsOriginAllowedToAllowWildcardSubdomains()
                .WithOrigins("http://localhost:3000", "https://localhost:3000",
                "http://localhost:3500", "https://localhost:3500",
                "https://*.awaazo.com/*","http://localhost:8500", "http://py:8000")
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }));

        builder.Logging.AddConsole();
        builder.Logging.AddDebug();
        
        var app = builder.Build();
        app.UseStaticFiles();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(s =>
            {
                s.InjectStylesheet("/swagger-ui/SwaggerDark.css");
                s.InjectJavascript("/swagger-ui/custom.js");
                s.DocumentTitle = "AWAAZO Backend API";
            });
        }

        app.UseHttpsRedirection();
        app.UseCors("Dev-policy");
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseWhen(c => c.Request.Path.StartsWithSegments("/playlist"), builder =>
        {
            builder.UseMiddleware<ValidateUser>();
        });
        app.UseWhen(c => c.Request.Path.StartsWithSegments("/bookmark"), builder =>
        {
            builder.UseMiddleware<ValidateUser>();
        });

        /* Add middleware to check if the referer is allowed. This makes sure that only 
         the python server can access the backend.*/
        app.UseWhen(c => c.Request.Path.StartsWithSegments("/podcast/updateTranscriptionStatus"), builder =>
        {
            builder.UseMiddleware<RefererMiddleware>();
        });

        app.MapControllers();

        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Database.Migrate();
        }

        Console.Write("Delete me!");

        app.Run();
    }
}
