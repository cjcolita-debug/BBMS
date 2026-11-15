<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import { getCurrentUserEmail } from '#lib/services/auth';
	import { createBook, deleteBook, listBooks, updateBook } from '#lib/services/books';
	import type { Book } from '#lib/types';
	import { showToast } from '#lib/toast';

	let books: Book[] = $state([]);
	let search = $state('');
	let loading = $state(true);
	let saving = $state(false);
	let userEmail = $state('');
	let databaseError = $state<string | null>(null);
	let showForm = $state(false);
	let editingId: string | null = $state(null);
	let form = $state({
		title: '',
		author: '',
		isbn: '',
		category: '',
		quantity: 1,
		description: ''
	});

	onMount(async () => {
		userEmail = await getCurrentUserEmail();
		await loadBooks();
	});

	async function loadBooks() {
		loading = true;
		databaseError = null;
		try {
			books = await listBooks();
		} catch (error) {
			databaseError = error instanceof Error ? error.message : 'Unable to load books from the database.';
			books = [];
		} finally {
			loading = false;
		}
	}

	let filteredBooks = $derived(
		books.filter((book) => {
			const query = search.toLowerCase();
			return !query || [book.title, book.author, book.isbn, book.category].join(' ').toLowerCase().includes(query);
		})
	);

	function resetForm() {
		form = { title: '', author: '', isbn: '', category: '', quantity: 1, description: '' };
		editingId = null;
		showForm = false;
	}

	function editBook(book: Book) {
		form = {
			title: book.title,
			author: book.author,
			isbn: book.isbn,
			category: book.category,
			quantity: book.quantity,
			description: book.description ?? ''
		};
		editingId = book.id;
		showForm = true;
	}

	async function submitBook(event: SubmitEvent) {
		event.preventDefault();
		if (!form.title.trim() || !form.author.trim() || !form.isbn.trim() || !form.category.trim()) {
			showToast('error', 'Validation error', 'Please complete all required fields.');
			return;
		}
		if (Number(form.quantity) <= 0) {
			showToast('error', 'Validation error', 'Quantity must be greater than zero.');
			return;
		}

		saving = true;
		try {
			if (editingId) {
				await updateBook(editingId, {
					...form,
					available_quantity: Number(form.quantity),
					quantity: Number(form.quantity)
				});
				showToast('success', 'Book updated', 'The book record was updated.');
			} else {
				await createBook({
					...form,
					quantity: Number(form.quantity),
					available_quantity: Number(form.quantity)
				});
				showToast('success', 'Book added', 'A new book was added to the catalog.');
			}
			await loadBooks();
			resetForm();
		} catch (error) {
			showToast('error', 'Save failed', error instanceof Error ? error.message : 'Unable to save the book.');
		} finally {
			saving = false;
		}
	}

	async function removeBook(id: string) {
		const confirmed = window.confirm('Delete this book? This cannot be undone.');
		if (!confirmed) return;
		try {
			await deleteBook(id);
			showToast('success', 'Book deleted', 'The book record was removed.');
			await loadBooks();
		} catch (error) {
			showToast('error', 'Delete failed', error instanceof Error ? error.message : 'Unable to delete the book.');
		}
	}
</script>

<svelte:head>
	<title>BBMS | Books</title>
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
						<p class="text-sm uppercase tracking-[0.2em] text-slate-400">Catalog</p>
						<h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Books</h1>
					</div>
					<button type="button" class="rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-500" onclick={() => { resetForm(); showForm = true; }}>
						Add Book
					</button>
				</header>

				{#if showForm}
					<div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-xl font-bold dark:text-white">{editingId ? 'Edit Book' : 'Add New Book'}</h2>
							<button type="button" class="text-sm text-slate-500" onclick={resetForm}>Close</button>
						</div>
						<form class="grid gap-4 md:grid-cols-2" onsubmit={submitBook}>
							<input bind:value={form.title} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Title" required />
							<input bind:value={form.author} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Author" required />
							<input bind:value={form.isbn} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="ISBN" required />
							<input bind:value={form.category} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Category" required />
							<input bind:value={form.quantity} type="number" min="1" class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Quantity" required />
							<textarea bind:value={form.description} rows="4" class="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Description"></textarea>
							<div class="md:col-span-2 flex justify-end gap-3">
								<button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 dark:border-slate-700 dark:text-slate-200" onclick={resetForm}>Cancel</button>
								<button type="submit" disabled={saving} class="rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white disabled:opacity-70">{saving ? 'Saving...' : editingId ? 'Update Book' : 'Save Book'}</button>
							</div>
						</form>
					</div>
				{/if}

				<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<input bind:value={search} class="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Search books..." />
					</div>

					{#if loading}
						<p class="text-slate-500 dark:text-slate-400">Loading books...</p>
					{:else if databaseError}
						<div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200">
							<strong>Database error:</strong> {databaseError}
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="min-w-full text-left text-sm">
								<thead>
									<tr class="text-slate-500 dark:text-slate-400">
										<th class="py-3 pr-4">Title</th>
										<th class="py-3 pr-4">Author</th>
										<th class="py-3 pr-4">ISBN</th>
										<th class="py-3 pr-4">Category</th>
										<th class="py-3 pr-4">Qty</th>
										<th class="py-3 pr-4">Available</th>
										<th class="py-3 pr-4">Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each filteredBooks as book}
										<tr class="border-t border-slate-200 dark:border-slate-700">
											<td class="py-3 pr-4 font-semibold text-slate-900 dark:text-white">{book.title}</td>
											<td class="py-3 pr-4">{book.author}</td>
											<td class="py-3 pr-4">{book.isbn || 'Not assigned'}</td>
											<td class="py-3 pr-4">{book.category}</td>
											<td class="py-3 pr-4">{book.quantity}</td>
											<td class="py-3 pr-4">{book.available_quantity}</td>
											<td class="py-3 pr-4">
												<div class="flex gap-2">
													<button type="button" class="rounded-lg bg-sky-100 px-2.5 py-1.5 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200" onclick={() => editBook(book)}>Edit</button>
													<button type="button" class="rounded-lg bg-rose-100 px-2.5 py-1.5 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" onclick={() => removeBook(book.id)}>Delete</button>
												</div>
											</td>
										</tr>
									{:else}
										<tr>
											<td colspan="7" class="py-6 text-center text-slate-500 dark:text-slate-400">No books match your search.</td>
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
