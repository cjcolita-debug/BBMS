# BBMS

Book Borrowing Management System

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> [Visit Live Website](https://your-project-name.vercel.app)  
> Replace this placeholder with your actual Vercel production URL before publishing.

## Project Overview

BBMS is a library and circulation management application built with SvelteKit and Firebase. It helps library staff manage the catalog, track borrowers, and record book borrowing and return activity with inventory validation and audit-friendly transaction history.

This project is configured for Vercel deployment and uses Firebase Authentication plus Cloud Firestore for user access and data persistence.

## Live Website

- Production URL: [Visit Live Website](https://your-project-name.vercel.app)
- Note: The exact Vercel production URL was not available in this repository, so the link above is a clear placeholder for you to replace with the correct deployment URL.

## Features

- Manage a book catalog with title, author, ISBN, category, quantity, and description
- Prevent duplicate ISBN values and validate quantity constraints
- Maintain borrower records with unique student IDs
- Record borrowing transactions with due dates and return status tracking
- Automatically update available inventory when books are borrowed or returned
- Detect overdue transactions based on the current date
- Search and filter books, borrowers, and borrowing records
- Dashboard summary for total books, available inventory, borrowed items, and recent activity
- Admin-only access flow using Firebase Authentication
- Responsive interface for desktop library workflows

## Technologies Used

| Technology | Purpose |
| --- | --- |
| SvelteKit | Frontend application framework |
| TypeScript | Type-safe application logic |
| Firebase Authentication | Admin sign-in and access control |
| Cloud Firestore | Database for books, borrowers, and transactions |
| Vercel | Hosting and deployment |
| Tailwind CSS | Styling and layout |
| Node.js 22 | Local runtime |
| Firebase CLI | Local Firestore emulation and rules deployment |

## Installation Guide

### Prerequisites

Before you begin, make sure you have the following installed:

- Node.js 22.x
- npm
- A Firebase project with Firestore enabled
- A Firebase web app configured for client access

### Steps

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd BBMS
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

4. Add your Firebase web configuration values to the `.env` file.

5. Set up Firebase Authentication and Firestore according to your project requirements.

## How to Run Locally

Run the app in development mode:

```bash
npm run dev
```

Then open the local address shown in the terminal, usually:

```text
http://localhost:5173
```

### Useful validation commands

```bash
npm run check
npm run test:firestore
npm run build
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PUBLIC_FIREBASE_API_KEY="your-firebase-web-api-key"
PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
PUBLIC_FIREBASE_APP_ID="your-firebase-web-app-id"
```

### Notes

- These are Firebase client configuration variables for the web app.
- Do not put Firebase admin/service-account credentials into a `PUBLIC_` variable.
- Values should match your Firebase project configuration exactly.

## Deployment Guide (Vercel)

This repository is set up for Vercel deployment using the SvelteKit Vercel adapter.

### Deploy to Vercel

1. Push the project to GitHub.
2. Sign in to Vercel and import the repository.
3. Select the project and choose the correct framework settings if prompted.
4. Add the environment variables listed above in the Vercel project settings:
   - Project Settings → Environment Variables
   - Add them for Development, Preview, and Production as needed.
5. Deploy the project.
6. Confirm the live URL works and the app loads correctly.

### Firebase setup for production

Before using the app in a deployed environment:

1. Enable Email/Password sign-in in Firebase Authentication.
2. Create a Firestore database in production mode.
3. Deploy the Firestore rules from this project.
4. Add admin users to the `admins` collection in Firestore and mark them active.

Example deployment command:

```bash
firebase deploy --only firestore:rules --project <FIREBASE_PROJECT_ID>
```

## Screenshots

This section is ready for project screenshots.

> Add screenshots of the dashboard, books page, borrowers page, and transaction workflow here as the app is finalized.

Example:

```md
![Dashboard Screenshot](./assets/screenshots/dashboard.png)
![Books Page Screenshot](./assets/screenshots/books.png)
![Transactions Page Screenshot](./assets/screenshots/transactions.png)
```

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── .vercel/
├── firebase.json
├── firestore.rules
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── lib/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── services/
│   │   ├── auth-config.ts
│   │   ├── firebase.ts
│   │   ├── index.ts
│   │   ├── toast.ts
│   │   └── types.ts
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── books/
│       ├── borrowers/
│       ├── dashboard/
│       ├── layout.css
│       └── transactions/
├── static/
│   └── robots.txt
├── supabase/
│   └── migrations/
├── tests/
│   ├── firestore-rules.test.mjs
│   └── sample-books-data.test.mjs
└── node_modules/
```

## Author

Cris Feljhon Colita

---

This README is maintained for the BBMS project and reflects the current structure and setup used in the repository.
