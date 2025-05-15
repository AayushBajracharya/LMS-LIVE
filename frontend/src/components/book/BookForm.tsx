import { useState, useEffect, FormEvent } from "react";
import { Book } from "../../types/books";

interface BookFormProps {
    book?: Book | null;
    isEdit: boolean;
    onSubmit: (book: Book) => void;
  }
  
  const BookForm: React.FC<BookFormProps> = ({ book, isEdit, onSubmit }) => {
    const [formData, setFormData] = useState<Book>({
      bookId: 0,
      title: "",
      authorId: 0,
      genre: "",
      isbn: "",
      quantity: 0,
    });
  
    useEffect(() => {
      if (book) {
        setFormData(book);
      }
    }, [book]);
  
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    return (
      <div className="bg-[#E3E3E3] p-6 rounded-lg shadow-md mb-4">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="bookId" value={formData.bookId} />
          <div className="mb-3">
            <label className="text-sm font-medium">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 bg-gray-200 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="text-sm font-medium">Author ID</label>
              <input type="number" name="authorId" value={formData.authorId} onChange={handleChange} required className="w-full p-2 bg-gray-200 rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium">Genre</label>
              <input type="text" name="genre" value={formData.genre} onChange={handleChange} required className="w-full p-2 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="text-sm font-medium">ISBN</label>
              <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required className="w-full p-2 bg-gray-200 rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full p-2 bg-gray-200 rounded-md" />
            </div>
          </div>
          <button type="submit" className="bg-[#255D81] text-white px-5 py-2 rounded-md">
            {isEdit ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>
    );
  };
  
  export default BookForm;