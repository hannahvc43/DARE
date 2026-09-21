<script lang="ts">
  import { Card } from "flowbite-svelte";
  import image from "/src/lib/assets/image.png"
    import { mockServices } from "$lib/mockJobs";
</script>

<div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
  {#each mockServices as service}
  <Card img={image} href="/" horizontal size="sm" class="max-w-xl max-h-xl flex">
    <div class="m-6 bg-white ">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{service.title}</h5>
      <p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">{service.description}</p>
    </div>
  </Card>
  {/each}
</div>