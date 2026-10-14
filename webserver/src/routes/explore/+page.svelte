<script lang="ts">
  import { Card, Modal } from "flowbite-svelte";
  import jobArtifact from "../../../../contracts/artifacts/contracts/Job.sol/Job.json";
  import { ethers } from "ethers";
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { wallet } from "$lib/wallet.svelte";
    import { goto } from "$app/navigation";

  let services = $state<any>([]);
  let popupModal = $state(false);
  let currentService = $state<any>();
  let description = $state("")

  async function hireService(service: any, description: any) {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractFactory = new ethers.ContractFactory(
          jobArtifact.abi,
          jobArtifact.bytecode,
          signer,
        );
        const contract = await contractFactory.deploy(
          service.freelancerAddress,
          ethers.parseEther(service.price.toString()),
          service.deliveryMinutes,
        );
        await contract.waitForDeployment();
        await (contract as any).hire({
          value: ethers.parseEther(service.price.toString()),
        });

        console.log("service id:  ", service.service_id);
        const { data, error } = await supabase.from("jobs").insert({
          contract_address: await contract.getAddress(),
          freelancer_address: service.freelancerAddress,
          client_address: await signer.getAddress(),
          service_id: service.service_id,
          status: "hired",
          deadline: Math.floor(Date.now() / 1000) + service.deliveryMinutes * 60,
          instructions: description
        });
        console.log(data, error);
      } catch (error: any) {
        if (
          error.reason === "Freelancer cannot hire himself" ||
          error.message?.includes("Freelancer cannot hire himself")
        ) {
          alert("You cannot hire your own service!");
        } else {
          console.error("Unknown error ", error);
        }
      }
    } else {
      alert("Please install the MetaMask extension first");
    }
  }

  function getDays(deliveryMinutes: any) {
    return Math.floor(deliveryMinutes / 1440);
  }

  function getHours(deliveryMinutes: any) {
    return Math.floor((deliveryMinutes % 1440) / 60);
  }

  function getMinutes(deliveryMinutes: any) {
    return deliveryMinutes % 60;
  }

  onMount(async () => {
    if (wallet.isConnected) {
      const { data, error } = await supabase.from("services").select("*");
      if (error) {
        console.error(error);
      } else {
        services = data;
      }
    }
  });
</script>

<div class="p-6">
  <div class="flex justify-between items-center gap-6">
    <h1 class="text-3xl font-bold text-white">Explore Services</h1>
    <button
      class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
      onclick={() => goto("/explore/create-a-service")}
    >
      <b>Create Service</b>
    </button>
  </div>
  <div>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each services as service}
        <Card horizontal size="sm" class="max-w-xl max-h-xl flex">
          <div class="m-6 bg-white  w-full">
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {service.title}
            </h5>
            <p
              class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400"
            >
              {service.description}
            </p>
            <div class="flex justify-between items-center">
              <b
                class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400"
              >
                Delivery in {getDays(service.deliveryMinutes)} days, {getHours(
                  service.deliveryMinutes,
                )} hours, {getMinutes(service.deliveryMinutes)} minutes
              </b>
              <b
                class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400"
              >
                Price: {service.price} ETH
              </b>
            </div>
            <button
              class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
              onclick={() => {popupModal = true
                             currentService = service}}
            >
              <b>Hire!</b>
            </button>
          </div>
        </Card>
      {/each}
    </div>
  </div>
</div>


<Modal form bind:open={popupModal} size="xs">
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Instructions for freelancer:</h3>
    <div class="space-x-2">
      <textarea class="bg-white rounded-lg text-black"
      bind:value={description}
      required>
      </textarea>
      <button
              class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
              onclick={() => hireService(currentService, description)} >
              <b>Submit</b>
      </button>
    </div>
  </div>
</Modal>