import { collection, doc, getDoc, getDocs, runTransaction } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '#lib/firebase';
import { firestoreIndexId } from '#lib/services/firestore-utils';
import { sampleBookDocumentId, sampleBooks } from '#lib/sample-books-data.mjs';
import type { Book } from '#lib/types';

const confirmationPhrase = 'ADD 50 SAMPLE BOOKS';

function assertSampleBookDataset() {
	if (sampleBooks.length !== 50) throw new Error('Sample dataset must contain exactly 50 books.');

	const expectedCounts = new Map([
		['Programming', 10],
		['Web Development', 8],
		['Database Management', 7],
		['Computer Networking', 7],
		['Cybersecurity', 6],
		['Algorithms & Data Structures', 6],
		['General Education', 6]
	]);
	const counts = new Map();
	const ids = new Set();
	const isbns = new Set();

	sampleBooks.forEach((book, index) => {
		const id = sampleBookDocumentId(book, index);
		if (ids.has(id)) throw new Error(`Duplicate sample book document ID: ${id}`);
		ids.add(id);
		counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
		if (!book.title || !book.author || !book.description) throw new Error(`Sample book ${id} is incomplete.`);
		if (!Number.isInteger(book.quantity) || book.quantity < 3 || book.quantity > 15) {
			throw new Error(`Sample book ${id} has an invalid quantity.`);
		}
		if (book.isbn) {
			if (isbns.has(book.isbn)) throw new Error(`Duplicate sample ISBN: ${book.isbn}`);
			isbns.add(book.isbn);
		} else if (!book.title.startsWith('DEMO -') || book.author !== 'BBMS Demo Collection') {
			throw new Error(`A book without a verified ISBN must be clearly labeled as a demo: ${id}`);
		}
	});

	for (const [category, expected] of expectedCounts) {
		if (counts.get(category) !== expected) {
			throw new Error(`${category} must contain ${expected} sample books.`);
		}
	}
}

async function assertActiveAdmin() {
	const user = getFirebaseAuth().currentUser;
	if (!user) throw new Error('Sign in to BBMS with a Firebase admin account before seeding.');
	const admin = await getDoc(doc(getFirebaseDb(), 'admins', user.uid));
	if (!admin.exists() || admin.data().active !== true) {
		throw new Error('The signed-in Firebase account is not an active BBMS admin.');
	}
	return user;
}

export async function inspectSampleBooks() {
	assertSampleBookDataset();
	await assertActiveAdmin();
	const db = getFirebaseDb();
	const existingBooks = await getDocs(collection(db, 'books'));
	const existingIds = new Set(existingBooks.docs.map((snapshot) => snapshot.id));
	const expected = await Promise.all(
		sampleBooks.map(async (book, index) => ({
			book,
			id: sampleBookDocumentId(book, index),
			isbnIndexId: book.isbn ? await firestoreIndexId(book.isbn) : null
		}))
	);
	const indexSnapshots = await Promise.all(
		expected
			.filter((item) => item.isbnIndexId)
			.map((item) => getDoc(doc(db, 'book_isbn_index', item.isbnIndexId!)))
	);
	const existingIsbnIds = new Set(
		indexSnapshots.filter((snapshot) => snapshot.exists()).map((snapshot) => snapshot.id)
	);

	return {
		existingBookCount: existingBooks.size,
		collidingDocumentIds: expected.filter((item) => existingIds.has(item.id)).map((item) => item.id),
		collidingIsbns: expected
			.filter((item) => item.isbnIndexId && existingIsbnIds.has(item.isbnIndexId))
			.map((item) => item.book.isbn)
	};
}

export async function seedSampleBooks(confirmation: string) {
	if (confirmation !== confirmationPhrase) {
		throw new Error(`Explicit confirmation required: pass "${confirmationPhrase}" to seed sample books.`);
	}
	assertSampleBookDataset();
	await assertActiveAdmin();

	const db = getFirebaseDb();
	const createdAt = new Date().toISOString();
	const records = await Promise.all(
		sampleBooks.map(async (book, index) => {
			const isbnIndexId = book.isbn ? await firestoreIndexId(book.isbn) : null;
			return {
				book,
				id: sampleBookDocumentId(book, index),
				reference: doc(db, 'books', sampleBookDocumentId(book, index)),
				isbnIndex: isbnIndexId
					? {
							reference: doc(db, 'book_isbn_index', isbnIndexId)
						}
					: null
			};
		})
	);

	await runTransaction(db, async (transaction) => {
		const snapshots = await Promise.all(
			records.flatMap((record) => [
				transaction.get(record.reference),
				...(record.isbnIndex ? [transaction.get(record.isbnIndex.reference)] : [])
			])
		);
		if (snapshots.some((snapshot) => snapshot.exists())) {
			throw new Error('No books were written: one or more sample IDs or ISBNs already exist.');
		}

		for (const { book, reference, isbnIndex } of records) {
			transaction.set(reference, {
				title: book.title,
				author: book.author,
				category: book.category,
				isbn: book.isbn,
				quantity: book.quantity,
				available_quantity: book.available_quantity,
				description: book.description,
				created_at: createdAt
			} satisfies Omit<Book, 'id'>);
			if (isbnIndex) {
				transaction.set(isbnIndex.reference, {
					book_id: reference.id,
					isbn: book.isbn
				});
			}
		}
	});

	const inserted = await Promise.all(records.map((record) => getDoc(record.reference)));
	if (inserted.length !== 50 || inserted.some((snapshot) => !snapshot.exists())) {
		throw new Error('Seed verification failed: expected all 50 sample books to be present.');
	}

	return { inserted: inserted.length, createdAt };
}
