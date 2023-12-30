namespace Backend.Models;

public class ForgetPasswordToken : BaseEntity
{
    public Guid UserId { get; set; } = Guid.Empty;
    public string Token { get; set; } = string.Empty;
    
    public ForgetPasswordToken() {}

    public ForgetPasswordToken(User user) {
        UserId = user.Id;
        Token = Guid.NewGuid().ToString() +
                Guid.NewGuid() + 
                Guid.NewGuid();
    }
}