<script lang="ts">
  import { loggedInUser } from "$lib/runes.svelte";

  interface Review {
    image?: string;
    name?: string;
    text?: string;
    rating?: number | string;
    userid?: string;
  }

  interface Placemark {
    name: string;
    images?: string[];
  }

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
  } = $props<{
    placemark: Placemark;
    review: Review;
    index: number;
    editingReviewIndex: number | null;
    editedReviewName: string;
    editedReviewText: string;
    editedReviewStars: number;
    startReviewEdit: (index: number) => void;
    saveReview: (index: number) => void;
    deleteReview: (index: number) => void;
  }>();
</script>
<div class="image-tile">
  {#if review.image}
    <img
      src={review.image}
      alt={placemark.name}
      class="gallery-image"
    />
  {:else if placemark.images?.[index + 1]}
    <img
      src={placemark.images[index + 1]}
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
        class="button is-success mt-3"
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

      {#if loggedInUser._id && String(review.userid) === loggedInUser._id}
        <div class="buttons mt-3">
          <button
            class="button is-warning is-light is-small"
            onclick={() => startReviewEdit(index)}
          >
            Edit
          </button>

          <button
            class="button is-danger is-light is-small"
            onclick={() => deleteReview(index)}
          >
            Delete
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>