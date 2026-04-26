<script>
  import { onMount, tick } from "svelte";
  const { params } = $props();

  let collection = $state(null);
  let error = $state("");

  // ADD
  let newPlaceName = $state("");
  let newPlaceDescription = $state("");
  let newLatitude = $state("");
  let newLongitude = $state("");
  let newCategory = $state("General");
  let newYear = $state("");
  let newCounty = $state("");
  let selectedFile = null;

  // EDIT
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

      const data = await res.json();

      if (!res.ok) {
        error = "Failed to load collection";
        return;
      }

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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    // markers
    const markers = [];
    if (collection?.placemarks?.length) {
      collection.placemarks.forEach((p) => {
        const lat = Number(p.latitude);
        const lng = Number(p.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const m = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`
              <b>${p.name}</b><br/>
              ${p.description || ""}<br/>
              ${p.image ? `<img src="${p.image}" width="140"/>` : ""}
            `);
          markers.push(m);
        }
      });
    }

    // auto-fit to markers
    if (markers.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds());
    }

    // click → fill coords + temp pin
    map.on("click", (e) => {
      newLatitude = e.latlng.lat.toFixed(6);
      newLongitude = e.latlng.lng.toFixed(6);

      if (window.__tempMarker) map.removeLayer(window.__tempMarker);
      window.__tempMarker = L.marker(e.latlng).addTo(map);
    });
  }

  // ✅ ADD (multipart for Cloudinary)
  async function addPlacemark() {
    if (!selectedFile) {
      error = "Image is required";
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
    fd.append("image", selectedFile);

    try {
      const res = await fetch(
        `http://localhost:3000/api/collections/${params.id}/placemarks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
            // DO NOT set Content-Type
          },
          body: fd
        }
      );

      if (!res.ok) {
        const t = await res.text();
        console.log("ADD ERROR:", t);
        error = "Failed to add placemark";
        return;
      }

      // reset
      newPlaceName = "";
      newPlaceDescription = "";
      newLatitude = "";
      newLongitude = "";
      newCategory = "General";
      newYear = "";
      newCounty = "";
      selectedFile = null;

      loadCollection();
    } catch {
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
    editedLatitude = String(p.latitude);
    editedLongitude = String(p.longitude);
    editedCategory = p.category;
    editedYear = String(p.yearEstablished);
    editedCounty = p.county;
  }

  async function saveEdit(id) {
    if (!editedName || !editedDescription || editedLatitude === "" || editedLongitude === "" || !editedCategory || editedYear === "" || !editedCounty) {
      error = "All fields are required";
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/placemarks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: editedName,
          description: editedDescription,
          latitude: Number(editedLatitude),
          longitude: Number(editedLongitude),
          category: editedCategory,
          yearEstablished: Number(editedYear),
          county: editedCounty
        })
      });

      if (!res.ok) {
        const t = await res.text();
        console.log("UPDATE ERROR:", t);
        error = "Failed to update placemark";
        return;
      }

      editingId = null;
      loadCollection();
    } catch {
      error = "Server error";
    }
  }
</script>

<section class="section">
  <div class="container">

    {#if error}
      <div class="notification is-danger">{error}</div>
    {/if}

    {#if collection}
      <h1 class="title">{collection.name}</h1>
      <p class="subtitle">Places of interest in this collection</p>

      <!-- MAP -->
      <div id="map" style="height:300px; margin-bottom: 20px;"></div>

      <!-- LIST -->
      <div class="columns is-multiline">
        {#each collection.placemarks || [] as place}
          <div class="column is-one-third">
            <div class="card">
              <div class="card-content">

                {#if place.image}
                  <figure class="image mb-2">
                    <img src={place.image} alt={place.name} />
                  </figure>
                {/if}

                {#if editingId === place._id}
                  <input class="input mb-2" bind:value={editedName} />
                  <input class="input mb-2" bind:value={editedDescription} />
                  <input type="number" class="input mb-2" bind:value={editedLatitude} />
                  <input type="number" class="input mb-2" bind:value={editedLongitude} />
                  <input class="input mb-2" bind:value={editedCategory} />
                  <input type="number" class="input mb-2" bind:value={editedYear} />
                  <input class="input mb-2" bind:value={editedCounty} />

                  <button class="button is-small is-success" on:click={() => saveEdit(place._id)}>
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

      <!-- ADD -->
      <div class="box mt-5">
        <div class="field is-horizontal">
          <div class="field-body">

            <input class="input" placeholder="Name" bind:value={newPlaceName} />
            <input class="input" placeholder="Description" bind:value={newPlaceDescription} />
            <input type="number" class="input" placeholder="Latitude" bind:value={newLatitude} />
            <input type="number" class="input" placeholder="Longitude" bind:value={newLongitude} />

            <div class="select">
              <select bind:value={newCategory}>
                <option value="">Category</option>
                <option>Castle</option>
                <option>Tower</option>
                <option>Abbey</option>
                <option>Monument</option>
                <option>Historic Site</option>
              </select>
            </div>

            <input type="number" class="input" placeholder="Year" bind:value={newYear} />
            <input class="input" placeholder="County" bind:value={newCounty} />

          </div>
        </div>

        <div class="field mt-2">
          <input type="file" on:change={handleFile} />
        </div>

        <button class="button is-primary mt-2" on:click={addPlacemark}>
          Add Placemark
        </button>

        <p class="mt-3">
          Find coordinates:
          <a href="https://www.latlong.net/" target="_blank">latlong.net</a>
        </p>
      </div>

    {/if}
  </div>
</section>