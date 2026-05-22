<script lang="ts">
  
  import AddPlacemarkForm from "$lib/ui/AddPlacemarkForm.svelte";
  import PlacemarkCard from "$lib/ui/PlacemarkCard.svelte";
  import PlacemarkMap from "$lib/ui/PlacemarkMap.svelte";
  //import { collectionService } from "$lib/services/collection-service";
  import { currentPlacemarks } from "$lib/runes.svelte";
  
  import type { PageProps } from "./$types";
  
  let { data }: PageProps = $props();//gets collection data from the server load function
  
  // svelte-ignore state_referenced_locally
  console.log(data);
  
  // svelte-ignore state_referenced_locally
  const collection = data.collection;
  
  // svelte-ignore state_referenced_locally
  console.log( "COLLECTION DATA:", collection );
  
  //const token = data.session.token;
  
  $effect(() => {
    
    currentPlacemarks.placemarks =
    collection?.placemarks || [];
    
  });
  
  let error = $state("");
  
  let newPlaceName = $state("");
  
  let newPlaceDescription =
  $state("");
  
  let newLatitude = $state(0);
  
  let newLongitude = $state(0);
  
  let newCategory =
  $state("General");
  
  let newYear = $state(0);
  
  let newCounty = $state("");
  
  let selectedFiles: File[] = [];
  
  let editingId =
  $state<string | null>(null);
    
  let editedName = $state("");
    
  let editedDescription =
  $state("");
    
  let editedLatitude = $state("");
    
  let editedLongitude = $state("");
    
  let editedCategory = $state("");
    
  let editedYear = $state("");
    
  let editedCounty = $state("");
    
  function handleFile(e) {
      
    // @ts-ignore
    selectedFiles =
    Array.from(e.target.files);
  }
    
  async function addPlacemark() {
    if (!selectedFiles.length) {
      error = "Image required";
      return;
    }
      
    const fd = new FormData();
      
    fd.append("name", newPlaceName);
    fd.append("description", newPlaceDescription);
    fd.append("latitude", String(newLatitude));
    fd.append("longitude", String(newLongitude));
    fd.append("category", newCategory);
    fd.append("yearEstablished", String(newYear));
    fd.append("county", newCounty);
      
    selectedFiles.forEach((file) => {
      fd.append("imagefiles", file);
    });
      
    try {
      await fetch("?/addPlacemark", {
        method: "POST",
        body: fd
      });
        
      window.location.reload();
    } catch (err) {
      console.log(err);
      error = "Server error";
    }
  }
    
  async function deletePlacemark(id: string) {
    const fd = new FormData();
    fd.append("id", id);
      
    await fetch("?/deletePlacemark", {
      method: "POST",
      body: fd
    });
      
    window.location.reload();
  }
    
  function startEdit(p) {
    editingId = p._id;
      
    editedName = p.name;
      
    editedDescription =
    p.description;
      
    editedLatitude =
    String(p.latitude);
      
    editedLongitude =
    String(p.longitude);
      
    editedCategory =
    p.category;
      
    editedYear =
    String(p.yearEstablished);
      
    editedCounty =
    p.county;
  }
    
  async function saveEdit(id: string) {
    const fd = new FormData();
      
    fd.append("id", id);
    fd.append("name", editedName);
    fd.append("description", editedDescription);
    fd.append("latitude", editedLatitude);
    fd.append("longitude", editedLongitude);
    fd.append("category", editedCategory);
    fd.append("yearEstablished", editedYear);
    fd.append("county", editedCounty);
      
    await fetch("?/updatePlacemark", {
      method: "POST",
      body: fd
    });
      
    editingId = null;
      
    window.location.reload();
  }
    
</script>
  
<section class="section">
    
  <div class="container">
      
    {#if error}
      
      <div class="notification is-danger">
        {error}
      </div>
      
    {/if}
      
    {#if collection}
      
      <h1 class="title">
        {collection.name}
      </h1>
      
      <PlacemarkMap
        mapId="collectionMap"
        placemarks={currentPlacemarks.placemarks}
        enableClickToSetCoordinates={true}
        setCoordinates={(latitude, longitude) => {
          newLatitude = latitude;
          newLongitude = longitude;
        }}
      />
      
      <div class="columns is-multiline">
        
        {#each currentPlacemarks.placemarks || [] as place}
        
          <PlacemarkCard
            {place}
            {editingId}
            bind:editedName
            bind:editedDescription
            bind:editedLatitude
            bind:editedLongitude
            bind:editedCategory
            bind:editedYear
            bind:editedCounty
            {startEdit}
            {saveEdit}
            {deletePlacemark}
          />
        
        {/each}
        
      </div>
      
      <AddPlacemarkForm
        bind:newPlaceName
        bind:newPlaceDescription
        bind:newLatitude
        bind:newLongitude
        bind:newCategory
        bind:newYear
        bind:newCounty
        {handleFile}
        {addPlacemark}
      />
      
      <p class="mt-3">
        
        Find coordinates:
        
        <a
          href="https://www.latlong.net/"
          target="_blank"
        >
          latlong.net
        </a>
      
      </p>
    
    {/if}
    
  </div>
  
</section>