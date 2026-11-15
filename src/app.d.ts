declare module '$app/env' {
	export const browser: boolean;
	export const dev: boolean;
	export const building: boolean;
	export const version: string;
}

declare module '$app/environment' {
	export const browser: boolean;
	export const dev: boolean;
	export const building: boolean;
	export const version: string;
}

interface ImportMetaEnv {
	readonly BASE_URL: string;
	readonly MODE: string;
	readonly DEV: boolean;
	readonly PROD: boolean;
	readonly SSR: boolean;
	readonly PUBLIC_FIREBASE_API_KEY?: string;
	readonly PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
	readonly PUBLIC_FIREBASE_PROJECT_ID?: string;
	readonly PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
	readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
	readonly PUBLIC_FIREBASE_APP_ID?: string;
	readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
