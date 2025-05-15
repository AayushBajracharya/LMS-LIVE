export interface IssuingTransaction {
  studentId: number;
  userId: number;
  bookId: number;
  transactionType: "borrow" | "return"; // Changed to lowercase
  date: string;
}

export interface Student {
  studentId: number;
  name: string;
  email?: string;
  contactNumber?: string;
  department?: string;
}

export interface Book {
  bookId: number;
  title: string;
  authorId?: number;
  genre?: string;
  isbn?: string;
  quantity?: number;
}