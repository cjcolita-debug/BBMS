import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const publicEnv = import.meta.env as ImportMetaEnv;

const firebaseConfig = {
	apiKey: publicEnv.PUBLIC_FIREBASE_API_KEY?.trim() ?? '',
	authDomain: publicEnv.PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? '',
	projectId: publicEnv.PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? '',
	storageBucket: publicEnv.PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ?? '',
	messagingSenderId: publicEnv.PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? '',
	appId: publicEnv.PUBLIC_FIREBASE_APP_ID?.trim() ?? ''
};

const requiredVariables = [
	['PUBLIC_FIREBASE_API_KEY', firebaseConfig.apiKey],
	['PUBLIC_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain],
	['PUBLIC_FIREBASE_PROJECT_ID', firebaseConfig.projectId],
	['PUBLIC_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket],
	['PUBLIC_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId],
	['PUBLIC_FIREBASE_APP_ID', firebaseConfig.appId]
] as const;

const missingVariables = requiredVariables.filter(([, value]) => !value).map(([name]) => name);

export const firebaseConfigDiagnostics = {
	configured: missingVariables.length === 0,
	missingVariables
};

function getFirebaseApp(): FirebaseApp {
	if (!firebaseConfigDiagnostics.configured) {
		throw new Error(`Firebase is not configured. Set ${missingVariables.join(', ')} in your environment.`);
	}

	return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
	if (typeof window === 'undefined') {
		throw new Error('Firebase Authentication is only available in the browser.');
	}
	return getAuth(getFirebaseApp());
}

export function getFirebaseDb(): Firestore {
	return getFirestore(getFirebaseApp());
}

export function isFirebaseConfigured() {
	return firebaseConfigDiagnostics.configured;
}
