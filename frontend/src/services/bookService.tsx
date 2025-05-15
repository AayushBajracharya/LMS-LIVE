import { Book } from '../types/books';
import apiClient from './tokenManagement/apiClient';

export const fetchBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>('/Books');
  return response.data;
};

export const createBook = async (book: Book): Promise<Book> => {
  const response = await apiClient.post<Book>('/Books', book);
  return response.data;
};

export const updateBook = async (book: Book): Promise<void> => {
  await apiClient.put(`/Books/${book.bookId}`, book);
};

export const deleteBook = async (bookId: number): Promise<void> => {
  await apiClient.delete(`/Books/${bookId}`);
};