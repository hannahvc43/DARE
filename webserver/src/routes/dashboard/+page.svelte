<script lang="ts">
    import { Badge, Card } from "flowbite-svelte";
    import jobArtifact from "../../../../contracts/artifacts/contracts/Job.sol/Job.json";
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import { wallet } from "$lib/wallet.svelte";
    import { ethers } from "ethers";
    import { goto } from "$app/navigation";

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
            const approvalDeadline = Math.floor(
                Date.now() / 1000 + //minutes
                    7 * 1440,
            ); //plus seven days  written in minutes as well
            if (!link) {
                alert("Please enter a submission link.");
            } else {
                const { error } = await supabase
                    .from("jobs")
                    .update({
                        submission_link: link,
                        status: "completed",
                        approval_deadline: approvalDeadline,
                    })
                    .eq("id", job.id);
                if (error) {
                    console.error("Error: ", error);
                } else {
                    alert("Work submitted succesfully!");
                    goto("/dashboard");

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
                .update({ status: "approved" })
                .eq("id", job.id);
            if (error) {
                console.error("Error: ", error);
            } else {
                alert("Work approved succesfully!");
                goto("/dashboard");}
            goto("/dashboard");
        } else {
            alert("Please install the MetaMask extension first");
        }
    }

    async function requestRefund(job: any) {
        if (typeof window !== "undefined" && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    job.contract_address,
                    jobArtifact.abi,
                    signer,
                );
                await contract.getRefund();
                const { error } = await supabase
                    .from("jobs")
                    .update({ status: "refunded" })
                    .eq("id", job.id);
                if (error) {
                    console.error("Error: ", error);
                } else {
                    alert("Work refunded succesfully!");
                    goto("/dashboard");
                }
                goto("/dashboard");
            } catch (error: any) {
                if (error.type == "Deadline has not passed yet") {
                    alert("Refund failed, please try again later");
                } else {
                    console.error("Error: ", error);
                }
            }
        } else {
            alert("Please install the MetaMask extension first");
        }
    }
    async function claimAutoApproval(job: any) {
        if (typeof window !== "undefined" && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                job.contract_address,
                jobArtifact.abi,
                signer,
            );
            await contract.claimAutoApproval(); //way to know if this was succesful or not
            const { error } = await supabase
                .from("jobs")
                .update({ status: "approved" })
                .eq("id", job.id);
            if (error) {
                console.error("Error: ", error);
            } else {
                alert("Work approved succesfully!");
                goto("/dashboard");
            }
            goto("/dashboard");
        } else {
            alert("Please install the MetaMask extension first");
        }
    }
    function formatRemainingTime(deadline: number) {
        const now = Math.floor(Date.now() / 1000);
        const remainingSeconds = deadline - now;

        if (remainingSeconds <= 0) {
            return "Delivery overdue";
        }

        const totalMinutes = Math.floor(remainingSeconds / 60);
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        return `Delivery in ${days} days, ${hours} hours, ${minutes} minutes`;
    }

    function formatRemainingApprovalTime(deadline: number) {
        const now = Math.floor(Date.now() / 1000);
        const remainingSeconds = deadline - now;

        if (remainingSeconds <= 0) {
            return "Delivery overdue";
        }

        const totalMinutes = Math.floor(remainingSeconds / 60);
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        return `${days} days, ${hours} hours, ${minutes} minutes until approval deadline`;
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center gap-6">
        <h1 class="text-3xl font-bold text-white">Your hired services:</h1>
    </div>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-6">
        {#each hiredJobs as job}
            <Card class="max-w-xl max-h-xl flex flex-col justify-between">
                <div class="m-6 space-y-2">
                    <div class="bg-white flex justify-between items-start gap-2 w-full">
                        <h5
                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900"
                        >
                            {job.services?.title}
                        </h5>
                        <Badge color="purple" class="shrink-0">
                            {job.status}
                        </Badge>
                    </div>
                    {#if job.status === "completed"}
                        <div class="flex justify-between items-center">
                            <a href={job.submission_link}>
                                <u>View result ↗</u></a
                            >
                            <button
                                class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
                                onclick={() => approveWork(job)}
                                >Approve
                            </button>
                        </div>
                    {/if}
                    {#if job.status === "hired" && job.deadline < Math.floor(Date.now() / 1000)}
                        <div class="flex justify-between items-center">
                            <p>
                                Freelancer has went over deadline you can claim
                                your refund: {job.deadline} and {Math.floor(
                                    Date.now() / 1000,
                                )}
                            </p>
                            <button
                                class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
                                onclick={() => requestRefund(job)}>Claim</button
                            >
                        </div>
                    {/if}
                    <div
                        class="flex justify-between items-center text-gray-700 pt-4 mt-4 w-full"
                    >
                        {#if job.status === "hired"}
                        <b class="mb-3 leading-tight font-normal">
                            {formatRemainingTime(job.deadline)}
                        </b>
                        {/if}
                        {#if job.status === "completed"}
                        <b class="mb-3 leading-tight font-normal">
                            {formatRemainingApprovalTime(job.approval_deadline)}
                        </b>
                        {/if}
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
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-6">
        {#each runningJobs as job}
            <Card class="max-w-xl max-h-xl flex flex-col justify-between w-full">
                <div class="m-6 space-y-2">
                    <div class="bg-white flex justify-between items-start w-full">
                        <h5
                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900"
                        >
                            {job.services?.title}
                        </h5>
                        <Badge color="purple" class="shrink-0">
                            {job.status}
                        </Badge>
                    </div>
                    {#if job.status === "hired"}
                        <p><b>Client instructions: </b> {job.instructions}</p>
                        <div class="flex justify-between items-center">
                            <input
                                type="url"
                                placeholder="paste a link to your deliverable (e.g. GitHub/WeTransfer"
                                bind:value={linkInputs[job.id]}
                            />
                            <button
                                class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
                                onclick={() => submitWork(job)}>Submit</button
                            >
                        </div>
                    {/if}
                    {#if job.status === "submitted" && Math.floor(Date.now() / 1000) > job.approval_deadline}
                        <div class="flex justify-between items-center">
                            <p>
                                Client has went over deadline to approve, you
                                can claim auto approval:
                            </p>
                            <button
                                class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
                                onclick={() => claimAutoApproval(job)}
                                >Approve</button
                            >
                        </div>
                    {/if}
  <div
                        class="flex justify-between items-center text-gray-700 pt-4 mt-4 w-full"
                    >
                        {#if job.status === "hired"}
                        <b class="mb-3 leading-tight font-normal">
                            {formatRemainingTime(job.deadline)}
                        </b>
                        {/if}
                        {#if job.status === "completed"}
                        <b class="mb-3 leading-tight font-normal">
                            {formatRemainingApprovalTime(job.approval_deadline)}
                        </b>
                        {/if}
                        <b class="mb-3 leading-tight font-normal">
                            Price: {job.services?.price} ETH
                        </b>
                    </div>
                </div>
            </Card>
        {/each}
    </div>
</div>
