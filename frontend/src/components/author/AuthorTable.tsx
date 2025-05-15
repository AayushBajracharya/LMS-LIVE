import { Author } from "../../types/authors";


interface AuthorTableProps {
  authors: Author[];
  onEdit: (author: Author) => void;
  onDelete: (authorId: number) => void;
}

const AuthorTable: React.FC<AuthorTableProps> = ({ authors, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg text-gray-800 mb-3">Author List</h3>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-[#255D81] text-white">
            <tr>
              <th className="p-3 text-center">Author ID</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Bio</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.length > 0 ? (
              authors.map((author) => (
                <tr
                  key={author.authorID} // Make sure each row has a unique key prop
                  className="border-b border-gray-300 last:border-none hover:bg-gray-100"
                >
                  <td className="p-3 text-center">{author.authorID}</td>
                  <td className="p-3 text-center">{author.name}</td>
                  <td className="p-3 text-center">{author.bio}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onEdit(author)}
                      className="w-20 bg-yellow-600 text-white rounded-xl mr-2 hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(author.authorID)}
                      className="w-20 bg-red-600 text-white rounded-xl hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-5 text-gray-500">
                  No authors available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthorTable;