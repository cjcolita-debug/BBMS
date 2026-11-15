# Book Borrowing Management System

SvelteKit app for managing a library catalog, borrowers, and borrowing/return transactions. The production adapter targets Vercel. Firebase Authentication handles admin sign-in and Cloud Firestore stores library data.

## Firebase Console setup

1. Create or select a Firebase project and register a Web app in Project settings.
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. In **Authentication → Users**, create a new account for each administrator. Supabase Authentication accounts and passwords are not transferred or changed; administrators must use the Firebase account credentials.
4. Create a Cloud Firestore database in **production mode**. Do not enable public/test access.
5. Deploy the repository's Firestore rules before using the app:

   ```sh
   firebase deploy --only firestore:rules --project <FIREBASE_PROJECT_ID>
   ```

   Install the Firebase CLI if needed and authenticate it with an account that can deploy rules to the project. The command only deploys Firestore rules; it does not deploy this app or change Supabase resources.
6. For each Firebase administrator, copy the user's **UID** from Authentication → Users. In Firestore, create a collection named `admins`; add a document whose document ID is exactly that UID and whose field is `active` with boolean value `true`. Admin documents are not writable through the app. Only the matching authenticated user can read their own allow-list document.

The app manages these collections: `books`, `borrowers`, and `borrowing_transactions`. It also uses `book_isbn_index` and `borrower_student_id_index` to enforce unique ISBN and student ID values atomically. Borrowing transactions include book and borrower snapshots so historical display information remains available if a related catalog record is deleted. A book with borrowed copies cannot be deleted. Borrow and return operations update inventory and transaction records in Firestore transactions.

This project has no existing Supabase book or borrowing records to migrate. Supabase data, projects, and accounts are not automatically deleted, modified, or imported. Firebase Auth users are separate accounts and require new credentials.

## Local development

Use Node.js 22. Add the six Firebase Web app configuration values to your existing `.env` file (or copy `.env.example` if creating a new one):

```env
PUBLIC_FIREBASE_API_KEY="..."
PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
PUBLIC_FIREBASE_APP_ID="..."
```

Use the exact values shown for your Web app in Firebase Console; the storage bucket format may vary by project. These are Firebase client configuration values, not Admin credentials. Never put a Firebase service-account key in this app, a `PUBLIC_` variable, or Vercel's client environment.

Then install dependencies and start the app:

```sh
npm install
npm run dev
```

Validate changes before deployment:

```sh
npm run test:firestore
npm run check
npm run build
```

The Firestore rules test starts a demo-project emulator; Firebase CLI is included as a development dependency. It does not connect to or modify the configured Firebase or Supabase projects.

## Vercel

Keep the existing SvelteKit Vercel adapter and deployment configuration. In Vercel project settings, add the six `PUBLIC_FIREBASE_*` variables above to each required Development, Preview, and Production environment. Use the same Firebase project for each environment only if that is intended; separate Preview projects are recommended when preview data should be isolated. Redeploy a preview only after rules, admin access, and functionality are verified. No production deploy is performed by these instructions.

Firebase Web app configuration is public by design. Firestore Security Rules and the Firebase Auth UID allow-list protect the data; never rely on hiding the API key as authorization.

## Functional verification checklist

After setting the local environment, deploying rules, and creating the admin allow-list document:

1. Sign in with an authorized Firebase administrator; confirm an account without an active `admins/{uid}` document is denied.
2. Add a book and borrower; edit each, search for them, and delete them.
3. Borrow a book; confirm its available quantity decreases and its transaction appears with borrower/book details.
4. Attempt to borrow the last available copy twice; confirm inventory never goes below zero.
5. Return the transaction; confirm available quantity increases once, returned date/status are recorded, and a second return is rejected.
6. Confirm a book with an outstanding loan cannot be deleted and old transactions remain readable after related borrower/catalog records are deleted.
