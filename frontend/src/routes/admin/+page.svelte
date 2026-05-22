<script lang="ts">
  
  import UserTable from "$lib/ui/UserTable.svelte";
  import CollectionTable from "$lib/ui/CollectionTable.svelte";
  import PlacemarkTable from "$lib/ui/PlacemarkTable.svelte";
  import AdminCharts from "$lib/ui/AdminCharts.svelte";
  import PlacemarkMap from "$lib/ui/PlacemarkMap.svelte";
  
  //import { adminService } from "$lib/services/admin-service";
  
  import type { PageProps } from "./$types";
  
  let { data }: PageProps = $props();
  
  interface User {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  }
  
  interface Collection {
    _id: string;
    name?: string;
    userid?: string;
  }
  
  interface Placemark {
    _id: string;
    name?: string;
    description?: string;
    category?: string;
    county?: string;
    latitude: number;
    longitude: number;
    yearEstablished?: number;
  }

  // svelte-ignore state_referenced_locally
  let users = $state<User[]>(
    data.users || []
  );

  // svelte-ignore state_referenced_locally
  let collections = $state<Collection[]>(
    data.collections || []
  );

  // svelte-ignore state_referenced_locally
  let placemarks = $state<Placemark[]>(
    data.placemarks || []
  );

  // svelte-ignore state_referenced_locally
  let userCount = $state(
    data.userCount || 0
  );

  // svelte-ignore state_referenced_locally
  let collectionCount = $state(
    data.collectionCount || 0
  );

  // svelte-ignore state_referenced_locally
  let placemarkCount = $state(
    data.placemarkCount || 0
  );
  
  let showUsers = $state(false);
  
  let showCollections = $state(false);
  
  let showPlacemarks = $state(false);
  
  let showMap = $state(false);
  
  async function deleteUser(id: string) {
    try {
      const formData = new FormData();
      formData.append("id", id);
      
      await fetch("?/deleteUser", {
        method: "POST",
        body: formData
      });
      
      users = users.filter((u) => u._id !== id);
      userCount = users.length;
    } catch (error) {
      console.log(error);
    }
  }
  
  async function deleteCollection(id: string) {
    try {
      const formData = new FormData();
      formData.append("id", id);
      
      await fetch("?/deleteCollection", {
        method: "POST",
        body: formData
      });
      
      collections = collections.filter((c) => c._id !== id);
      collectionCount = collections.length;
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePlacemark(id: string) {
    try {
      const formData = new FormData();
      formData.append("id", id);
      
      await fetch("?/deletePlacemark", {
        method: "POST",
        body: formData
      });
      
      placemarks = placemarks.filter((p) => p._id !== id);
      placemarkCount = placemarks.length;
    } catch (error) {
      console.log(error);
    }
  }
  
  function toggleMap(): void {
    showMap = !showMap;
  }
  
</script>

<svelte:head>

  <script src="https://unpkg.com/frappe-charts@1.6.2/dist/frappe-charts.min.iife.js"></script>

</svelte:head>

<section class="section">
  
  <div class="container">
    
    <h1 class="title">
      Admin Dashboard • Painéal Riarthóra
    </h1>
    
    <div class="columns">
      
      <div class="column">
        
        <div class="box has-text-centered">
          
          <p class="heading">
            Users
          </p>
          
          <p class="title">
            {userCount}
          </p>
          
        </div>
        
      </div>
      
      <div class="column">
        
        <div class="box has-text-centered">
          
          <p class="heading">
            Collections
          </p>
          
          <p class="title">
            {collectionCount}
          </p>
          
        </div>
        
      </div>
      
      <div class="column">
        
        <div class="box has-text-centered">
          
          <p class="heading">
            Placemarks
          </p>
          
          <p class="title">
            {placemarkCount}
          </p>
          
        </div>
        
      </div>
      
    </div>
    
    <AdminCharts
      userCount={userCount}
      collectionCount={collectionCount}
      placemarkCount={placemarkCount}
      categoryLabels={data.categoryLabels}
      categoryCounts={data.categoryCounts}
      roleLabels={data.roleLabels}
      roleCounts={data.roleCounts}
      countyLabels={data.countyLabels}
      countyCounts={data.countyCounts}
    />
    
    <div class="box">
      
      <button
        class="button is-fullwidth is-success"
        onclick={toggleMap}
      >
        View Placemark Map
      </button>
    
      {#if showMap}
    
        <div class="mt-4">
          <PlacemarkMap
            mapId="adminMap"
            {placemarks}
          />
        </div>
    
      {/if}
    
    </div>
  
    <div class="box">
    
      <button
        class="button is-fullwidth is-link"
        onclick={() => showUsers = !showUsers}
      >
        View Users
      </button>
  
      {#if showUsers}
  
        <div class="mt-4">
    
          <UserTable
            {users}
            {deleteUser}
          />
    
        </div>
  
      {/if}
  
    </div>

    <div class="box">
  
      <button
        class="button is-fullwidth is-info"
        onclick={() => showCollections = !showCollections}
      >
        View Collections
      </button>

      {#if showCollections}

        <div class="mt-4">
  
          <CollectionTable
            {collections}
            {deleteCollection}
          />
  
        </div>

      {/if}

    </div>

    <div class="box">
  
      <button
        class="button is-fullwidth is-warning"
        onclick={() => showPlacemarks = !showPlacemarks}
      >
        View Placemarks
      </button>

      {#if showPlacemarks}

        <div class="mt-4">
  
          <PlacemarkTable
            {placemarks}
            {deletePlacemark}
          />
  
        </div>

      {/if}

    </div>

  </div>

</section>