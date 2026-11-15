import type { Book, Borrower, BorrowingTransaction } from './types';

export const mockBooks: Book[] = [
	{
		id: 'bk-1',
		title: 'The Pragmatic Programmer',
		author: 'Andrew Hunt',
		isbn: '9780201616224',
		category: 'Technology',
		quantity: 5,
		available_quantity: 3,
		description: 'A classic guide to software craftsmanship and engineering best practices.'
	},
	{
		id: 'bk-2',
		title: 'Clean Code',
		author: 'Robert C. Martin',
		isbn: '9780132350884',
		category: 'Technology',
		quantity: 3,
		available_quantity: 2,
		description: 'Practical advice for writing readable, maintainable, and professional code.'
	},
	{
		id: 'bk-3',
		title: 'Atomic Habits',
		author: 'James Clear',
		isbn: '9780735211292',
		category: 'Self Development',
		quantity: 4,
		available_quantity: 4,
		description: 'A system for building good habits and breaking bad ones with clear steps.'
	}
];

export const mockBorrowers: Borrower[] = [
	{
		id: 'br-1',
		full_name: 'Maria Santos',
		student_id: '2024-001',
		course: 'Computer Science',
		year_level: '2nd Year',
		contact_number: '+63 912 345 6789'
	},
	{
		id: 'br-2',
		full_name: 'Luis Dela Cruz',
		student_id: '2024-045',
		course: 'Information Technology',
		year_level: '3rd Year',
		contact_number: '+63 917 765 4312'
	},
	{
		id: 'br-3',
		full_name: 'Jasmine Reyes',
		student_id: '2023-123',
		course: 'Business Administration',
		year_level: '4th Year',
		contact_number: '+63 929 901 7771'
	}
];

export const mockTransactions: BorrowingTransaction[] = [
	{
		id: 'tx-1',
		borrower_id: 'br-1',
		book_id: 'bk-1',
		borrowed_at: '2026-10-01T09:00:00.000Z',
		due_date: '2026-10-08T09:00:00.000Z',
		returned_at: null,
		actual_return_date: null,
		status: 'borrowed',
		books: mockBooks[0],
		borrowers: mockBorrowers[0]
	},
	{
		id: 'tx-2',
		borrower_id: 'br-2',
		book_id: 'bk-2',
		borrowed_at: '2026-09-18T10:00:00.000Z',
		due_date: '2026-09-25T10:00:00.000Z',
		returned_at: '2026-09-28T10:00:00.000Z',
		actual_return_date: '2026-09-28T10:00:00.000Z',
		status: 'returned',
		books: mockBooks[1],
		borrowers: mockBorrowers[1]
	},
	{
		id: 'tx-3',
		borrower_id: 'br-3',
		book_id: 'bk-3',
		borrowed_at: '2026-09-15T08:00:00.000Z',
		due_date: '2026-09-22T08:00:00.000Z',
		returned_at: null,
		actual_return_date: null,
		status: 'overdue',
		books: mockBooks[2],
		borrowers: mockBorrowers[2]
	}
];
