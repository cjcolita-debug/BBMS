import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	runTransaction
} from 'firebase/firestore';
import { getFirebaseDb } from '#lib/firebase';
import { firestoreIndexId } from '#lib/services/firestore-utils';
import type { Borrower } from '#lib/types';

function mapBorrower(id: string, data: Record<string, unknown>): Borrower {
	return { ...(data as Omit<Borrower, 'id'>), id };
}

export async function listBorrowers(): Promise<Borrower[]> {
	const snapshot = await getDocs(query(collection(getFirebaseDb(), 'borrowers'), orderBy('created_at', 'desc')));
	return snapshot.docs.map((item) => mapBorrower(item.id, item.data()));
}

export async function createBorrower(input: Partial<Borrower>): Promise<Borrower> {
	const payload = {
		full_name: input.full_name?.trim() ?? '',
		student_id: input.student_id?.trim() ?? '',
		course: input.course?.trim() ?? '',
		year_level: input.year_level?.trim() ?? '',
		contact_number: input.contact_number?.trim() ?? ''
	};

	if (!payload.full_name || !payload.student_id || !payload.course || !payload.year_level || !payload.contact_number) {
		throw new Error('All borrower fields are required.');
	}

	const db = getFirebaseDb();
	const reference = doc(collection(db, 'borrowers'));
	const indexReference = doc(db, 'borrower_student_id_index', await firestoreIndexId(payload.student_id));
	const created_at = new Date().toISOString();
	const borrower: Borrower = { id: reference.id, ...payload, created_at };
	await runTransaction(db, async (transaction) => {
		const existingIndex = await transaction.get(indexReference);
		if (existingIndex.exists()) throw new Error('A borrower with this student ID already exists.');
		transaction.set(reference, { ...payload, created_at });
		transaction.set(indexReference, { borrower_id: reference.id, student_id: payload.student_id });
	});
	return borrower;
}

export async function updateBorrower(id: string, updates: Partial<Borrower>): Promise<Borrower> {
	const db = getFirebaseDb();
	const reference = doc(db, 'borrowers', id);
	return runTransaction(db, async (transaction) => {
		const snapshot = await transaction.get(reference);
		if (!snapshot.exists()) throw new Error('Borrower not found.');
		const existing = mapBorrower(snapshot.id, snapshot.data());
		const newIndexReference =
			updates.student_id !== undefined
				? doc(db, 'borrower_student_id_index', await firestoreIndexId(updates.student_id.trim()))
				: null;
		const oldIndexReference =
			updates.student_id !== undefined && updates.student_id.trim() !== existing.student_id
				? doc(db, 'borrower_student_id_index', await firestoreIndexId(existing.student_id))
				: null;
		const newIndexSnapshot = newIndexReference ? await transaction.get(newIndexReference) : null;
		const normalizedUpdates: Partial<Borrower> = {};
		for (const field of ['full_name', 'student_id', 'course', 'year_level', 'contact_number'] as const) {
			if (updates[field] !== undefined) normalizedUpdates[field] = updates[field]!.trim();
		}
		const updated = { ...existing, ...normalizedUpdates };
		if (
			!updated.full_name ||
			!updated.student_id ||
			!updated.course ||
			!updated.year_level ||
			!updated.contact_number
		) {
			throw new Error('All borrower fields are required.');
		}

		if (updated.student_id !== existing.student_id) {
			if (newIndexSnapshot?.exists() && newIndexSnapshot.data().borrower_id !== id) {
				throw new Error('A borrower with this student ID already exists.');
			}
		}

		transaction.set(reference, {
			full_name: updated.full_name,
			student_id: updated.student_id,
			course: updated.course,
			year_level: updated.year_level,
			contact_number: updated.contact_number,
			created_at: updated.created_at ?? new Date().toISOString()
		});
		if (newIndexReference && oldIndexReference) {
			transaction.delete(oldIndexReference);
			transaction.set(newIndexReference, { borrower_id: id, student_id: updated.student_id });
		}
		return updated;
	});
}

export async function deleteBorrower(id: string): Promise<void> {
	const db = getFirebaseDb();
	const reference = doc(db, 'borrowers', id);
	await runTransaction(db, async (transaction) => {
		const snapshot = await transaction.get(reference);
		if (!snapshot.exists()) throw new Error('Borrower not found.');
		const borrower = mapBorrower(snapshot.id, snapshot.data());
		const indexReference = doc(db, 'borrower_student_id_index', await firestoreIndexId(borrower.student_id));
		const indexSnapshot = await transaction.get(indexReference);
		transaction.delete(reference);
		if (indexSnapshot.exists() && indexSnapshot.data().borrower_id === id) transaction.delete(indexReference);
	});
}

export async function getBorrowerById(id: string): Promise<Borrower | null> {
	const snapshot = await getDoc(doc(getFirebaseDb(), 'borrowers', id));
	return snapshot.exists() ? mapBorrower(snapshot.id, snapshot.data()) : null;
}
