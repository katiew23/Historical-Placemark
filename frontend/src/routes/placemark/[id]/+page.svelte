<script lang="ts">
  import { onMount } from "svelte";

  const { params } = $props();

  let placemark = $state(null);
  let error = $state("");

  let selectedFiles = [];
  let uploadError = $state("");

  function handleFiles(e) {
    selectedFiles = Array.from(e.target.files);
  }

  onMount(() => {
    loadPlacemark();
  });

  async function loadPlacemark() {

    try {

      const res = await fetch(
        `http://localhost:3000/api/placemarks/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) {
        error = "Failed to load placemark";
        return;
      }

      placemark = await res.json();

    } catch {

      error = "Server error";
    }
  }

  async function uploadImages() {

    if (!selectedFiles.length) {
      uploadError = "Please select images";
      return;
    }

    const fd = new FormData();

    selectedFiles.forEach((file) => {
      fd.append("imagefiles", file);
    });

    try {

      const res = await fetch(
        `http://localhost:3000/api/placemarks/${params.id}/uploadimage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: fd
        }
      );

      if (!res.ok) {
        uploadError = "Upload failed";
        return;
      }

      selectedFiles = [];

      await loadPlacemark();

    } catch {

      uploadError = "Server error";
    }
  }
</script>

<section class="section">

  <div class="container">

    {#if error}
      <div class="notification is-danger">
        {error}
      </div>
    {/if}

    {#if placemark}

      <h1 class="title">
        {placemark.name}
      </h1>

      <p class="mb-4">
        {placemark.description}
      </p>

      <div class="columns">

        <div class="column is-half">

          {#if placemark.images?.length}

            {#each placemark.images as image}

              <img
                src={image}
                alt={placemark.name}
                class="mb-4"
              />

            {/each}

          {:else if placemark.img}

            <img
              src={placemark.img}
              alt={placemark.name}
              class="mb-4"
            />

          {/if}

        </div>

        <div class="column is-half">

          <div class="box">

            <p><strong>Category:</strong> {placemark.category}</p>

            <p><strong>County:</strong> {placemark.county}</p>

            <p><strong>Year:</strong> {placemark.yearEstablished}</p>

            <p><strong>Latitude:</strong> {placemark.latitude}</p>

            <p><strong>Longitude:</strong> {placemark.longitude}</p>

          </div>

          <div class="box mt-5">

            <h2 class="title is-5">
              Upload More Images
            </h2>

            {#if uploadError}
              <div class="notification is-danger">
                {uploadError}
              </div>
            {/if}

            <input
              type="file"
              multiple
              onchange={handleFiles}
            />

            <button
              class="button is-primary mt-3"
              onclick={uploadImages}
            >
              Upload Images
            </button>

          </div>

        </div>

      </div>

    {/if}

  </div>

</section>