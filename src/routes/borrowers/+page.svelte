<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import { getCurrentUserEmail } from '#lib/services/auth';
	import { createBorrower, deleteBorrower, listBorrowers, updateBorrower } from '#lib/services/borrowers';
	import type { Borrower } from '#lib/types';
	import { showToast } from '#lib/toast';

	let borrowers: Borrower[] = $state([]);
	let search = $state('');
	let loading = $state(true);
	let saving = $state(false);
	let databaseError = $state<string | null>(null);
	let userEmail = $state('');
	let showForm = $state(false);
	let editingId: string | null = $state(null);
	let form = $state({
		full_name: '',
		student_id: '',
		course: '',
		year_level: '',
		contact_number: ''
	});

	onMount(async () => {
		userEmail = await getCurrentUserEmail();
		await loadBorrowers();
	});

	async function loadBorrowers() {
		loading = true;
		databaseError = null;
		try {
			borrowers = await listBorrowers();
		} catch (error) {
			databaseError = error instanceof Error ? error.message : 'Unable to load borrowers.';
			borrowers = [];
		} finally {
			loading = false;
		}
	}

	let filteredBorrowers = $derived(
		borrowers.filter((borrower) => {
			const query = search.toLowerCase();
			return !query || [borrower.full_name, borrower.student_id, borrower.course, borrower.contact_number].join(' ').toLowerCase().includes(query);
		})
	);

	function resetForm() {
		form = { full_name: '', student_id: '', course: '', year_level: '', contact_number: '' };
		editingId = null;
		showForm = false;
	}

	function editBorrower(borrower: Borrower) {
		form = {
			full_name: borrower.full_name,
			student_id: borrower.student_id,
			course: borrower.course,
			year_level: borrower.year_level,
			contact_number: borrower.contact_number
		};
		editingId = borrower.id;
		showForm = true;
	}

	async function submitBorrower(event: SubmitEvent) {
		event.preventDefault();
		if (Object.values(form).some((value) => !String(value).trim())) {
			showToast('error', 'Validation error', 'All borrower fields are required.');
			return;
		}
		saving = true;
		try {
			if (editingId) {
				await updateBorrower(editingId, form);
				showToast('success', 'Borrower updated', 'Borrower details were updated.');
			} else {
				await createBorrower(form);
				showToast('success', 'Borrower added', 'A new borrower record was created.');
			}
			await loadBorrowers();
			resetForm();
		} catch (error) {
			showToast('error', 'Save failed', error instanceof Error ? error.message : 'Unable to save borrower.');
		} finally {
			saving = false;
		}
	}

	async function removeBorrower(id: string) {
		const confirmed = window.confirm('Delete this borrower? This may affect transaction history.');
		if (!confirmed) return;
		try {
			await deleteBorrower(id);
			showToast('success', 'Borrower deleted', 'The borrower was removed.');
			await loadBorrowers();
		} catch (error) {
			showToast('error', 'Delete failed', error instanceof Error ? error.message : 'Unable to delete borrower.');
		}
	}
</script>

<svelte:head>
	<title>BBMS | Borrowers</title>
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
						<p class="text-sm uppercase tracking-[0.2em] text-slate-400">Members</p>
						<h1 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Borrowers</h1>
					</div>
					<button type="button" class="rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-500" onclick={() => { resetForm(); showForm = true; }}>
						Add Borrower
					</button>
				</header>

				{#if showForm}
					<div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-xl font-bold dark:text-white">{editingId ? 'Edit Borrower' : 'Add New Borrower'}</h2>
							<button type="button" class="text-sm text-slate-500" onclick={resetForm}>Close</button>
						</div>
						<form class="grid gap-4 md:grid-cols-2" onsubmit={submitBorrower}>
							<input bind:value={form.full_name} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Full Name" required />
							<input bind:value={form.student_id} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Student ID" required />
							<input bind:value={form.course} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Course" required />
							<input bind:value={form.year_level} class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Year Level" required />
							<input bind:value={form.contact_number} class="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Contact Number" required />
							<div class="md:col-span-2 flex justify-end gap-3">
								<button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 dark:border-slate-700 dark:text-slate-200" onclick={resetForm}>Cancel</button>
								<button type="submit" disabled={saving} class="rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white disabled:opacity-70">{saving ? 'Saving...' : editingId ? 'Update Borrower' : 'Save Borrower'}</button>
							</div>
						</form>
					</div>
				{/if}

				<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
					<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<input bind:value={search} class="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Search borrowers..." />
					</div>

					{#if loading}
						<p class="text-slate-500 dark:text-slate-400">Loading borrowers...</p>
					{:else if databaseError}
						<div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200">
							<strong>Database error:</strong> {databaseError}
							<button type="button" class="ml-3 font-semibold underline" onclick={loadBorrowers}>Retry</button>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="min-w-full text-left text-sm">
								<thead>
									<tr class="text-slate-500 dark:text-slate-400">
										<th class="py-3 pr-4">Name</th>
										<th class="py-3 pr-4">Student ID</th>
										<th class="py-3 pr-4">Course</th>
										<th class="py-3 pr-4">Year</th>
										<th class="py-3 pr-4">Contact</th>
										<th class="py-3 pr-4">Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each filteredBorrowers as borrower}
										<tr class="border-t border-slate-200 dark:border-slate-700">
											<td class="py-3 pr-4 font-semibold text-slate-900 dark:text-white">{borrower.full_name}</td>
											<td class="py-3 pr-4">{borrower.student_id}</td>
											<td class="py-3 pr-4">{borrower.course}</td>
											<td class="py-3 pr-4">{borrower.year_level}</td>
											<td class="py-3 pr-4">{borrower.contact_number}</td>
											<td class="py-3 pr-4">
												<div class="flex gap-2">
													<button type="button" class="rounded-lg bg-sky-100 px-2.5 py-1.5 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200" onclick={() => editBorrower(borrower)}>Edit</button>
													<button type="button" class="rounded-lg bg-rose-100 px-2.5 py-1.5 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200" onclick={() => removeBorrower(borrower.id)}>Delete</button>
												</div>
											</td>
										</tr>
									{:else}
										<tr>
											<td colspan="6" class="py-6 text-center text-slate-500 dark:text-slate-400">No borrowers match your search.</td>
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
