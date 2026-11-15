<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';

	type Toast = { id: number; kind: 'success' | 'error' | 'info'; title: string; message: string };

	let { children } = $props();
	let toasts: Toast[] = $state([]);

	function removeToast(id: number) {
		toasts = toasts.filter((toast) => toast.id !== id);
	}

	onMount(() => {
		const handler = (event: Event) => {
			const customEvent = event as CustomEvent<{ kind: Toast['kind']; title: string; message: string }>;
			const toast = customEvent.detail;
			const item = { id: Date.now() + Math.random(), ...toast };
			toasts = [...toasts, item];
			setTimeout(() => removeToast(item.id), 3000);
		};
		document.addEventListener('bbms-toast', handler);
		return () => document.removeEventListener('bbms-toast', handler);
	});
</script>

<div class="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
	{@render children()}
</div>

<div class="pointer-events-none fixed right-4 top-4 z-50 space-y-3">
	{#each toasts as toast (toast.id)}
		<div class={`pointer-events-auto w-80 rounded-2xl border p-4 shadow-xl backdrop-blur ${toast.kind === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200' : toast.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/70 dark:text-rose-200' : 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-200'}`}>
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-sm font-semibold">{toast.title}</p>
					<p class="mt-1 text-sm opacity-80">{toast.message}</p>
				</div>
				<button type="button" class="text-xs opacity-70 hover:opacity-100" onclick={() => removeToast(toast.id)}>✕</button>
			</div>
		</div>
	{/each}
</div>
