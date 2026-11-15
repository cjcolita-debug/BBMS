import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, test } from 'node:test';
import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment
} from '@firebase/rules-unit-testing';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	runTransaction,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import { sampleBookDocumentId, sampleBooks } from '../src/lib/sample-books-data.mjs';

const projectId = 'demo-bbms';
let testEnvironment;

const bookRecord = {
	title: 'Test Book',
	author: 'Test Author',
	isbn: '9780000000001',
	category: 'Test',
	quantity: 1,
	available_quantity: 1,
	description: '',
	created_at: '2026-10-30T00:00:00.000Z'
};

const borrowerRecord = {
	full_name: 'Test Borrower',
	student_id: 'TEST-001',
	course: 'Testing',
	year_level: '1st Year',
	contact_number: '000',
	created_at: '2026-10-30T00:00:00.000Z'
};

before(async () => {
	testEnvironment = await initializeTestEnvironment({
		projectId,
		firestore: {
			host: '127.0.0.1',
			port: 8080,
			rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8')
		}
	});
});

beforeEach(async () => {
	await testEnvironment.clearFirestore();
	await testEnvironment.withSecurityRulesDisabled(async (context) => {
		const db = context.firestore();
		await setDoc(doc(db, 'admins', 'admin-user'), { active: true });
		await setDoc(doc(db, 'books', 'book-1'), bookRecord);
		await setDoc(doc(db, 'borrowers', 'borrower-1'), borrowerRecord);
	});
});

after(async () => {
	await testEnvironment?.cleanup();
});

test('only allow-listed admins can read and modify library collections', async () => {
	const adminDb = testEnvironment.authenticatedContext('admin-user').firestore();
	const otherUserDb = testEnvironment.authenticatedContext('other-user').firestore();
	const anonymousDb = testEnvironment.unauthenticatedContext().firestore();

	await assertSucceeds(getDoc(doc(adminDb, 'admins', 'admin-user')));
	await assertFails(getDoc(doc(otherUserDb, 'books', 'book-1')));
	await assertFails(getDocs(collection(anonymousDb, 'borrowers')));
	await assertFails(setDoc(doc(adminDb, 'admins', 'other-user'), { active: true }));

	await assertFails(getDocs(collection(otherUserDb, 'books')));
});

test('admins can add, edit, search, and delete books and borrowers', async () => {
	const db = testEnvironment.authenticatedContext('admin-user').firestore();
	const newBook = {
		...bookRecord,
		title: 'Searchable New Book',
		isbn: '9780000000002'
	};
	const newBorrower = {
		...borrowerRecord,
		full_name: 'Searchable New Borrower',
		student_id: 'TEST-002'
	};

	await assertSucceeds(setDoc(doc(db, 'books', 'book-2'), newBook));
	await assertSucceeds(updateDoc(doc(db, 'books', 'book-2'), { title: 'Edited New Book' }));
	const foundBooks = await assertSucceeds(
		getDocs(query(collection(db, 'books'), where('title', '==', 'Edited New Book')))
	);
	assert.equal(foundBooks.size, 1);
	await assertSucceeds(deleteDoc(doc(db, 'books', 'book-2')));

	await assertSucceeds(setDoc(doc(db, 'borrowers', 'borrower-2'), newBorrower));
	await assertSucceeds(updateDoc(doc(db, 'borrowers', 'borrower-2'), { full_name: 'Edited Borrower' }));
	const foundBorrowers = await assertSucceeds(
		getDocs(query(collection(db, 'borrowers'), where('full_name', '==', 'Edited Borrower')))
	);
	assert.equal(foundBorrowers.size, 1);
	await assertSucceeds(deleteDoc(doc(db, 'borrowers', 'borrower-2')));
});

