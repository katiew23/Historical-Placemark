<script lang="ts">
  import { onMount } from "svelte";

  const { params } = $props();

  let placemark = $state(null);
  let error = $state("");

  let selectedFiles = [];
  let uploadError = $state("");

  // add review
  let reviewName = $state("");
  let reviewText = $state("");
  let reviewStars = $state(5);

  // edit review
  let editingReviewIndex = $state(null);

  let editedReviewName = $state("");
  let editedReviewText = $state("");
  let editedReviewStars = $state(5);

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

    fd.append("reviewName", reviewName);
    fd.append("reviewText", reviewText);
    fd.append("reviewStars", reviewStars);

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

      reviewName = "";
      reviewText = "";
      reviewStars = 5;

      await loadPlacemark();

    } catch {

      uploadError = "Server error";
    }
  }

  function startReviewEdit(index) {

    editingReviewIndex = index;

    editedReviewName =
      placemark.reviews?.[index]?.name || "";

    editedReviewText =
      placemark.reviews?.[index]?.text || "";

    editedReviewStars =
      placemark.reviews?.[index]?.rating || 5;
  }

  async function saveReview(index) {

    await fetch(
      `http://localhost:3000/api/placemarks/${params.id}/reviews/${index}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },

        body: JSON.stringify({
          name: editedReviewName,
          text: editedReviewText,
          rating: editedReviewStars
        })
      }
    );

    editingReviewIndex = null;

    await loadPlacemark();
  }

  async function deleteReview(index) {

    await fetch(
      `http://localhost:3000/api/placemarks/${params.id}/reviews/${index}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    await loadPlacemark();
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

            <div class="image-grid">

              {#each placemark.images as image, index}

                <div class="image-tile">

                  <img
                    src={image}
                    alt={placemark.name}
                    class="gallery-image"
                  />

                  <div class="review-card">

                    {#if editingReviewIndex === index}

                      <input
                        class="input"
                        bind:value={editedReviewName}
                      />

                      <textarea
                        class="textarea mt-2"
                        bind:value={editedReviewText}
                      ></textarea>

                      <div class="select mt-2">

                        <select bind:value={editedReviewStars}>
                          <option value="1">⭐</option>
                          <option value="2">⭐⭐</option>
                          <option value="3">⭐⭐⭐</option>
                          <option value="4">⭐⭐⭐⭐</option>
                          <option value="5">⭐⭐⭐⭐⭐</option>
                        </select>

                      </div>

                      <button
                        class="button is-success mt-3 mr-2"
                        onclick={() => saveReview(index)}
                      >
                        Save
                      </button>

                    {:else}

                      <p class="has-text-weight-bold">
                        {placemark.reviews?.[index]?.name || "Anonymous"}
                      </p>

                      <p>
                        {"⭐".repeat(
                          Number(
                            placemark.reviews?.[index]?.rating || 0
                          )
                        )}
                      </p>

                      <p>
                        {placemark.reviews?.[index]?.text ||
                          "No review added yet."}
                      </p>

                      <button
                        class="button is-small is-warning mt-3 mr-2"
                        onclick={() => startReviewEdit(index)}
                      >
                        Edit
                      </button>

                      <button
                        class="button is-small is-danger mt-3"
                        onclick={() => deleteReview(index)}
                      >
                        Delete
                      </button>

                    {/if}

                  </div>

                </div>

              {/each}

            </div>

          {:else if placemark.img}

            <div class="image-tile">

              <img
                src={placemark.img}
                alt={placemark.name}
                class="gallery-image"
              />

            </div>

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

            <input
              class="input mt-3"
              placeholder="Your name"
              bind:value={reviewName}
            />

            <textarea
              class="textarea mt-3"
              placeholder="Leave a review"
              bind:value={reviewText}
            ></textarea>

            <div class="select mt-3">

              <select bind:value={reviewStars}>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>

            </div>

            <button
              class="button is-primary mt-4"
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

<style>

  .image-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .image-tile {
    display: flex;
    flex-direction: column;
  }

  .gallery-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 12px 12px 0 0;
    transition: transform 0.3s ease;
  }

  .gallery-image:hover {
    transform: scale(1.02);
  }

  .review-card {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 0 0 12px 12px;
  }

</style>