export type Book = {
	id: string;
	title: string;
	author: string;
	isbn: string;
	category: string;
	quantity: number;
	available_quantity: number;
	description: string;
	created_at?: string;
};

export type Borrower = {
	id: string;
	full_name: string;
	student_id: string;
	course: string;
	year_level: string;
	contact_number: string;
	created_at?: string;
};

export type BorrowingTransaction = {
	id: string;
	borrower_id: string;
	book_id: string;
	borrowed_at: string;
	due_date: string;
	returned_at: string | null;
	actual_return_date: string | null;
	status: 'borrowed' | 'returned' | 'overdue';
	books?: Book;
	borrowers?: Borrower;
};
