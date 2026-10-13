<script lang="ts">
    import { Badge, Card } from "flowbite-svelte";
    import jobArtifact from "../../../../contracts/artifacts/contracts/Job.sol/Job.json";
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import { wallet } from "$lib/wallet.svelte";
    import { ethers } from "ethers";

    let hiredJobs = $state<any>([]);
    let runningJobs = $state<any>([]);
    let linkInputs = $state<{ [key: number]: string }>({}); //store input links that are being submitted

    async function fetchRunningJobs(address: string) {
        const { data, error } = await supabase
            .from("jobs")
            .select("*, services(*)")
            .ilike("freelancer_address", address)
            .neq("status", "approved");
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
            .ilike("client_address", address)
            .neq("status", "approved");

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

    async function submitWork(job: any) {
        if (typeof window !== "undefined" && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                job.contract_address,
                jobArtifact.abi,
                signer,
            );
            await contract.deliver();

            const link = linkInputs[job.id];
            if (!link) {
                alert("Please enter a submission link.");
            } else {
                const { error } = await supabase
                    .from("jobs")
                    .update({ submission_link: link, status: "completed" })
                    .eq("id", job.id);
                if (error) {
                    console.error("Error: ", error);
                } else {
                    alert("Work submitted succesfully!");
                    window.location.reload();
                }
            }
        } else {
            alert("Please install the MetaMask extension first");
        }
    }

    async function approveWork(job: any) {
        if (typeof window !== "undefined" && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                job.contract_address,
                jobArtifact.abi,
                signer,
            );
            await contract.approve();
             const { error } = await supabase
                    .from("jobs")
                    .update({status: "approved" })
                    .eq("id", job.id);
                if (error) {
                    console.error("Error: ", error);
                } else {
                    alert("Work approved succesfully!");
                    window.location.reload();
                }
            window.location.reload()

        } else {
            alert("Please install the MetaMask extension first");
        }

    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center gap-6">
        <h1 class="text-3xl font-bold text-white">Your hired services:</h1>
    </div>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-6">
        {#each hiredJobs as job}
            <Card horizontal size="sm" class="max-w-xl max-h-xl flex">
                <div class="m-6 space-y-2">
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
                    {#if job.status === "completed"}
                    <div class="flex justify-between items-center">
                        <a href={job.submission_link}> <u>View result ↗</u></a>
                        <button class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
                                onclick={()=> approveWork(job)}>Approve
                        </button>
                    </div>
                    {/if}
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
            <Card horizontal size="sm" class="max-w-xl max-h-xl flex">
                <div class="m-6 space-y-2">
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
                    {#if job.status === "hired"}
                    <div class="flex justify-between items-center">
                        <input type="url" placeholder="paste a link to your deliverable (e.g. GitHub/WeTransfer" bind:value={linkInputs[job.id]}>
                        <button class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700" onclick={()=> submitWork(job)}>Submit</button>
                    </div>
                    {/if}
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
