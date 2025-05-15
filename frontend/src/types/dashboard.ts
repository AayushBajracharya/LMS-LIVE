export interface Dashboard {
  totalStudentCount: number;
  totalBookCount: number;
  totalTransactionCount: number;
  totalBorrowedBooks: number;
  totalReturnedBooks: number;
}

export interface OverdueBorrower {
  name: string;
  borrowedId: string;
}