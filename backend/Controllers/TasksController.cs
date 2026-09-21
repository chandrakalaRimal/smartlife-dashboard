using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskItem>>> GetTasks()
    {
        var tasks = await _context.Tasks
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
    {
        task.Id = Guid.NewGuid();
        task.CreatedAt = DateTime.UtcNow;

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    [HttpPut("{id:guid}")]
public async Task<ActionResult<TaskItem>> UpdateTask(
    Guid id,
    TaskItem updatedTask
)
{
    var task = await _context.Tasks.FindAsync(id);

    if (task == null)
    {
        return NotFound();
    }

    task.Title = updatedTask.Title;
    task.Description = updatedTask.Description;
    task.Priority = updatedTask.Priority;
    task.Status = updatedTask.Status;

    await _context.SaveChangesAsync();

    return Ok(task);
}

[HttpDelete("{id:guid}")]
public async Task<IActionResult> DeleteTask(Guid id)
{
    var task = await _context.Tasks.FindAsync(id);

    if (task == null)
    {
        return NotFound();
    }

    _context.Tasks.Remove(task);

    await _context.SaveChangesAsync();

    return NoContent();
}
[HttpGet("{id:guid}")]
public async Task<ActionResult<TaskItem>> GetTaskById(Guid id)
{
    var task = await _context.Tasks.FindAsync(id);

    if (task == null)
    {
        return NotFound();
    }

    return Ok(task);
}
}