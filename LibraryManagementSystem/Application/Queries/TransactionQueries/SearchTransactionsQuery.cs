using LibraryManagementSystem.Modles;
using MediatR;

namespace Application.Queries.TransactionQueries
{
    public class SearchTransactionsQuery : IRequest<IEnumerable<Transactions>>
    {
        public string Search { get; }

        public SearchTransactionsQuery(string search)
        {
            Search = search;
        }
    }
}
