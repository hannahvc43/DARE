<script>
    import { goto } from "$app/navigation";

</script>
<style>
    :global(*) {
        font-family: "RF Dewi", sans-serif;
    }
</style>

<div class="min-h-screen flex items-center justify-center text-white font-bold">
    <div class="text-center space-y-6 max-w-3xl">
        <h1 class="text-5xl font-extrabold tracking-tight">DareLance: Trustless freelancing marketplace</h1>
        <h3 class="text-2xl text-purple-200">An end-to-end decentralized application on Ethereum </h3>

        <div class="flex justify-center items-center gap-4 text-md">
            <button onclick={()=>goto("/explore")} class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700">
            Explore
            </button>
            <button onclick={()=>goto("/about")} class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700">
            Learn More
            </button>
        </div>
    </div>
</div>    


