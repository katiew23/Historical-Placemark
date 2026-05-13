<script lang="ts">

  import { loggedInUser } from "$lib/runes.svelte";

  let {
    placemark,
    review,
    index,
    editingReviewIndex,

    editedReviewName = $bindable(),
    editedReviewText = $bindable(),
    editedReviewStars = $bindable(),

    startReviewEdit,
    saveReview,
    deleteReview

  } = $props();

</script>

<div class="image-tile">

  {#if placemark.images?.[index]}
  
    <img
      src={placemark.images[index]}
      alt={placemark.name}
      class="gallery-image"
    />
    
  {/if}

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
        {review.name}
      </p>

      <p>
        {"⭐".repeat(Number(review.rating || 0))}
      </p>

      <p>
        {review.text}
      </p>

      {#if review.userid === loggedInUser._id}

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

    {/if}

  </div>

</div>

<style>

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