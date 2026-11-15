import { collection, doc, getDocs, orderBy, query, runTransaction } from 'firebase/firestore';
import { getFirebaseDb } from '#lib/firebase';
import type { Book, Borrower, BorrowingTransaction } from '#lib/types';

function markOverdue(transactions: BorrowingTransaction[]) {
	const today = new Date();
	const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
	return transactions.map((transaction) => ({
		...transaction,
		status:
			transaction.returned_at === null && transaction.due_date.slice(0, 10) < todayString
				? 'overdue'
				: transaction.status
	}));
}

export async function listTransactions(): Promise<BorrowingTransaction[]> {
	const snapshot = await getDocs(
		query(collection(getFirebaseDb(), 'borrowing_transactions'), orderBy('borrowed_at', 'desc'))
	);
	const transactions = snapshot.docs.map(
		(item) => ({ ...item.data(), id: item.id }) as BorrowingTransaction
	);
	return markOverdue(transactions);
}

export async function createBorrowing(input: { borrower_id: string; book_id: string; due_date: string }) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(input.due_date) || Number.isNaN(Date.parse(`${input.due_date}T00:00:00Z`))) {
		throw new Error('A valid due date is required.');
	}

	const db = getFirebaseDb();
	const bookReference = doc(db, 'books', input.book_id);
	const borrowerReference = doc(db, 'borrowers', input.borrower_id);
	const transactionReference = doc(collection(db, 'borrowing_transactions'));

	return runTransaction(db, async (transaction) => {
		const bookSnapshot = await transaction.get(bookReference);
		const borrowerSnapshot = await transaction.get(borrowerReference);
		if (!bookSnapshot.exists()) throw new Error('Book not found.');
		if (!borrowerSnapshot.exists()) throw new Error('Borrower not found.');

		const book = { ...bookSnapshot.data(), id: bookSnapshot.id } as Book;
		book.quantity = Number(book.quantity ?? 0);
		book.available_quantity = Number(book.available_quantity ?? 0);
		const borrower = { ...borrowerSnapshot.data(), id: borrowerSnapshot.id } as Borrower;
		if (book.available_quantity <= 0) throw new Error('This book is currently unavailable.');

		const borrowing: BorrowingTransaction = {
			id: transactionReference.id,
			borrower_id: input.borrower_id,
			book_id: input.book_id,
			borrowed_at: new Date().toISOString(),
			due_date: input.due_date,
			returned_at: null,
			actual_return_date: null,
			status: 'borrowed',
			books: book,
			borrowers: borrower
		};
		transaction.update(bookReference, { available_quantity: book.available_quantity - 1 });
		transaction.set(transactionReference, {
			borrower_id: borrowing.borrower_id,
			book_id: borrowing.book_id,
			borrowed_at: borrowing.borrowed_at,
			due_date: borrowing.due_date,
			returned_at: borrowing.returned_at,
			actual_return_date: borrowing.actual_return_date,
			status: borrowing.status,
			books: borrowing.books,
			borrowers: borrowing.borrowers
		});
		return borrowing;
	});
}

export async function returnBorrowing(transactionId: string, actualReturnDate?: string) {
	const returnDate = actualReturnDate ? new Date(actualReturnDate) : new Date();
	if (Number.isNaN(returnDate.getTime())) throw new Error('A valid return date is required.');
	const returnedAt = returnDate.toISOString();
	const db = getFirebaseDb();
	const transactionReference = doc(db, 'borrowing_transactions', transactionId);

	return runTransaction(db, async (transaction) => {
		const snapshot = await transaction.get(transactionReference);
		if (!snapshot.exists()) throw new Error('Borrowing record not found.');
		const borrowing = { ...snapshot.data(), id: snapshot.id } as BorrowingTransaction;
		if (borrowing.returned_at) throw new Error('This borrowing has already been returned.');

		const bookReference = doc(db, 'books', borrowing.book_id);
		const bookSnapshot = await transaction.get(bookReference);
		if (!bookSnapshot.exists()) throw new Error('Book associated with this transaction was not found.');
		const book = { ...bookSnapshot.data(), id: bookSnapshot.id } as Book;
		book.quantity = Number(book.quantity ?? 0);
		book.available_quantity = Number(book.available_quantity ?? 0);
		if (book.available_quantity >= book.quantity) {
			throw new Error('Book availability is already at the total stock level.');
		}

		const status: BorrowingTransaction['status'] =
			returnedAt.slice(0, 10) > borrowing.due_date.slice(0, 10) ? 'overdue' : 'returned';
		const updated = {
			...borrowing,
			returned_at: returnedAt,
			actual_return_date: returnedAt,
			status
		};
		transaction.update(bookReference, { available_quantity: book.available_quantity + 1 });
		transaction.update(transactionReference, {
			returned_at: returnedAt,
			actual_return_date: returnedAt,
			status
		});
		return updated;
	});
}
