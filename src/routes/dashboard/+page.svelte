<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import StatCard from '#lib/components/StatCard.svelte';
	import { listBooks } from '#lib/services/books';
	import { listBorrowers } from '#lib/services/borrowers';
	import { listTransactions } from '#lib/services/transactions';
	import type { Book, Borrower, BorrowingTransaction } from '#lib/types';
	import { getCurrentUserEmail } from '#lib/services/auth';

	let books: Book[] = $state([]);
	let borrowers: Borrower[] = $state([]);
	let transactions: BorrowingTransaction[] = $state([]);
	let loading = $state(true);
	let userEmail = $state('');
	let databaseError = $state<string | null>(null);
	let dateLabel = $state('');

	onMount(async () => {
		dateLabel = new Date().toLocaleDateString(undefined, {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
		userEmail = await getCurrentUserEmail();
		try {
			const [bookList, borrowerList, txList] = await Promise.all([listBooks(), listBorrowers(), listTransactions()]);
			books = bookList;
			borrowers = borrowerList;
			transactions = txList;
		} catch (error) {
			databaseError = error instanceof Error ? error.message : 'Unable to load dashboard data.';
		} finally {
			loading = false;
		}
	});

	let totalBooks = $derived(books.length);
	let availableBooks = $derived(books.reduce((sum, book) => sum + Number(book.available_quantity ?? 0), 0));
	let borrowedBooks = $derived(
		books.reduce((sum, book) => sum + Math.max(0, Number(book.quantity ?? 0) - Number(book.available_quantity ?? 0)), 0)
	);
	let unreturnedBooks = $derived(transactions.filter((tx) => !tx.returned_at).length);
	let recentTransactions = $derived(transactions.slice(0, 5));
</script>

<svelte:head>
	<title>BBMS | Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-slate-100 p-4 dark:bg-slate-950 lg:p-6">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-4 lg:grid-cols-[260px_1fr]">
			<div class="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
				<Sidebar userEmail={userEmail} />
			</div>

			<main class="space-y-6">
				<header class="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p class="text-sm uppercase tracking-[0.2em] text-slate-400">Overview</p>
						<h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
					</div>
					<div class="rounded-xl bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-200">
						{dateLabel}
					</div>
				</header>

				{#if loading}
					<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Loading dashboard data...</div>
				{:else if databaseError}
					<div class="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200">
						<strong>Unable to load dashboard:</strong> {databaseError}
					</div>
				{:else}
					<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						<StatCard label="Total Books" value={totalBooks} icon="📚" tone="primary" />
						<StatCard label="Available Books" value={availableBooks} icon="✅" tone="success" />
						<StatCard label="Borrowed Books" value={borrowedBooks} icon="📖" tone="info" />
						<StatCard label="Unreturned Books" value={unreturnedBooks} icon="⚠️" tone="warning" />
					</div>

					<div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
						<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<div class="mb-4 flex items-center justify-between">
								<h2 class="text-xl font-bold text-slate-900 dark:text-white">Recent Borrowing Transactions</h2>
								<a href="/transactions" class="text-sm font-medium text-sky-600 hover:text-sky-500">View all</a>
							</div>
							<div class="space-y-3">
								{#each recentTransactions as tx}
									<div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
										<div>
											<p class="font-semibold text-slate-900 dark:text-white">{tx.books?.title ?? 'Unknown book'}</p>
											<p class="text-sm text-slate-500 dark:text-slate-400">{tx.borrowers?.full_name ?? 'Unknown borrower'} • {new Date(tx.borrowed_at).toLocaleDateString()}</p>
										</div>
										<span class={`rounded-full px-2.5 py-1 text-xs font-semibold ${tx.status === 'returned' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : tx.status === 'overdue' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'}`}>
											{tx.status}
										</span>
									</div>
								{:else}
									<p class="text-sm text-slate-500 dark:text-slate-400">No borrowing activity yet.</p>
								{/each}
							</div>
						</section>

						<aside class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<h2 class="text-xl font-bold text-slate-900 dark:text-white">Library Snapshot</h2>
							<div class="mt-5 space-y-4">
								<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
									<p class="text-sm text-slate-500 dark:text-slate-400">Borrowers</p>
									<p class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{borrowers.length}</p>
								</div>
								<div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
									<p class="text-sm text-slate-500 dark:text-slate-400">Pending Returns</p>
									<p class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{transactions.filter((tx) => !tx.returned_at).length}</p>
								</div>
							</div>
						</aside>
					</div>
				{/if}
			</main>
		</div>
	</div>
</div>
