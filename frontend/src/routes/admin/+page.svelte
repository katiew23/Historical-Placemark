<script lang="ts">
  
  import UserTable from "$lib/ui/UserTable.svelte";
  import CollectionTable from "$lib/ui/CollectionTable.svelte";
  import PlacemarkTable from "$lib/ui/PlacemarkTable.svelte";
  import AdminCharts from "$lib/ui/AdminCharts.svelte";
  
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
    latitude?: number;
    longitude?: number;
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
  
  let map: any;
  
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
    
    if (showMap) {
      
      setTimeout(async () => {
        
        // @ts-ignore
        const L = window.L;
        
        if (!map) {
          
          map = L.map(
          "adminMap"
          ).setView(
          [53.4, -7.7],
          7
          );
          
          L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
            "&copy; OpenStreetMap contributors"
          }
          ).addTo(map);
          
          placemarks.forEach(
          async (placemark) => {
            
            if (
            placemark.latitude &&
            placemark.longitude
            ) {
              
              let weatherText =
              "Weather unavailable";
              
              try {
                
                const response =
                await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${placemark.latitude}&lon=${placemark.longitude}&appid=af52a9802a4c633460b714fc47b6fb91&units=metric`
                );
                
                const weather =
                await response.json();
                
                weatherText = `
                  ${weather.main.temp}°C •
                  ${weather.weather[0].main}
                `;
                
              } catch (error) {
                
                console.log(
                "WEATHER ERROR:",
                error
                );
              }
              
              L.marker([
              placemark.latitude,
              placemark.longitude
              ])
              .addTo(map)
              .bindPopup(`

                <div style="
                  min-width:220px;
                ">

                  <h3 style="
                    font-size:18px;
                    font-weight:600;
                    margin-bottom:8px;
                  ">
                    ${placemark.name}
                  </h3>

                  <p>
                    ${placemark.description || ""}
                  </p>

                  <p>
                    <strong>Category:</strong>
                    ${placemark.category || ""}
                  </p>

                  <p>
                    <strong>County:</strong>
                    ${placemark.county || ""}
                  </p>

                  <p>
                    <strong>Year:</strong>
                    ${placemark.yearEstablished || ""}
                  </p>

                  <p>
                    🌡️ ${weatherText}
                  </p>

                </div>
              `);
            }
          });
        }
        
        map.invalidateSize();
        
      }, 200);
    }
  }
  
</script>

<svelte:head>

<script src="https://unpkg.com/frappe-charts@1.6.2/dist/frappe-charts.min.iife.js"></script>

<link
rel="stylesheet"
href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

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
    
    <div
    id="adminMap"
    class="mt-4"
    style="height: 500px;"
    ></div>
    
    {/if}
    
  </div>
  
  <div class="box">
    
    <button
    class="button is-fullwidth is-link"
    onclick={() => showUsers = !showUsers}
    >
    Toggle Users
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
  Toggle Collections
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
  Toggle Placemarks
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