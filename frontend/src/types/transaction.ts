export interface Transaction {
    transactionId: number;
    studentId: number;
    user: string;
    userId: number;
    bookId: number;
    transactionType: "borrow" | "return"; 
    date: string;
    studentName?: string;
    bookTitle?: string;
    username?: string;
  }