import { Book } from "../../types/books";

interface BookTableProps {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (bookId: number) => void;
  }
  
  const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onDelete }) => {
    return (
      <div className="bg-gray-200 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg text-gray-800 mb-3">Book List</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-[#255D81] text-white">
              <tr>
                <th className="p-3 text-center">Book ID</th>
                <th className="p-3 text-center">Title</th>
                <th className="p-3 text-center">Author ID</th>
                <th className="p-3 text-center">Genre</th>
                <th className="p-3 text-center">ISBN</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.bookId} className="border-b border-gray-300 last:border-none hover:bg-gray-100">
                    <td className="p-3 text-center">{book.bookId}</td>
                    <td className="p-3 text-center">{book.title}</td>
                    <td className="p-3 text-center">{book.authorId}</td>
                    <td className="p-3 text-center">{book.genre}</td>
                    <td className="p-3 text-center">{book.isbn}</td>
                    <td className="p-3 text-center">{book.quantity}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => onEdit(book)} className="w-28 h-12 bg-yellow-600 text-white rounded-xl mr-2 hover:bg-yellow-500 transition">Edit</button>
                      <button onClick={() => onDelete(book.bookId)} className="w-28 h-12 bg-red-600 text-white rounded-xl hover:bg-red-500 transition">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-5 text-gray-500">No books available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default BookTable;