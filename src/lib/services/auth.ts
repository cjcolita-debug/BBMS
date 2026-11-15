import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from '#lib/firebase';

const browser = typeof window !== 'undefined';

export type SessionUser = {
	email: string;
	name: string;
};

export async function isAuthenticated() {
	if (!browser || !isFirebaseConfigured()) return false;
	const auth = getFirebaseAuth();
	const user = auth.currentUser;
	if (!user) return false;

	const admin = await getDoc(doc(getFirebaseDb(), 'admins', user.uid));
	if (admin.exists() && admin.data().active === true) return true;

	await firebaseSignOut(auth);
	return false;
}

export async function getCurrentUserEmail() {
	if (!browser || !isFirebaseConfigured()) return 'Signed out';
	return getFirebaseAuth().currentUser?.email ?? 'Signed out';
}

export async function signIn(email: string, password: string) {
	if (!email.trim() || !password.trim()) {
		throw new Error('Email and password are required.');
	}

	if (!isFirebaseConfigured()) {
		throw new Error('Firebase is not configured. Add the PUBLIC_FIREBASE_* values from your Firebase web app configuration.');
	}

	const auth = getFirebaseAuth();
	const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
	const admin = await getDoc(doc(getFirebaseDb(), 'admins', credential.user.uid));
	if (!admin.exists() || admin.data().active !== true) {
		await firebaseSignOut(auth);
		throw new Error('This Firebase account is not authorized to access the admin system.');
	}

	return {
		email: credential.user.email ?? email.trim(),
		name: credential.user.displayName ?? 'Admin User'
	} satisfies SessionUser;
}

export async function signOut() {
	if (!browser || !isFirebaseConfigured()) return;
	await firebaseSignOut(getFirebaseAuth());
}
