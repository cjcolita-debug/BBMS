<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { signOut } from '#lib/services/auth';
	import { AUTH_DISABLED } from '#lib/auth-config';
	import { showToast } from '#lib/toast';

	let { userEmail = 'admin@library.local' }: { userEmail?: string } = $props();

	const items = [
		{ href: '/dashboard', label: 'Dashboard', icon: '⌂' },
		{ href: '/books', label: 'Books', icon: '📚' },
		{ href: '/borrowers', label: 'Borrowers', icon: '👥' },
		{ href: '/transactions', label: 'Transactions', icon: '🧾' }
	];

	let currentPath = $derived(page.url.pathname);

	async function handleLogout() {
		try {
			await signOut();
			await goto('/');
		} catch (error) {
			showToast('error', 'Logout failed', error instanceof Error ? error.message : 'Unable to sign out.');
		}
	}
</script>

<aside class="flex h-full w-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
	<div>
		<div class="mb-8 flex items-center gap-3 px-2">
			<div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-lg font-bold text-white">B</div>
			<div>
				<p class="text-xs uppercase tracking-[0.2em] text-slate-400">Library</p>
				<h2 class="text-lg font-bold text-slate-900 dark:text-white">BBMS</h2>
			</div>
		</div>

		<nav class="space-y-2">
			{#each items as item}
				<a
					href={item.href}
					class={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${currentPath.startsWith(item.href)
						? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
						: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
				>
					<span>{item.icon}</span>
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	</div>

	{#if !AUTH_DISABLED}
		<div class="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
			<div class="mb-3 flex items-center gap-3 px-2 py-1.5">
				<div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">A</div>
				<div class="flex-1 min-w-0">
					<p class="truncate text-sm font-semibold text-slate-900 dark:text-white">Admin</p>
					<p class="truncate text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
				</div>
			</div>
			<button
				type="button"
				onclick={handleLogout}
				class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-rose-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
			>
				Logout
			</button>
		</div>
	{/if}
</aside>
