<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		void goto('/dashboard');
	});
</script>

<svelte:head>
	<title>BBMS | Redirecting</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
	<div class="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
		Redirecting to dashboard...
	</div>
</div>
