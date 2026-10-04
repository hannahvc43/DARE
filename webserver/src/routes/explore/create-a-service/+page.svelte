<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { ethers } from "ethers";

    let title = $state("");
    let description = $state("");
    let price = $state<number>(0);
    let amountOfDays = $state<number>(0);

    async function createService() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const { data, error } = await supabase.from("services").insert({
            title: title,
            description: description,
            price: price,
            deliveryDays: amountOfDays,
            freelancerAddress: await signer.getAddress(),
        });
        console.log(data, error);
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center gap-6">
        <form class="flex flex-col gap-4 text-white pd-8">
            <div>
                <label
                    for="title"
                    class="mb-2 text-2xl font-bold tracking-tight text-white"
                >
                    Service Title</label
                >
                <input id="title" type="text" bind:value={title} required />
            </div>
            <label
                for="description"
                class="mb-2 text-2xl font-bold tracking-tight text-white"
            >
                Description</label
            >
            <input
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
                <input id="price" type="number" bind:value={price} required />
            </div>
            <div>
                <label
                    for="delivery"
                    class="mb-2 text-2xl font-bold tracking-tight text-white"
                >
                    Delivery within ... days:
                </label>
                <input
                    id="delivery"
                    type="number"
                    bind:value={amountOfDays}
                    required
                />
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
