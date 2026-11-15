<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import { getCurrentUserEmail } from '#lib/services/auth';
	import { listBooks } from '#lib/services/books';
	import { listBorrowers } from '#lib/services/borrowers';
	import { createBorrowing, listTransactions, returnBorrowing } from '#lib/services/transactions';
	import type { Book, Borrower, BorrowingTransaction } from '#lib/types';
	import { showToast } from '#lib/toast';

	let books: Book[] = $state([]);
	let borrowers: Borrower[] = $state([]);
	let transactions: BorrowingTransaction[] = $state([]);
	let loading = $state(true);
	let saving = $state(false);
	let returningId = $state<string | null>(null);
	let userEmail = $state('');
	let databaseError = $state<string | null>(null);
	let form = $state({ borrower_id: '', book_id: '', due_date: '' });
	let search = $state('');
	let statusFilter = $state('all');

	function formatDate(value: string) {
		const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
		return date.toLocaleDateString();
	}

	onMount(async () => {
		userEmail = await getCurrentUserEmail();
		await loadData();
	});

	async function loadData() {
		loading = true;
		databaseError = null;
		try {
			const [bookList, borrowerList, txList] = await Promise.all([listBooks(), listBorrowers(), listTransactions()]);
			books = bookList;
			borrowers = borrowerList;
			transactions = txList;
		} catch (error) {
			databaseError = error instanceof Error ? error.message : 'Unable to load transaction data.';
		} finally {
			loading = false;
		}
	}

	let filteredTransactions = $derived(
		transactions.filter((tx) => {
			const query = search.toLowerCase();
			const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
			const matchesSearch =
				!query ||
				[tx.borrowers?.full_name, tx.books?.title, tx.books?.author, tx.borrower_id, tx.book_id].join(' ').toLowerCase().includes(query);
			return matchesStatus && matchesSearch;
		})
	);

	async function submitBorrowing(event: SubmitEvent) {
		event.preventDefault();
		if (!form.borrower_id || !form.book_id || !form.due_date) {
			showToast('error', 'Validation error', 'Please select a borrower, book, and due date.');
			return;
		}
		saving = true;
		try {
			await createBorrowing(form);
			showToast('success', 'Book borrowed', 'The transaction was recorded successfully.');
			form = { borrower_id: '', book_id: '', due_date: '' };
			await loadData();
		} catch (error) {
			showToast('error', 'Borrow failed', error instanceof Error ? error.message : 'Unable to create borrowing record.');
		} finally {
			saving = false;
		}
	}

	async function handleReturn(transactionId: string) {
		const confirmed = window.confirm('Mark this borrowing as returned?');
		if (!confirmed) return;
		returningId = transactionId;
		try {
			await returnBorrowing(transactionId);
			showToast('success', 'Book returned', 'The item was marked returned and inventory was restored.');
			await loadData();
		} catch (error) {
			showToast('error', 'Return failed', error instanceof Error ? error.message : 'Unable to update return status.');
		} finally {
			returningId = null;
		}
	}
</script>

<svelte:head>
	<title>BBMS | Transactions</title>
</svelte:head>

<div class="min-h-screen bg-slate-100 p-4 dark:bg-slate-950 lg:p-6">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-4 lg:grid-cols-[260px_1fr]">
			<div class="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
				<Sidebar userEmail={userEmail} />
			</div>

			<main class="space-y-6">
				<header class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p class="text-sm uppercase tracking-[0.2em] text-slate-400">Circulation</p>
						<h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Borrowing Transactions</h1>
					</div>
				</header>

				<form class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" onsubmit={submitBorrowing}>
					<div class="mb-5 grid gap-4 md:grid-cols-3">
						<select bind:value={form.borrower_id} required class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
							<option value="">Select borrower</option>
							{#each borrowers as borrower}
								<option value={borrower.id}>{borrower.full_name}</option>
							{/each}
						</select>
						<select bind:value={form.book_id} required class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
							<option value="">Select book</option>
							{#each books.filter((book) => book.available_quantity > 0) as book}
								<option value={book.id}>{book.title} ({book.available_quantity} available)</option>
							{/each}
						</select>
						<input bind:value={form.due_date} type="date" required class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
					</div>
					<div class="flex justify-end">
						<button type="submit" disabled={saving || loading} class="rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white disabled:opacity-70">{saving ? 'Processing...' : 'Record Borrowing'}</button>
					</div>
				</form>

				<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<input bind:value={search} class="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Search transactions..." />
						<select bind:value={statusFilter} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
							<option value="all">All statuses</option>
							<option value="borrowed">Borrowed</option>
							<option value="returned">Returned</option>
							<option value="overdue">Overdue</option>
						</select>
					</div>

					{#if loading}
						<p class="text-slate-500 dark:text-slate-400">Loading transactions...</p>
					{:else if databaseError}
						<div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200">
							<strong>Database error:</strong> {databaseError}
							<button type="button" class="ml-3 font-semibold underline" onclick={loadData}>Retry</button>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="min-w-full text-left text-sm">
								<thead>
									<tr class="text-slate-500 dark:text-slate-400">
										<th class="py-3 pr-4">Borrower</th>
										<th class="py-3 pr-4">Book</th>
										<th class="py-3 pr-4">Borrowed</th>
										<th class="py-3 pr-4">Due</th>
										<th class="py-3 pr-4">Return</th>
										<th class="py-3 pr-4">Status</th>
										<th class="py-3 pr-4">Action</th>
									</tr>
								</thead>
								<tbody>
									{#each filteredTransactions as tx}
										<tr class="border-t border-slate-200 dark:border-slate-700">
											<td class="py-3 pr-4 font-semibold text-slate-900 dark:text-white">{tx.borrowers?.full_name ?? 'Unknown'}</td>
											<td class="py-3 pr-4">{tx.books?.title ?? 'Unknown'}</td>
											<td class="py-3 pr-4">{formatDate(tx.borrowed_at)}</td>
											<td class="py-3 pr-4">{formatDate(tx.due_date)}</td>
											<td class="py-3 pr-4">{tx.returned_at ? formatDate(tx.returned_at) : '—'}</td>
											<td class="py-3 pr-4">
												<span class={`rounded-full px-2.5 py-1 text-xs font-semibold ${tx.status === 'returned' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : tx.status === 'overdue' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'}`}>
													{tx.status}
												</span>
											</td>
											<td class="py-3 pr-4">
												{#if !tx.returned_at}
													<button type="button" disabled={returningId === tx.id} class="rounded-lg bg-emerald-100 px-2.5 py-1.5 text-emerald-700 disabled:opacity-60 dark:bg-emerald-900/40 dark:text-emerald-200" onclick={() => handleReturn(tx.id)}>{returningId === tx.id ? 'Returning...' : 'Return'}</button>
												{:else}
													<span class="text-slate-400">Completed</span>
												{/if}
											</td>
										</tr>
									{:else}
										<tr>
											<td colspan="7" class="py-6 text-center text-slate-500 dark:text-slate-400">No transactions found.</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</section>
			</main>
		</div>
	</div>
</div>