test('borrowing and returning update stock atomically and retain transaction history', async () => {
	const db = testEnvironment.authenticatedContext('admin-user').firestore();
	const bookReference = doc(db, 'books', 'book-1');
	const borrowerReference = doc(db, 'borrowers', 'borrower-1');
	const borrowingReference = doc(db, 'borrowing_transactions', 'transaction-1');
	const borrowing = {
		borrower_id: 'borrower-1',
		book_id: 'book-1',
		borrowed_at: '2026-10-30T01:00:00.000Z',
		due_date: '2026-11-06',
		returned_at: null,
		actual_return_date: null,
		status: 'borrowed',
		books: { id: 'book-1', ...bookRecord },
		borrowers: { id: 'borrower-1', ...borrowerRecord }
	};

	await assertSucceeds(
		runTransaction(db, async (transaction) => {
			const [book, borrower] = await Promise.all([
				transaction.get(bookReference),
				transaction.get(borrowerReference)
			]);
			assert.ok(book.exists());
			assert.ok(borrower.exists());
			transaction.update(bookReference, { available_quantity: book.data().available_quantity - 1 });
			transaction.set(borrowingReference, borrowing);
		})
	);
	assert.equal((await getDoc(bookReference)).data().available_quantity, 0);

	await assertFails(
		runTransaction(db, async (transaction) => {
			const book = await transaction.get(bookReference);
			transaction.update(bookReference, { available_quantity: book.data().available_quantity - 1 });
			transaction.set(doc(db, 'borrowing_transactions', 'transaction-2'), {
				...borrowing,
				borrowed_at: '2026-10-30T02:00:00.000Z'
			});
		})
	);
	assert.equal((await getDoc(bookReference)).data().available_quantity, 0);

	const returnedAt = '2026-11-05T12:00:00.000Z';
	await assertSucceeds(
		runTransaction(db, async (transaction) => {
			const [book, transactionSnapshot] = await Promise.all([
				transaction.get(bookReference),
				transaction.get(borrowingReference)
			]);
			transaction.update(bookReference, { available_quantity: book.data().available_quantity + 1 });
			transaction.update(borrowingReference, {
				returned_at: returnedAt,
				actual_return_date: returnedAt,
				status: 'returned'
			});
			assert.equal(transactionSnapshot.data().returned_at, null);
		})
	);
	assert.equal((await getDoc(bookReference)).data().available_quantity, 1);
	assert.equal((await getDoc(borrowingReference)).data().returned_at, returnedAt);
	await assertFails(deleteDoc(borrowingReference));

	await assertFails(
		runTransaction(db, async (transaction) => {
			const [book, transactionSnapshot] = await Promise.all([
				transaction.get(bookReference),
				transaction.get(borrowingReference)
			]);
			transaction.update(bookReference, { available_quantity: book.data().available_quantity + 1 });
			transaction.update(borrowingReference, {
				returned_at: returnedAt,
				actual_return_date: returnedAt,
				status: 'returned'
			});
			assert.ok(transactionSnapshot.exists());
		})
	);

	await assertSucceeds(deleteDoc(bookReference));
	await assertSucceeds(deleteDoc(borrowerReference));
	const history = await assertSucceeds(getDoc(borrowingReference));
	assert.equal(history.data().books.title, bookRecord.title);
	assert.equal(history.data().borrowers.full_name, borrowerRecord.full_name);
});

test('admin-only sample seeding adds exactly 50 records and refuses a repeat run', async () => {
	const db = testEnvironment.authenticatedContext('admin-user').firestore();
	const records = sampleBooks.map((book, index) => {
		const id = sampleBookDocumentId(book, index);
		const reference = doc(db, 'books', id);
		const isbnIndex = book.isbn
			? doc(
					db,
					'book_isbn_index',
					createHash('sha256').update(book.isbn).digest('hex')
				)
			: null;
		return { book, reference, isbnIndex };
	});

	const runSeed = () =>
		runTransaction(db, async (transaction) => {
			const snapshots = await Promise.all(
				records.flatMap((record) => [
					transaction.get(record.reference),
					...(record.isbnIndex ? [transaction.get(record.isbnIndex)] : [])
				])
			);
			if (snapshots.some((snapshot) => snapshot.exists())) {
				throw new Error('Sample document already exists.');
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
					created_at: '2026-10-30T00:00:00.000Z'
				});
				if (isbnIndex) {
					transaction.set(isbnIndex, { book_id: reference.id, isbn: book.isbn });
				}
			}
		});

	await assertSucceeds(runSeed());
	const snapshot = await assertSucceeds(getDocs(collection(db, 'books')));
	const inserted = snapshot.docs.filter((book) => book.id.startsWith('sample-'));
	assert.equal(inserted.length, 50);
	assert.equal(inserted.every((book) => book.data().available_quantity === book.data().quantity), true);

	await assert.rejects(runSeed(), /Sample document already exists/);
	const afterRepeat = await assertSucceeds(getDocs(collection(db, 'books')));
	assert.equal(afterRepeat.size, snapshot.size);
});
