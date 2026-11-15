<script lang="ts">
	let {
		label,
		value,
		icon,
		tone = 'primary'
	}: {
		label: string;
		value: number;
		icon: string;
		tone?: 'primary' | 'success' | 'info' | 'warning';
	} = $props();

	const toneClasses = {
		primary: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200',
		success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
		info: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200',
		warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
	};
</script>

<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
	<div class="flex items-center justify-between">
		<div class={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${toneClasses[tone]}`}>
			{icon}
		</div>
	</div>
	<div class="mt-5">
		<p class="text-sm text-slate-500 dark:text-slate-400">{label}</p>
		<p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
	</div>
</div>
