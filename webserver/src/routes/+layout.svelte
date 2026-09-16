<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} />

</svelte:head>

<div class="min-h-screen bg-black">
	<nav class="fixed top-0 left-0 z-50 w-full border-b border-purple-200 bg-black text-white p-4">
		<a href="/" class="text-lg font-bold">DARE</a>
		<a href="/explore" class="ml-4 hover:underline">Explore</a>
		<a href="/dashboard" class="ml-4 hover:underline">Dashboard</a>
		<a href="/about" class="ml-4 hover:underline">About</a>
	</nav>

	<div class="h-16"></div>

	{@render children?.()}
</div>

