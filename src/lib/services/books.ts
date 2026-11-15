import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	runTransaction
} from 'firebase/firestore';
import { getFirebaseDb } from '#lib/firebase';
import { firestoreIndexId } from '#lib/services/firestore-utils';
import type { Book } from '#lib/types';

function mapBook(id: string, data: Record<string, unknown>): Book {
	return {
		...(data as Omit<Book, 'id'>),
		id,
		quantity: Number(data.quantity ?? 0),
		available_quantity: Number(data.available_quantity ?? 0)
	};
}

export async function listBooks(): Promise<Book[]> {
	const snapshot = await getDocs(query(collection(getFirebaseDb(), 'books'), orderBy('created_at', 'desc')));
	return snapshot.docs.map((item) => mapBook(item.id, item.data()));
}

export async function createBook(input: Partial<Book>): Promise<Book> {
	const payload = {
		title: input.title?.trim() ?? '',
		author: input.author?.trim() ?? '',
		isbn: input.isbn?.trim() ?? '',
		category: input.category?.trim() ?? '',
		quantity: Number(input.quantity ?? 1),
		available_quantity: Number(input.available_quantity ?? input.quantity ?? 1),
		description: input.description?.trim() ?? ''
	};

	if (!payload.title || !payload.author || !payload.isbn || !payload.category) {
		throw new Error('Title, author, ISBN, and category are required.');
	}
	if (!Number.isInteger(payload.quantity) || payload.quantity < 0) {
		throw new Error('Quantity must be a non-negative whole number.');
	}
	if (
		!Number.isInteger(payload.available_quantity) ||
		payload.available_quantity < 0 ||
		payload.available_quantity > payload.quantity
	) {
		throw new Error('Available quantity must be between zero and total quantity.');
	}

	const db = getFirebaseDb();
	const reference = doc(collection(db, 'books'));
	const indexReference = doc(db, 'book_isbn_index', await firestoreIndexId(payload.isbn));
	const created_at = new Date().toISOString();
	const book: Book = { id: reference.id, ...payload, created_at };
	await runTransaction(db, async (transaction) => {
		const existingIndex = await transaction.get(indexReference);
		if (existingIndex.exists()) throw new Error('A book with this ISBN already exists.');
		transaction.set(reference, { ...payload, created_at });
		transaction.set(indexReference, { book_id: reference.id, isbn: payload.isbn });
	});
	return book;
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book> {
	const db = getFirebaseDb();
	const reference = doc(db, 'books', id);
	return runTransaction(db, async (transaction) => {
		const snapshot = await transaction.get(reference);
		if (!snapshot.exists()) throw new Error('Book not found.');

		const existing = mapBook(snapshot.id, snapshot.data());
		const newIndexReference =
			updates.isbn !== undefined
				? doc(db, 'book_isbn_index', await firestoreIndexId(updates.isbn.trim()))
				: null;
		const oldIndexReference =
			updates.isbn !== undefined && updates.isbn.trim() !== existing.isbn
				? doc(db, 'book_isbn_index', await firestoreIndexId(existing.isbn))
				: null;
		const newIndexSnapshot = newIndexReference ? await transaction.get(newIndexReference) : null;
		const normalizedUpdates: Partial<Book> = {};
		for (const field of ['title', 'author', 'isbn', 'category', 'description'] as const) {
			if (updates[field] !== undefined) normalizedUpdates[field] = updates[field]!.trim();
		}
		if (updates.quantity !== undefined) normalizedUpdates.quantity = Number(updates.quantity);
		if (updates.available_quantity !== undefined) {
			normalizedUpdates.available_quantity = Number(updates.available_quantity);
		}

		const updated = { ...existing, ...normalizedUpdates };
		if (!updated.title || !updated.author || !updated.isbn || !updated.category) {
			throw new Error('Title, author, ISBN, and category are required.');
		}
		if (!Number.isInteger(updated.quantity) || updated.quantity < 0) {
			throw new Error('Quantity must be a non-negative whole number.');
		}
		if (normalizedUpdates.quantity !== undefined) {
			const borrowedQuantity = existing.quantity - existing.available_quantity;
			if (updated.quantity < borrowedQuantity) {
				throw new Error(`Quantity cannot be lower than the ${borrowedQuantity} copies currently borrowed.`);
			}
			updated.available_quantity = updated.quantity - borrowedQuantity;
		} else if (
			!Number.isInteger(updated.available_quantity) ||
			updated.available_quantity < 0 ||
			updated.available_quantity > updated.quantity
		) {
			throw new Error('Available quantity must be between zero and total quantity.');
		}

		if (updated.isbn !== existing.isbn) {
			if (newIndexSnapshot?.exists() && newIndexSnapshot.data().book_id !== id) {
				throw new Error('A book with this ISBN already exists.');
			}
		}

		transaction.set(reference, {
			title: updated.title,
			author: updated.author,
			isbn: updated.isbn,
			category: updated.category,
			quantity: updated.quantity,
			available_quantity: updated.available_quantity,
			description: updated.description,
			created_at: updated.created_at ?? new Date().toISOString()
		});
		if (newIndexReference && oldIndexReference) {
			transaction.delete(oldIndexReference);
			transaction.set(newIndexReference, { book_id: id, isbn: updated.isbn });
		}
		return updated;
	});
}

export async function deleteBook(id: string): Promise<void> {
	const db = getFirebaseDb();
	const reference = doc(db, 'books', id);
	await runTransaction(db, async (transaction) => {
		const snapshot = await transaction.get(reference);
		if (!snapshot.exists()) throw new Error('Book not found.');
		const book = mapBook(snapshot.id, snapshot.data());
		const indexReference = doc(db, 'book_isbn_index', await firestoreIndexId(book.isbn));
		const indexSnapshot = await transaction.get(indexReference);
		if (book.available_quantity !== book.quantity) {
			throw new Error('A book cannot be deleted while copies are currently borrowed.');
		}
		transaction.delete(reference);
		if (indexSnapshot.exists() && indexSnapshot.data().book_id === id) transaction.delete(indexReference);
	});
}

export async function getBookById(id: string): Promise<Book | null> {
	const snapshot = await getDoc(doc(getFirebaseDb(), 'books', id));
	return snapshot.exists() ? mapBook(snapshot.id, snapshot.data()) : null;
}
