using Backend.Models;

namespace Backend.Controllers.Responses
{
    public class TransactionResponse
    {
        public TransactionResponse(Transactions t) { 
            Amount = t.Amount;
            Username = t.User.Username;
            Date = t.CreatedAt;
            UserId = t.UserId;
            SenderId = t.SenderId;
            Type = t.TransactionType == Transactions.Type.Withdraw ? "Withdraw" : "Gift";
   
        }
        public double Amount { get; set; } = 0;
        public string Username  {  get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.MinValue;
        public Guid UserId { get; set; } = Guid.Empty;

        public Guid SenderId { get; set; } = Guid.Empty;

        public string Type { get; set; } = string.Empty;

    }
}
