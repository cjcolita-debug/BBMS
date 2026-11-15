import { mockBooks, mockBorrowers, mockTransactions } from '#lib/mock-data';
import type { Book, Borrower, BorrowingTransaction } from '#lib/types';

const BOOKS_KEY = 'bbms_books';
const BORROWERS_KEY = 'bbms_borrowers';
const TRANSACTIONS_KEY = 'bbms_transactions';

export function ensureLocalSeed() {
	if (typeof localStorage === 'undefined') return;
	if (!localStorage.getItem(BOOKS_KEY)) localStorage.setItem(BOOKS_KEY, JSON.stringify(mockBooks));
	if (!localStorage.getItem(BORROWERS_KEY)) localStorage.setItem(BORROWERS_KEY, JSON.stringify(mockBorrowers));
	if (!localStorage.getItem(TRANSACTIONS_KEY)) localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mockTransactions));
}

export function readLocalBooks(): Book[] {
	if (typeof localStorage === 'undefined') return mockBooks;
	ensureLocalSeed();
	try {
		return JSON.parse(localStorage.getItem(BOOKS_KEY) ?? '[]') as Book[];
	} catch {
		return mockBooks;
	}
}

export function writeLocalBooks(books: Book[]) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function readLocalBorrowers(): Borrower[] {
	if (typeof localStorage === 'undefined') return mockBorrowers;
	ensureLocalSeed();
	try {
		return JSON.parse(localStorage.getItem(BORROWERS_KEY) ?? '[]') as Borrower[];
	} catch {
		return mockBorrowers;
	}
}

export function writeLocalBorrowers(borrowers: Borrower[]) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(BORROWERS_KEY, JSON.stringify(borrowers));
}

export function readLocalTransactions(): BorrowingTransaction[] {
	if (typeof localStorage === 'undefined') return mockTransactions;
	ensureLocalSeed();
	try {
		return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) ?? '[]') as BorrowingTransaction[];
	} catch {
		return mockTransactions;
	}
}

export function writeLocalTransactions(transactions: BorrowingTransaction[]) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}
