import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sampleBookDocumentId, sampleBooks } from '../src/lib/sample-books-data.mjs';

const expectedCounts = new Map([
	['Programming', 10],
	['Web Development', 8],
	['Database Management', 7],
	['Computer Networking', 7],
	['Cybersecurity', 6],
	['Algorithms & Data Structures', 6],
	['General Education', 6]
]);

test('sample catalog has exactly 50 complete books in the requested categories', () => {
	assert.equal(sampleBooks.length, 50);

	const counts = new Map();
	const ids = new Set();
	const isbns = new Set();
	for (const [index, book] of sampleBooks.entries()) {
		assert.ok(book.title);
		assert.ok(book.author);
		assert.ok(book.description);
		assert.ok(expectedCounts.has(book.category));
		assert.ok(Number.isInteger(book.quantity) && book.quantity >= 3 && book.quantity <= 15);
		assert.equal(book.available_quantity, book.quantity);
		assert.ok(book.isbn === '' || /^[0-9X-]{10,17}$/.test(book.isbn));

		const id = sampleBookDocumentId(book, index);
		assert.ok(!ids.has(id), `duplicate document ID: ${id}`);
		ids.add(id);
		counts.set(book.category, (counts.get(book.category) ?? 0) + 1);

		if (!book.isbn) {
			assert.ok(book.title.startsWith('DEMO -'));
			assert.equal(book.author, 'BBMS Demo Collection');
		} else {
			assert.ok(!isbns.has(book.isbn), `duplicate ISBN: ${book.isbn}`);
			isbns.add(book.isbn);
		}
	}

	assert.deepEqual(counts, expectedCounts);
	assert.equal(sampleBookDocumentId(sampleBooks[0], 0), 'sample-programming-01');
	assert.equal(sampleBookDocumentId(sampleBooks[49], 49), 'sample-general-education-50');
});
