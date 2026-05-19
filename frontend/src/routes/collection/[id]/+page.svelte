<script lang="ts">
  
  import { onMount, tick } from "svelte";
  import AddPlacemarkForm from "$lib/ui/AddPlacemarkForm.svelte";
  import PlacemarkCard from "$lib/ui/PlacemarkCard.svelte";
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
  
  let L;
  
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
    
    let map: L.Map;
    
    function handleFile(e) {
      
      // @ts-ignore
      selectedFiles =
      Array.from(e.target.files);
    }
    
    onMount(async () => { //loads leaflet only in the browser
      
      const leaflet =
      await import("leaflet");
      
      L = leaflet.default;
      
      await tick();
      
      initMap();
    });
    
    function initMap() {
      
      if (map) map.remove();
      
      map = L.map("map")
      .setView(
      [52.26, -7.11],
      10
      );
      
      const baseLayer =
      L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
        "&copy; OpenStreetMap contributors"
      }
      ).addTo(map);
      
      const tempLayer =
      L.tileLayer(
      "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=af52a9802a4c633460b714fc47b6fb91",
      {
        attribution:
        "OpenWeatherMap"
      }
      );
      
      const cloudsLayer =
      L.tileLayer(
      "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=af52a9802a4c633460b714fc47b6fb91",
      {
        attribution:
        "OpenWeatherMap"
      }
      );
      
      L.control.layers(
      {
        "OpenStreetMap":
        baseLayer
      },
      {
        "Temperature":
        tempLayer,
        
        "Clouds":
        cloudsLayer
      }
      ).addTo(map);
      
      const customIcon =
      L.icon({
        
        iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
        
        shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        
        iconSize:
        [25, 41],
        
        iconAnchor:
        [12, 41],
        
        popupAnchor:
        [1, -34],
        
        shadowSize:
        [41, 41]
      });
      
      if (
      currentPlacemarks
      .placemarks?.length
      ) {
        
        const markers:
        L.Marker[] = [];
        
        currentPlacemarks
        .placemarks
        .forEach((p) => {
          
          if (
          !isNaN(p.latitude) &&
          !isNaN(p.longitude)
          ) {
            
            fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${p.latitude}&lon=${p.longitude}&appid=af52a9802a4c633460b714fc47b6fb91&units=metric`
            )
            .then((res) =>
            res.json()
            )
            .then((weather) => {
              
              const marker =
              L.marker(
              [
              p.latitude,
              p.longitude
              ],
              {
                icon:
                customIcon
              }
              )
              .addTo(map)
              .bindPopup(`
                <div style="min-width:220px">

                  <h3 style="
                    margin-bottom:8px;
                    font-size:18px;
                    font-weight:600;
                  ">
                    ${p.name}
                  </h3>

                  <p style="
                    margin-bottom:12px;
                    color:#666;
                  ">
                    ${p.description || ""}
                  </p>

                  <p>
                    <strong>Category:</strong>
                    ${p.category || ""}
                  </p>

                  <p>
                    <strong>County:</strong>
                    ${p.county || ""}
                  </p>

                  <p>
                    <strong>Year:</strong>
                    ${p.yearEstablished || ""}
                  </p>

                  <p>
                    🌡️ ${weather.main.temp}°C •
                    ${weather.weather[0].main}
                  </p>

                </div>
              `);
              
              markers.push(marker);
              
              if (
              markers.length > 0
              ) {
                
                const group =
                L.featureGroup(
                markers
                );
                
                map.fitBounds(
                group
                .getBounds()
                .pad(0.2)
                );
              }
            });
          }
        });
      }
      
      map.on(
      "click",
      (
      e:
      L.LeafletMouseEvent
      ) => {
        
        newLatitude =
        Number(
        e.latlng.lat
        .toFixed(6)
        );
        
        newLongitude =
        Number(
        e.latlng.lng
        .toFixed(6)
        );
        
        if (
        (window as any)
        .__tempMarker
        ) {
          
          map.removeLayer(
          (window as any)
          .__tempMarker
          );
        }
        
        (
        window as any
        ).__tempMarker =
        L.marker(
        e.latlng,
        {
          icon:
          customIcon
        }
        ).addTo(map);
      }
      );
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
      
      <div
      id="map"
      style="height: 500px;"
      ></div>
      
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