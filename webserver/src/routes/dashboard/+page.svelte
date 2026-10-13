<script lang="ts">
    import { Badge, Card } from "flowbite-svelte";
    import { mockServices } from "$lib/mockJobs";
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import { wallet } from "$lib/wallet.svelte";

    let hiredJobs = $state<any>([]);
    let runningJobs = $state<any>([]);

    async function fetchRunningJobs(address: string) {
        const { data, error } = await supabase
            .from("jobs")
            .select("*, services(*)")
            .ilike("freelancer_address", address);
        if (error) {
            console.error(error);
        } else {
            console.log("data:", data);
            runningJobs = data;
        }
    }
    async function fetchHiredJobs(address: string) {
        const { data, error } = await supabase
            .from("jobs")
            .select("*, services(*)")
            .ilike("client_address", address);
        if (error) {
            console.error(error);
        } else {
            console.log("data:", data);
            hiredJobs = data;
        }
    }

    onMount(async () => {
        if (wallet.isConnected) {
            fetchHiredJobs(wallet.address);
            fetchRunningJobs(wallet.address);
        }
    });
</script>

<div class="p-6">
    <div class="flex justify-between items-center gap-6">
        <h1 class="text-3xl font-bold text-white">Your hired services:</h1>
    </div>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-6">
        {#each hiredJobs as job}
            <Card href="/" horizontal size="sm" class="max-w-xl max-h-xl flex">
                <div class="m-6">
                    <div class="bg-white flex justify-between items-start">
                        <h5
                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900"
                        >
                            {job.services?.title}
                        </h5>
                        <Badge color="purple">
                            {job.status}
                        </Badge>
                    </div>
                    <div>
                        <p class="text-gray-700">Waiting for submission</p>
                    </div>
                    <div
                        class="flex justify-between items-center text-gray-700"
                    >
                        <b class="mb-3 leading-tight font-normal">
                            Delivery in {job.services?.deliveryDays} days
                        </b>
                        <b class="mb-3 leading-tight font-normal">
                            Price: {job.services?.price} ETH
                        </b>
                    </div>
                </div>
            </Card>
        {/each}
    </div>
    <div class="flex justify-between items-center gap-6">
        <h1 class="text-3xl font-bold text-white">Your running services:</h1>
    </div>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each runningJobs as job}
            <Card href="/" horizontal size="sm" class="max-w-xl max-h-xl flex">
                <div class="m-6">
                    <div class="bg-white flex justify-between items-start">
                        <h5
                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900"
                        >
                            {job.services?.title}
                        </h5>
                        <Badge color="purple">
                            {job.status}
                        </Badge>
                    </div>
                    <div>
                        <p class="text-gray-700">Submit here:</p>
                    </div>
                    <div
                        class="flex justify-between items-center text-gray-700"
                    >
                        <b class="mb-3 leading-tight font-normal">
                            Delivery in {job.services?.deliveryDays} days
                        </b>
                        <b class="mb-3 leading-tight font-normal">
                            Price: {job.services?.price} ETH
                        </b>
                    </div>
                </div>
            </Card>
        {/each}
    </div>
</div>
