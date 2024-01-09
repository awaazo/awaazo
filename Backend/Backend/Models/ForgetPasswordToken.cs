using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class ForgetPasswordToken : BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; } = Guid.Empty;
    public string Token { get; set; } = string.Empty;

    public ForgetPasswordToken()
    {
        Id = Guid.NewGuid();
    }

    public ForgetPasswordToken(User user)
    {
        Id = Guid.NewGuid();
        UserId = user.Id;
        Token = Guid.NewGuid().ToString() +
                Guid.NewGuid() + 
                Guid.NewGuid();
    }
}