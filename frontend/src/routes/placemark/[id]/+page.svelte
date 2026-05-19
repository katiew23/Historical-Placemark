<script lang="ts">
  import ReviewCard from "$lib/ui/ReviewCard.svelte";
  import type { PageProps } from "./$types";
  import WeatherForecastChart from "$lib/ui/WeatherForecastChart.svelte";//this is my trend projection that suits this app

  let { data }: PageProps = $props();//placmark data is passed in from the server load function

  // svelte-ignore state_referenced_locally
  const placemark = data.placemark;

  let error = $state("");

  let selectedFiles: File[] = [];//stores selected image files before upload

  let uploadError = $state("");

  let reviewName = $state("");

  let reviewText = $state("");

  let reviewStars = $state(5);

  let editingReviewIndex = $state<number | null>(null);

  let editedReviewName = $state("");

  let editedReviewText = $state("");

  let editedReviewStars = $state(5);

  function handleFiles(e: Event) {
    const input = e.target as HTMLInputElement;

    if (input.files) {
      selectedFiles = Array.from(input.files);
    }
  }

  async function uploadImages() {
    uploadError = "";

    if (!selectedFiles.length) {
      uploadError = "Please select images";
      return;
    }

    const fd = new FormData();

    selectedFiles.forEach((file) => {
      fd.append("imagefiles", file);
    });

    fd.append("reviewer", reviewName);
    fd.append("review", reviewText);
    fd.append("rating", String(reviewStars));

    try {
      const response = await fetch("?/uploadImages", {
        method: "POST",
        body: fd
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("UPLOAD FAILED:", response.status, text);
        uploadError = "Upload failed";
        return;
      }

      selectedFiles = [];
      reviewName = "";
      reviewText = "";
      reviewStars = 5;

      window.location.reload();
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      uploadError = "Server error";
    }
  }

  function startReviewEdit(index: number) {
    editingReviewIndex = index;

    editedReviewName =
      placemark.reviews?.[index]?.name || "";

    editedReviewText =
      placemark.reviews?.[index]?.text || "";

    editedReviewStars =
      placemark.reviews?.[index]?.rating || 5;
  }

  async function saveReview(index: number) {
    try {
      const fd = new FormData();

      fd.append("index", String(index));
      fd.append("name", editedReviewName);
      fd.append("text", editedReviewText);
      fd.append("rating", String(editedReviewStars));

      const response = await fetch("?/saveReview", {
        method: "POST",
        body: fd
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("SAVE REVIEW FAILED:", response.status, text);
        error = "Review update failed";
        return;
      }

      editingReviewIndex = null;

      window.location.reload();
    } catch (err) {
      console.log("SAVE REVIEW ERROR:", err);
      error = "Server error";
    }
  }

  async function deleteReview(index: number) {
    try {
      const fd = new FormData();

      fd.append("index", String(index));

      const response = await fetch("?/deleteReview", {
        method: "POST",
        body: fd
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("DELETE REVIEW FAILED:", response.status, text);
        error = "Review delete failed";
        return;
      }

      window.location.reload();
    } catch (err) {
      console.log("DELETE REVIEW ERROR:", err);
      error = "Server error";
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

    {#if data.placemark}

      <h1 class="title">
        {data.placemark.name}
      </h1>

      <p class="mb-4">
        {data.placemark.description}
      </p>

      <div class="columns">

        <div class="column is-half">

          {#if data.placemark.reviews?.length}

            <div class="image-grid">

              {#each data.placemark.reviews as review, index}

                <ReviewCard
                  placemark={data.placemark}
                  {review}
                  {index}
                  {editingReviewIndex}
                  bind:editedReviewName
                  bind:editedReviewText
                  bind:editedReviewStars
                  {startReviewEdit}
                  {saveReview}
                  {deleteReview}
                />

              {/each}

            </div>

          {:else if data.placemark.img}

            <div class="image-tile">

              <img
                src={data.placemark.img}
                alt={data.placemark.name}
                class="gallery-image"
              />

            </div>

          {/if}

        </div>

        <div class="column is-half">

          <div class="box">

            <p>
              <strong>Category:</strong>
              {data.placemark.category}
            </p>

            <p>
              <strong>County:</strong>
              {data.placemark.county}
            </p>

            <p>
              <strong>Year:</strong>
              {data.placemark.yearEstablished}
            </p>

            <p>
              <strong>Latitude:</strong>
              {data.placemark.latitude}
            </p>

            <p>
              <strong>Longitude:</strong>
              {data.placemark.longitude}
            </p>

          </div>

          <WeatherForecastChart
            latitude={data.placemark.latitude}
            longitude={data.placemark.longitude}
          />

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

                <option value="1">
                  ⭐
                </option>

                <option value="2">
                  ⭐⭐
                </option>

                <option value="3">
                  ⭐⭐⭐
                </option>

                <option value="4">
                  ⭐⭐⭐⭐
                </option>

                <option value="5">
                  ⭐⭐⭐⭐⭐
                </option>

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