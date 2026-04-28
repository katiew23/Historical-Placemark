<script>
  import { onMount, tick } from "svelte";
  const { params } = $props();
  
  let collection = $state(null);
  let error = $state("");
  
  let newPlaceName = $state("");
  let newPlaceDescription = $state("");
  let newLatitude = $state("");
  let newLongitude = $state("");
  let newCategory = $state("General");
  let newYear = $state("");
  let newCounty = $state("");
  let selectedFile = null;
  
  let editingId = $state(null);
  let editedName = $state("");
  let editedDescription = $state("");
  let editedLatitude = $state("");
  let editedLongitude = $state("");
  let editedCategory = $state("");
  let editedYear = $state("");
  let editedCounty = $state("");
  
  let map;
  
  function handleFile(e) {
    selectedFile = e.target.files?.[0] ?? null;
  }
  
  onMount(() => {
    loadCollection();
  });
  
  async function loadCollection() {
    try {
      const res = await fetch(`http://localhost:3000/api/collections/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!res.ok) {
        error = "Failed to load collection";
        return;
      }
      
      const data = await res.json();
      collection = data;
      
      await tick();
      initMap();
      
    } catch {
      error = "Server error";
    }
  }
  
  function initMap() {
    if (map) map.remove();
    
    map = L.map("map").setView([52.26, -7.11], 10);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    
    // existing markers
    if (collection?.placemarks?.length) {
      collection.placemarks.forEach((p) => {
        if (!isNaN(p.latitude) && !isNaN(p.longitude)) {
          L.marker([p.latitude, p.longitude])
          .addTo(map)
          .bindPopup(`
              <b>${p.name}</b><br/>
              ${p.description || ""}<br/>
              ${p.img ? `<img src="${p.img}" width="140"/>` : ""}
            `);
        }
      });
    }
    
    // ✅ LAT/LONG HELPER (THIS IS THE FIX)
    map.on("click", (e) => {
      newLatitude = e.latlng.lat.toFixed(6);
      newLongitude = e.latlng.lng.toFixed(6);
      
      if (window.__tempMarker) {
        map.removeLayer(window.__tempMarker);
      }
      
      window.__tempMarker = L.marker(e.latlng).addTo(map);
    });
  }
  
  async function addPlacemark() {
    if (!selectedFile) {
      error = "Image required";
      return;
    }
    
    if (!newPlaceName || !newPlaceDescription || !newLatitude || !newLongitude || !newYear || !newCounty) {
      error = "All fields are required";
      return;
    }
    
    const fd = new FormData();
    fd.append("name", newPlaceName);
    fd.append("description", newPlaceDescription);
    fd.append("latitude", newLatitude);
    fd.append("longitude", newLongitude);
    fd.append("category", newCategory);
    fd.append("yearEstablished", newYear);
    fd.append("county", newCounty);
    fd.append("imagefile", selectedFile);
    
    try {
      const res = await fetch(
      `http://localhost:3000/api/collections/${params.id}/placemarks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: fd
      }
      );
      
      if (!res.ok) {
        const text = await res.text();
        console.log("CREATE ERROR:", text);
        error = "Failed to add placemark";
        return;
      }
      
      // reset
      selectedFile = null;
      newPlaceName = "";
      newPlaceDescription = "";
      newLatitude = "";
      newLongitude = "";
      newCategory = "General";
      newYear = "";
      newCounty = "";
      
      loadCollection();
      
    } catch (err) {
      console.log(err);
      error = "Server error";
    }
  }
  
  async function deletePlacemark(id) {
    await fetch(`http://localhost:3000/api/placemarks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    loadCollection();
  }
  
  function startEdit(p) {
    editingId = p._id;
    editedName = p.name;
    editedDescription = p.description;
    editedLatitude = p.latitude;
    editedLongitude = p.longitude;
    editedCategory = p.category;
    editedYear = p.yearEstablished;
    editedCounty = p.county;
  }
  
  async function saveEdit(id) {
    await fetch(`http://localhost:3000/api/placemarks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        name: editedName,
        description: editedDescription,
        latitude: editedLatitude,
        longitude: editedLongitude,
        category: editedCategory,
        yearEstablished: editedYear,
        county: editedCounty
      })
    });
    
    editingId = null;
    loadCollection();
  }
</script>

<section class="section">
  <div class="container">
    
    {#if error}
    <div class="notification is-danger">{error}</div>
    {/if}
    
    {#if collection}
    <h1 class="title">{collection.name}</h1>
    
    <div id="map" style="height:300px;"></div>
    
    <div class="columns is-multiline">
      {#each collection.placemarks || [] as place}
      <div class="column is-one-third">
        <div class="card">
          <div class="card-content">
            
            {#if place.img}
            <img src={place.img} />
            {/if}
            
            {#if editingId === place._id}
            <input class="input" bind:value={editedName} />
            <input class="input" bind:value={editedDescription} />
            <button class="button is-success" on:click={() => saveEdit(place._id)}>
              Save
            </button>
            {:else}
            <p class="title is-6">{place.name}</p>
            <p>{place.description}</p>
            {/if}
            
          </div>
          
          <footer class="card-footer">
            <button class="card-footer-item" on:click={() => startEdit(place)}>
              Edit
            </button>
            <button class="card-footer-item" on:click={() => deletePlacemark(place._id)}>
              Delete
            </button>
          </footer>
        </div>
      </div>
      {/each}
    </div>
    
    <div class="box mt-5">
      <input class="input" placeholder="Name" bind:value={newPlaceName} />
      <input class="input" placeholder="Description" bind:value={newPlaceDescription} />
      <input class="input" placeholder="Latitude" bind:value={newLatitude} />
      <input class="input" placeholder="Longitude" bind:value={newLongitude} />
      <select class="input" bind:value={newCategory}>
        <option value="Castle">Castle</option>
        <option value="Tower">Tower</option>
        <option value="Abbey">Abbey</option>
        <option value="Monument">Monument</option>
        <option value="Historic Site">Historic Site</option>
      </select>
      <input class="input" placeholder="Year" bind:value={newYear} />
      <input class="input" placeholder="County" bind:value={newCounty} />
      
      <input type="file" on:change={handleFile} />
      
      <button class="button is-primary" on:click={addPlacemark}>
        Add Placemark
      </button>
    </div>
    <p class="mt-3">
      Find coordinates:
      <a href="https://www.latlong.net/" target="_blank">latlong.net</a>
    </p>
    
    {/if}
  </div>
</section>