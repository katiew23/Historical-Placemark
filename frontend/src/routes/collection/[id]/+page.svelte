<script lang="ts">
  import { onMount, tick } from "svelte";
  import AddPlacemarkForm from "$lib/ui/AddPlacemarkForm.svelte";
  import PlacemarkCard from "$lib/ui/PlacemarkCard.svelte";

  let L;

  const { params } = $props();

  let collection = $state(null);
  let error = $state("");

  let newPlaceName = $state("");
  let newPlaceDescription = $state("");
  let newLatitude = $state(0);
  let newLongitude = $state(0);
  let newCategory = $state("General");
  let newYear = $state(0);
  let newCounty = $state("");

  let selectedFiles = [];

  let editingId = $state(null);

  let editedName = $state("");
  let editedDescription = $state("");
  let editedLatitude = $state("");
  let editedLongitude = $state("");
  let editedCategory = $state("");
  let editedYear = $state("");
  let editedCounty = $state("");

  let map: L.Map;

  function handleFile(e) {
    selectedFiles = Array.from(e.target.files);
  }

  onMount(async () => {

    const leaflet = await import("leaflet");

    L = leaflet.default;

    loadCollection();

  });

  async function loadCollection() {

    try {

      const res = await fetch(
        `http://localhost:3000/api/collections/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

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

    const baseLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors"
      }
    ).addTo(map);

    const precipitationLayer = L.tileLayer(
      "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=af52a9802a4c633460b714fc47b6fb91",
      {
        attribution: "OpenWeatherMap"
      }
    );

    const tempLayer = L.tileLayer(
      "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=af52a9802a4c633460b714fc47b6fb91",
      {
        attribution: "OpenWeatherMap"
      }
    );

    const cloudsLayer = L.tileLayer(
      "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=af52a9802a4c633460b714fc47b6fb91",
      {
        attribution: "OpenWeatherMap"
      }
    );

    L.control.layers(
      {
        "OpenStreetMap": baseLayer
      },
      {
        "Precipitation": precipitationLayer,
        "Temperature": tempLayer,
        "Clouds": cloudsLayer
      }
    ).addTo(map);

    if (collection?.placemarks?.length) {

      const markers: L.Marker[] = [];

      collection.placemarks.forEach((p) => {

        if (!isNaN(p.latitude) && !isNaN(p.longitude)) {

          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${p.latitude}&lon=${p.longitude}&appid=af52a9802a4c633460b714fc47b6fb91&units=metric`
          )
            .then((res) => res.json())
            .then((weather) => {

              const marker = L.marker([p.latitude, p.longitude])
                .addTo(map)
                .bindPopup(`
                  <b>${p.name}</b><br/>
                  ${p.description || ""}<br/><br/>

                  <img 
                    src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"
                    width="60"
                  /><br/>

                  <strong>${weather.weather[0].description}</strong><br/>
                  🌡️ Temp: ${weather.main.temp}°C<br/>
                  💨 Wind: ${weather.wind.speed} km/h<br/>
                  📊 Pressure: ${weather.main.pressure} hPa<br/><br/>

                  ${p.img ? `<img src="${p.img}" width="140"/>` : ""}
                `);

              markers.push(marker);

              if (markers.length > 0) {

                const group = L.featureGroup(markers);

                map.fitBounds(group.getBounds().pad(0.2));
              }
            });
        }
      });
    }

    map.on("click", (e: L.LeafletMouseEvent) => {

      newLatitude = Number(e.latlng.lat.toFixed(6));
      newLongitude = Number(e.latlng.lng.toFixed(6));

      if ((window as any).__tempMarker) {
        map.removeLayer((window as any).__tempMarker);
      }

      (window as any).__tempMarker =
        L.marker(e.latlng).addTo(map);
    });
  }

  async function addPlacemark() {

    if (!selectedFiles.length) {
      error = "Image required";
      return;
    }

    if (
      !newPlaceName ||
      !newPlaceDescription ||
      !newLatitude ||
      !newLongitude ||
      !newYear ||
      !newCounty
    ) {
      error = "All fields are required";
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

      selectedFiles = [];

      newPlaceName = "";
      newPlaceDescription = "";
      newLatitude = 0;
      newLongitude = 0;
      newCategory = "General";
      newYear = 0;
      newCounty = "";

      loadCollection();

    } catch (err) {

      console.log(err);

      error = "Server error";
    }
  }

  async function deletePlacemark(id) {

    await fetch(
      `http://localhost:3000/api/placemarks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

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

    await fetch(
      `http://localhost:3000/api/placemarks/${id}`,
      {
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
      }
    );

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

      <div id="map" style="height: 500px;"></div>

      <div class="columns is-multiline">

        {#each collection.placemarks || [] as place}

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
        <a href="https://www.latlong.net/" target="_blank">
          latlong.net
        </a>
      </p>

    {/if}

  </div>
</section>