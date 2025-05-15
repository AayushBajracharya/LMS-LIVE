using Application.Queries.TransactionQueries;
using Infrastructure.Repositories;
using LibraryManagementSystem.Modles;
using MediatR;

namespace Application.Handlers.TransactionHandlers
{
    public class SearchTransactionsQueryHandler : IRequestHandler<SearchTransactionsQuery, IEnumerable<Transactions>>
    {
        private readonly ITransactionRepository _transactionRepository;

        public SearchTransactionsQueryHandler(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<IEnumerable<Transactions>> Handle(SearchTransactionsQuery request, CancellationToken cancellationToken)
        {
            return await _transactionRepository.SearchTransactionsAsync(request.Search);
        }
    }
}
