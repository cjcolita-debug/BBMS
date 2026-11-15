<div align="center">

# BBMS

### Book Borrowing Management System

An intuitive library operations workspace for organizing books, borrowers, and borrowing activity.

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=111827)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-142B4A?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Node.js 22](https://img.shields.io/badge/Node.js-22-2563EB?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

<br />

<a href="https://bbms-one.vercel.app/">
  <img src="https://img.shields.io/badge/%F0%9F%9A%80%20VISIT%20LIVE%20WEBSITE-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="🚀 VISIT LIVE WEBSITE" />
</a>

<br />

**Production:** [bbms-one.vercel.app](https://bbms-one.vercel.app/)

</div>

---

## Table of Contents

- [Live Website](#live-website)
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Firebase Configuration](#firebase-configuration)
- [Project Structure](#project-structure)
- [Deployment to Vercel](#deployment-to-vercel)
- [Checks and Tests](#checks-and-tests)
- [Author](#author)

---

## Live Website

| | |
| --- | --- |
| **Website** | BBMS |
| **Production URL** | [https://bbms-one.vercel.app/](https://bbms-one.vercel.app/) |
| **Hosting platform** | [Vercel](https://vercel.com/) |
| **Live demo** | [🚀 Visit the BBMS website](https://bbms-one.vercel.app/) |

## Project Overview

BBMS is a browser-based system for managing common library circulation tasks. It brings the book catalog, borrower records, and borrowing transactions into one workspace. Staff can check availability, record due dates and returns, and review recent activity from the dashboard.

The application is built with SvelteKit and TypeScript. Firebase Cloud Firestore stores the library records, and Firestore rules restrict access to signed-in users listed as active administrators.

> **Authentication status:** Firebase sign-in logic and admin access rules exist in the source, but authentication is currently disabled in the application UI and there is no sign-in page. The Firestore rules still require an authenticated active admin. Configure an appropriate sign-in flow before connecting the app to real library data.

## Features

| Area | Implemented capabilities |
| --- | --- |
| **📊 Dashboard** | View catalog record count, available and borrowed copy totals, unreturned loans, borrower count, and up to five recent transactions. |
| **📚 Book catalog** | Add, edit, delete, and search books by title, author, ISBN, or category. Track total and available quantities. Deletion is blocked while copies are on loan. |
| **👥 Borrowers** | Add, edit, delete, and search borrower records by name, student ID, course, or contact number. |
| **🔄 Circulation** | Record a borrowing with a due date, then mark the book returned. Book inventory and transaction records are updated atomically in Firestore. |
| **⏰ Loan statuses** | Review borrowed, returned, and overdue records. Unreturned loans become overdue based on their due date. |
| **🛡️ Data safeguards** | Validate required fields and inventory quantities, prevent duplicate ISBNs and student IDs, and protect Firestore collections with admin-only rules. |

## Technologies

<div align="center">

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=111827)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-142B4A?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22-2563EB?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

| Technology | Role |
| --- | --- |
| **SvelteKit & Svelte 5** | Application framework and reactive user interface |
| **TypeScript** | Typed application code |
| **Tailwind CSS** | Utility-first styling |
| **Firebase Authentication** | Authentication integration in the source; currently disabled in the UI |
| **Cloud Firestore** | Persistent catalog, borrower, and transaction data with security rules |
| **Vite** | Development server and build tooling |
| **Vercel adapter** | SvelteKit deployment on Vercel with the Node.js 22 runtime |
| **Node.js 22 & npm** | Supported runtime and package management |

## Screenshots

There are no application screenshots checked into the repository yet. This section is intentionally kept free of placeholder images so the README does not display misleading or broken screenshots.

## Getting Started

### Prerequisites

- [Node.js 22.x](https://nodejs.org/) and npm
- A Firebase project with a registered Web app and Cloud Firestore database
- Firebase CLI access if you plan to deploy Firestore rules or run the Firestore Emulator tests

### 1. Clone the repository

Use your repository's Git clone URL:

```bash
git clone <repository-url> BBMS
cd BBMS
```

Replace `<repository-url>` with the clone URL for your GitHub repository.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a local environment file from the checked-in example:

```bash
cp .env.example .env
```

Add your Firebase Web app configuration values to `.env`. See [Firebase Configuration](#firebase-configuration) for the variable list and access requirements.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite (typically [http://localhost:5173](http://localhost:5173)).

### 5. Build for production

```bash
npm run build
```

To serve the production build locally, run `npm run preview`.

## Firebase Configuration

BBMS uses **Cloud Firestore** for the `books`, `borrowers`, and `borrowing_transactions` collections. It also uses `book_isbn_index` and `borrower_student_id_index` documents to prevent duplicate ISBNs and student IDs. **Firebase Authentication** is included in the application code; authentication is currently disabled in the UI. Firebase Storage is not used by the current application.

Set these variables in the root `.env` file for local development and in the Vercel project's environment settings for deployments:

| Variable | Firebase Web app value |
| --- | --- |
| `PUBLIC_FIREBASE_API_KEY` | API key |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `PUBLIC_FIREBASE_PROJECT_ID` | Project ID |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket configuration value |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `PUBLIC_FIREBASE_APP_ID` | App ID |

Use the values shown in **Firebase Console → Project settings → Your apps**. The `.env.example` file shows the expected format. These `PUBLIC_` values are client-side Firebase configuration, not authorization secrets. Never put a service-account key, private credential, or server secret in the application or in a `PUBLIC_` variable.

### Firestore access

The rules in [`firestore.rules`](./firestore.rules) require a signed-in Firebase user whose `admins/{uid}` document has the Boolean field `active` set to `true`. Admin documents cannot be created or changed by the application; provision them through a trusted administrative process.

1. Register a Firebase Web app and create a Cloud Firestore database in production mode.
2. Create and enable an authentication method in Firebase Console if you have configured a sign-in flow.
3. Create an authorized Firebase Authentication user and note the user's UID.
4. Create an `admins` Firestore document with that UID as its document ID and `active` set to the Boolean `true`.
5. Deploy the Firestore rules before connecting the application to that database.

Deploy rules with the Firebase CLI:

```bash
firebase deploy --only firestore:rules --project <FIREBASE_PROJECT_ID>
```

The current UI does not provide sign-in, so Firestore requests will be rejected unless a valid authorized session is supplied. Add or restore a suitable sign-in flow before using real data.

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── .npmrc
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

## Deployment to Vercel

The project is configured with `@sveltejs/adapter-vercel` and the Node.js 22 runtime.

1. Push the repository to GitHub.
2. In [Vercel](https://vercel.com/), select **Add New → Project** and import the repository.
3. Add all six `PUBLIC_FIREBASE_*` variables in **Project Settings → Environment Variables** for each environment you plan to deploy.
4. Confirm the Firebase project and Firestore rules are configured. Add a suitable sign-in flow before using the live app with real data.
5. Deploy. Vercel will build the SvelteKit application using its configured adapter.
6. To update the production website, push a commit to the connected GitHub branch; Vercel will create a deployment from the updated source.

**Official production website:** [https://bbms-one.vercel.app/](https://bbms-one.vercel.app/)

## Checks and Tests

Run the TypeScript and Svelte checks:

```bash
npm run check
```

Run the Firestore rules and sample catalog tests in the Firebase Emulator:

```bash
npm test
```

The `npm test` command runs `npm run test:firestore`, which starts the Firestore Emulator with the demo project ID `demo-bbms` and executes the tests in `tests/`. It does not use or modify your configured Firebase project.

## Author

**Cris Feljhon Colita**

---

<div align="center">

**BBMS — Book Borrowing Management System**

Built to make library catalog management and book circulation easier to follow.

[↑ Back to Top](#bbms) · [Visit the live website](https://bbms-one.vercel.app/)

</div>
