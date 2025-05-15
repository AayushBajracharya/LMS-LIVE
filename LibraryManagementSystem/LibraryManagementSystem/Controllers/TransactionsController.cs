using Application.Queries.TransactionQueries;
using Domain.Entities.Command.TransactionCommand;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class TransactionsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TransactionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _mediator.Send(new GetAllTransactionsQuery());
            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionById(int id)
        {
            var transaction = await _mediator.Send(new GetTransactionByIdQuery(id));
            if (transaction == null) return NotFound();
            return Ok(transaction);
        }

        [HttpPost]
        public async Task<IActionResult> AddTransaction([FromBody] AddTransactionCommand command)
        {
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetTransactionById), new { id }, command);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, [FromBody] UpdateTransactionCommand command)
        {
            if (id != command.TransactionId) return BadRequest();
            var result = await _mediator.Send(command);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var result = await _mediator.Send(new DeleteTransactionCommand(id));
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchTransactions([FromQuery] string search)
        {
            var transactions = await _mediator.Send(new SearchTransactionsQuery(search));
            return Ok(transactions);
        }
    }
}
