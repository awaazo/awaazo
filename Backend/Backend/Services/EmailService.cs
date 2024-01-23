using System.Net;
using System.Net.Mail;

namespace Backend.Services;

public class EmailService : IDisposable
{
    private readonly SmtpClient _client;
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config) {
        _client = new SmtpClient(config["Smtp:Domain"], int.Parse(config["Smtp:Port"]!)) {
            Credentials = new NetworkCredential(config["Smtp:Username"], config["Smtp:Password"]),
            EnableSsl = true
        };
        _config = config;
    }

    /// <summary>
    /// Sends an email to the specified address with the specified subject and body.
    /// </summary>
    /// <param name="message">The message to send.</param>
    public void Send(MailMessage message) { ;
        _client.Send(message);
        message.Dispose();
    }
    
    public void Dispose() {
        _client.Dispose();
    }
}