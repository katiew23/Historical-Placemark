<script lang="ts">

  import ReviewCard from "$lib/ui/ReviewCard.svelte";
  import { placemarkService } from "$lib/services/placemark-service";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";

  let { data }: PageProps = $props();

  const id = page.params.id;

  const token = data.session?.token || "";

  let error = $state("");

  let selectedFiles: File[] = [];

  let uploadError = $state("");

  // add review

  let reviewName = $state("");

  let reviewText = $state("");

  let reviewStars = $state(5);

  // edit review

  let editingReviewIndex = $state<number | null>(null);

  let editedReviewName = $state("");

  let editedReviewText = $state("");

  let editedReviewStars = $state(5);

  function handleFiles(e) {

    // @ts-ignore
    selectedFiles = Array.from(e.target.files);
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

      await placemarkService.uploadImages(
        id,
        fd,
        token
      );

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

  function startReviewEdit(index) {

    editingReviewIndex = index;

    editedReviewName =
      data.placemark.reviews?.[index]?.name || "";

    editedReviewText =
      data.placemark.reviews?.[index]?.text || "";

    editedReviewStars =
      data.placemark.reviews?.[index]?.rating || 5;
  }

  async function saveReview(index) {

    try {

      await placemarkService.saveReview(
        id,
        index,
        {
          name: editedReviewName,
          text: editedReviewText,
          rating: editedReviewStars
        },
        token
      );

      editingReviewIndex = null;

      window.location.reload();

    } catch (err) {

      console.log("SAVE REVIEW ERROR:", err);
    }
  }

  async function deleteReview(index) {

    try {

      await placemarkService.deleteReview(
        id,
        index,
        token
      );

      window.location.reload();

    } catch (err) {

      console.log("DELETE REVIEW ERROR:", err);
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