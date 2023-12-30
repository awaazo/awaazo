using System.Net;
using System.Net.Mail;

namespace Backend.Services;

public class EmailService : IDisposable
{
    private readonly SmtpClient _client;

    public EmailService(IConfiguration config) {
        _client = new SmtpClient() {
            Port = int.Parse(config["Smtp:Port"]!),
            Credentials = new NetworkCredential(config["Smtp:Username"], config["Smtp:Password"]),
            EnableSsl = true
        };
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="message"></param>
    /// <exception cref="">Throws exception if Smtp server is not reachable</exception>
    public void Send(MailMessage message) {
        _client.Send(message);
        message.Dispose();
    }
    
    public void Dispose() {
        _client.Dispose();
    }
}