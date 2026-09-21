namespace backend.Models;

public class ExpenseItem
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Category { get; set; } = "other";

    public DateTime Date { get; set; }
}