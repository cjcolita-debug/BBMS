export type ToastKind = 'success' | 'error' | 'info';

export function showToast(kind: ToastKind, title: string, message: string) {
	if (typeof document === 'undefined') return;

	const event = new CustomEvent('bbms-toast', {
		detail: { kind, title, message }
	});

	document.dispatchEvent(event);
}
