import { useState, useEffect, FormEvent } from 'react';
import { Author } from '../../types/authors';

interface AuthorFormProps {
  author?: Author | null;
  isEdit: boolean;
  onSubmit: (author: Author) => void;
}

const AuthorForm: React.FC<AuthorFormProps> = ({ author, isEdit, onSubmit }) => {
  const [formData, setFormData] = useState<Author>({
    authorID: 0,
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (author) {
      setFormData(author);
    } else {
      setFormData({ authorID: 0, name: "", bio: "" });
    }
  }, [author]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ authorID: 0, name: "", bio: "" }); // Reset the form after submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#E3E3E3] p-6 rounded-lg shadow-md mb-4">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="authorId" value={formData.authorID} />
        <div className="mb-3">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-200 rounded-md"
          />
        </div>
        <div className="mb-3">
          <label className="text-sm font-medium">Biography</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-200 rounded-md"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-[#255D81] text-white px-5 py-2 rounded-md"
        >
          {isEdit ? "Update Author" : "Add Author"}
        </button>
      </form>
    </div>
  );
};

export default AuthorForm;