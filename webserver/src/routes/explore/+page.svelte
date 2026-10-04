<script lang="ts">
  import { Card } from "flowbite-svelte";
  import { mockServices } from "$lib/mockJobs";
  import jobArtifact from "../../../../contracts/artifacts/contracts/Job.sol/Job.json";
  import { ethers } from "ethers";
  import { supabase } from "$lib/supabaseClient";
;

  async function hireService(service: (typeof mockServices)[0]) {
    if (typeof window !== "undefined" && window.ethereum) {
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
        service.deliveryDays,
      );
      await contract.waitForDeployment();
      await (contract as any).hire({
        value: ethers.parseEther(service.price.toString()),
      });

      const { data, error } = await supabase.from("jobs").insert({
        contract_address: await contract.getAddress(),
        freelancer_address: service.freelancerAddress,
        client_address: await signer.getAddress(),
        service_id: service.id,
      });
      console.log(data, error);
    } else {
      alert("Please install the MetaMask extension first");
    }
  }

</script>

<div class="p-6">
  <div class="flex justify-between items-center gap-6">
    <h1 class="text-3xl font-bold text-white">Explore Services</h1>
    <button
      class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
      onclick={()=>window.location.href="/explore/create-a-service"}
    >
      <b>Create Service</b>
    </button>
  </div>
  <div>
    <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each mockServices as service}
        <Card href="/" horizontal size="sm" class="max-w-xl max-h-xl flex">
          <div class="m-6 bg-white">
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
            <button
              class="rounded-lg bg-purple-600 text-white p-2 hover:bg-purple-700"
              onclick={() => hireService(service)}
            >
              <b>Hire!</b>
            </button>
          </div>
        </Card>
      {/each}
    </div>
  </div>
</div>