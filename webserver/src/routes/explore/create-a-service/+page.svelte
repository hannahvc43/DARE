<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { ethers } from "ethers";

    let title = $state("");
    let description = $state("");
    let price = $state<number>(0);
    let days = $state<number>(0);
    let hours = $state<number>(0);
    let minutes = $state<number>(0);

    function toMinutes(){
        return (days * 1440) + (hours * 60)+minutes
    }    

    async function createService() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const { data, error } = await supabase.from("services").insert({
            title: title,
            description: description,
            price: price,
            deliveryMinutes: toMinutes(),
            freelancerAddress: await signer.getAddress(),
        });
        console.log(data, error);
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center gap-6">
        <form class="flex flex-col gap-4 text-black pd-8">
            <div>
                <label
                    for="title"
                    class="mb-2 text-2xl font-bold tracking-tight text-white"
                >
                    Service Title</label
                >
                <input  class="rounded-lg" id="title" type="text" bind:value={title} required />
            </div>
            <label
                for="description"
                class="mb-2 text-2xl font-bold tracking-tight text-white"
            >
                Description</label
            >
            <input
                class="rounded-lg"
                id="description"
                type="text"
                bind:value={description}
                required
            />
            <div>
                <label
                    for="price"
                    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-white"
                >
                    Price (ETH)</label
                >
                <input class="rounded-lg"id="price" type="number" min="0" step="any" bind:value={price} required />
            </div>
           <div>
            <h1 class="mb-2 text-2xl font-bold tracking-tight text-white">
                Delivery Timeframe
            </h1>
            <div class="grid grid-cols-3 gap-4">
                <div>
                    <span class="text-gray-400 mt-2">Days</span>
                    <input 
                        type="number" 
                        min="0" 
                        bind:value={days} 
                        class="w-full p-3 bg-white border rounded-lg text-black text-center" 
                    />
                </div>
                <div>
                    <span class="text-gray-400 mt-2">Hours</span>
                    <input 
                        type="number" 
                        min="0" 
                        max="23" 
                        bind:value={hours} 
                        class="w-full p-3 bg-white border rounded-lg text-black text-center" 
                    />
                </div>
                <div>
                    <span class="text-gray-400 mt-2">Minutes</span>
                    <input 
                        type="number" 
                        min="0" 
                        max="59" 
                        bind:value={minutes} 
                        class="w-full p-3 bg-white border rounded-lg text-black text-center" 
                    />
                </div>
            </div>
            <p class="text-purple-400 mt-2">
                Delivery in: {days} days, {hours} hours, {minutes} minutes
            </p>
        </div>

            <button
                type="submit"
                onclick={() => createService()}
                class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
            >
                Publish Service
            </button>
        </form>
    </div>
</div>
