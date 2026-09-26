<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	let connectedWallet = $state(false)

	async function connectWallet(){
		if (typeof window !== "undefined" && window.ethereum){
			try {
				const account = await window.ethereum.request({
					method: "eth_requestAccounts"
				})
				console.log("Connected: ", account[0])
				connectedWallet = account[0]
			}
			catch(error){
				console.log("Error: ", error)
			}
		
		}
		else{
			alert("Please install the MetaMask extension to connect your wallet")
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} />

</svelte:head>

<div class="min-h-screen bg-black">
	<nav class="fixed top-0 left-0 z-50 w-full border-b border-purple-200 bg-black text-white p-4 flex justify-between items-center">
		<div>
			<a href="/" class="text-lg font-bold">DARE</a>
			<a href="/explore" class="ml-4 hover:underline">Explore</a>
			<a href="/dashboard" class="ml-4 hover:underline">Dashboard</a>
			<a href="/about" class="ml-4 hover:underline">About</a>
		</div>
		<div>
		{#if connectedWallet}
		<div class="rounded-lg bg-purple-600 text-white p-2">
			<b>Connected</b>
		</div>
		{:else}
			<button class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700" onclick={connectWallet}>
				<b> Connect Wallet</b>
			</button>

		{/if}		
		</div>
	</nav>

	<div class="h-16"></div>

	{@render children?.()}
</div>

