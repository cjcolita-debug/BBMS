<div align="center">

# BBMS

### Book Borrowing Management System

**A streamlined workspace for managing a library catalog, borrowers, and book circulation.**

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=111827)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-111827?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22-2563EB?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

<br />

[![LIVE DEMO — replace with production URL](https://img.shields.io/badge/LIVE_DEMO-Replace_with_production_URL-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://bbms-one.vercel.app/)

> **Live site:** The repository contains Vercel project-link metadata, but no production hostname. Replace the placeholder URL above with the deployed domain when available.

</div>

---

## Project Overview

BBMS brings the day-to-day essentials of book circulation into one place. Library staff can maintain a searchable catalog, keep borrower records, and track each book from checkout through return. The dashboard provides a quick view of collection availability and recent activity.

The application is built with **SvelteKit** and **TypeScript**, with **Cloud Firestore** as its data store. Its Firestore rules validate admin access and protect inventory and transaction updates.

> **Current authentication note:** The current landing page redirects directly to the dashboard; it does not display a sign-in form. Firestore rules still require a Firebase-authenticated user whose `admins/{uid}` document has `active: true`. Database operations will be denied unless an authorized session is available. Set up or restore an authentication flow before using this app with real data.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Installation Guide](#installation-guide)
- [How to Run Locally](#how-to-run-locally)
- [Firebase Configuration](#firebase-configuration)
- [Verification Checklist](#verification-checklist)
- [Vercel Deployment](#vercel-deployment)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Features

| Area | What you can do |
| --- | --- |
| **📊 Dashboard** | Review total, available, and borrowed book counts; see pending returns and recent borrowing activity. |
| **📚 Book catalog** | Add, edit, delete, and search books by title, author, ISBN, or category. Track total and available quantities. |
| **👥 Borrowers** | Add, edit, delete, and search borrower records, including student ID and contact details. |
| **🔄 Circulation** | Record a borrowing with a due date, then mark the book returned. Inventory is adjusted as part of the Firestore transaction. |
| **⏰ Status tracking** | View borrowed, returned, and overdue transactions; overdue status is calculated from the due date. |
| **🛡️ Data validation** | Prevent duplicate ISBNs and student IDs, invalid inventory values, and deleting books with outstanding copies. |
| **🔐 Firestore rules** | Restrict reads and writes to authenticated admins with an active allow-list document; enforce valid data and circulation updates. |

---

## Technologies Used

<div align="center">

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=111827)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-111827?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

| Technology | Role in BBMS |
| --- | --- |
| SvelteKit and Svelte | Application framework and UI |
| TypeScript | Typed application code |
| Tailwind CSS | Utility-first styling |
| Firebase Authentication | Authentication integration used by the app and Firestore rules |
| Cloud Firestore | Persistent book, borrower, index, and transaction data |
| Vite | Development server and build tooling |
| Vercel adapter | SvelteKit deployment target |
| Node.js 22 and npm | Runtime and package management |
| Firebase CLI and Firestore Emulator | Firestore rules tests and rules deployment |

---

## Screenshots

There are no application screenshots checked into this repository yet. Add genuine captures here when available; no placeholder or generated application imagery is used.

| Dashboard | Books | Borrowing transactions |
| --- | --- | --- |
| _Screenshot coming soon_ | _Screenshot coming soon_ | _Screenshot coming soon_ |

---

## Installation Guide

### Prerequisites

- [Node.js 22.x](https://nodejs.org/) and npm
- A Firebase project with a registered Web app and Cloud Firestore database
- Firebase CLI access if you plan to deploy Firestore rules or run emulator tests

### 1. Get the project

```bash
git clone <your-repository-url>
cd BBMS
```

Replace `<your-repository-url>` with the clone URL for your repository.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Copy the example environment file and add the Firebase Web app configuration values:

```bash
cp .env.example .env
```

See [Firebase Configuration](#firebase-configuration) for the required variable names and security notes.

---

## How to Run Locally

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

### Check, test, and build

```bash
npm run check
npm run test:firestore
npm run build
```

`npm run test:firestore` starts the Firestore Emulator using the demo project ID and runs the Node.js test files in `tests/`. It does not target your configured Firebase project.

---

## Firebase Configuration

BBMS initializes **Firebase Authentication** and **Cloud Firestore** in the browser. Firestore stores the `books`, `borrowers`, and `borrowing_transactions` collections, along with `book_isbn_index` and `borrower_student_id_index` documents used to enforce uniqueness.

Borrowing records include book and borrower snapshots so transaction details remain available if a related catalog record is deleted. Borrow and return operations update inventory and transaction data atomically through Firestore transactions. A book with copies currently on loan cannot be deleted.

Set these variables in the root `.env` file for local development. Add the same variables to the Vercel project environment for deployed builds:

| Variable | Value |
| --- | --- |
| `PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Web app auth domain |
| `PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | Web app storage bucket |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Web app messaging sender ID |
| `PUBLIC_FIREBASE_APP_ID` | Firebase Web app ID |

Example format:

```env
PUBLIC_FIREBASE_API_KEY="your-firebase-web-api-key"
PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
PUBLIC_FIREBASE_APP_ID="your-firebase-web-app-id"
```

Use the exact values from **Firebase Console → Project settings → Your apps**. These `PUBLIC_` values are client-side Firebase configuration, not authorization secrets. **Never add a Firebase service-account key or other server credential to this client application or to a `PUBLIC_` variable.**

### Firestore access setup

The repository's [Firestore rules](./firestore.rules) require a signed-in Firebase user and an `admins/{uid}` document with the Boolean field `active` set to `true`. Admin documents cannot be created or edited through the app; provision them through a trusted administrative process.

For a Firebase project:

1. Register a Web app in Firebase Console and create a Cloud Firestore database in **production mode**.
2. Enable **Email/Password** in **Authentication → Sign-in method** if that is the authentication method you configure.
3. Create an authorized Firebase Authentication user, then copy their UID.
4. In Firestore, create an `admins` document whose document ID is that UID and whose `active` field is the Boolean `true`.
5. Deploy this repository's rules before using the database.

Deploy the rules with Firebase CLI:

```bash
firebase deploy --only firestore:rules --project <FIREBASE_PROJECT_ID>
```

The current UI does not provide sign-in, even though Firebase Authentication integration and admin-protected rules remain in the project. Without an authorized Firebase session, Firestore requests will fail. Configure or restore a suitable sign-in flow before connecting production data.

The repository does not migrate Supabase data or accounts to Firebase. Any existing Supabase projects, data, and accounts are separate and are not changed by these instructions; Firebase users need their own Firebase accounts.

## Verification Checklist

After Firebase, Firestore rules, and an authorized session are configured:

1. Confirm Firestore requests are denied without an authenticated active admin.
2. Add, edit, search, and delete a book and a borrower.
3. Borrow a book and verify available quantity decreases and the transaction is recorded.
4. Try to borrow the last copy more than once and confirm available inventory never drops below zero.
5. Return the transaction and confirm inventory is restored once; verify a second return is rejected.
6. Confirm a book with outstanding loans cannot be deleted and transaction snapshots remain available if related records are removed.

---

## Vercel Deployment

The project uses `@sveltejs/adapter-vercel` with the Node.js 22 runtime.

1. Push the repository to GitHub.
2. In [Vercel](https://vercel.com/), choose **Add New → Project** and import the repository.
3. Add all six `PUBLIC_FIREBASE_*` variables in **Project Settings → Environment Variables** for the environments you intend to deploy.
4. Confirm the Firebase project and Firestore rules are configured, and that an authorized sign-in flow is available before using real data.
5. Deploy. Vercel builds the project using its configured SvelteKit adapter.
6. Add the resulting production hostname to the **LIVE DEMO** button at the top of this README.

> **Production URL:** Not present in the repository's deployment metadata. Replace the live-demo placeholder with the actual Vercel production URL once confirmed in the Vercel project dashboard.

---

## Project Structure

```text
.
├── .env.example
├── firebase.json
├── firestore.rules
├── package.json
├── package-lock.json
├── README.md
├── static/
│   └── robots.txt
├── src/
│   ├── app.d.ts
│   ├── app.html
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   ├── components/
│   │   │   ├── Sidebar.svelte
│   │   │   └── StatCard.svelte
│   │   ├── services/
│   │   │   ├── auth.ts
│   │   │   ├── books.ts
│   │   │   ├── borrowers.ts
│   │   │   ├── firestore-utils.ts
│   │   │   ├── sample-books.ts
│   │   │   ├── storage.ts
│   │   │   └── transactions.ts
│   │   ├── auth-config.ts
│   │   ├── firebase.ts
│   │   ├── index.ts
│   │   ├── mock-data.ts
│   │   ├── sample-books-data.mjs
│   │   ├── toast.ts
│   │   └── types.ts
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── books/
│       │   └── +page.svelte
│       ├── borrowers/
│       │   └── +page.svelte
│       ├── dashboard/
│       │   └── +page.svelte
│       ├── transactions/
│       │   └── +page.svelte
│       └── layout.css
├── supabase/
│   └── migrations/
├── tests/
│   ├── firestore-rules.test.mjs
│   └── sample-books-data.test.mjs
├── tsconfig.json
└── vite.config.ts
```

---

## Author

**Cris Feljhon Colita**

---

<div align="center">

Built for clearer catalog management and smoother book circulation.

<a href="#bbms">↑ Back to Top</a>

</div>
