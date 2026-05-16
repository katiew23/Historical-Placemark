<script lang="ts">

  import { loggedInUser } from "$lib/runes.svelte";

  let {

    place,

    editingId,

    editedName = $bindable(),

    editedDescription = $bindable(),

    editedLatitude = $bindable(),

    editedLongitude = $bindable(),

    editedCategory = $bindable(),

    editedYear = $bindable(),

    editedCounty = $bindable(),

    startEdit,

    saveEdit,

    deletePlacemark

  } = $props();

</script>

<div class="column is-one-third">

  <div class="card">

    <div class="card-content">

      {#if place.img}

        <img
          src={place.img}
          alt={place.name}
          class="mb-4"
        />

      {/if}

      {#if editingId === place._id}

        <input
          class="input"
          bind:value={editedName}
        />

        <input
          class="input mt-2"
          bind:value={editedDescription}
        />

        <input
          class="input mt-2"
          bind:value={editedLatitude}
        />

        <input
          class="input mt-2"
          bind:value={editedLongitude}
        />

        <input
          class="input mt-2"
          bind:value={editedCategory}
        />

        <input
          class="input mt-2"
          bind:value={editedYear}
        />

        <input
          class="input mt-2"
          bind:value={editedCounty}
        />

        <button
          class="button is-success mt-3"
          onclick={() => saveEdit(place._id)}
        >
          Save
        </button>

      {:else}

        <a href={`/placemark/${place._id}`}>

          <p class="title is-6">
            {place.name}
          </p>

        </a>

        <div class="content mt-2">

          <p>
            {place.description}
          </p>

          <p>
            <strong>Category:</strong>
            {place.category}
          </p>

          <p>
            <strong>County:</strong>
            {place.county}
          </p>

          <p>
            <strong>Latitude:</strong>
            {place.latitude}
          </p>

          <p>
            <strong>Longitude:</strong>
            {place.longitude}
          </p>

          <p>
            <strong>Year:</strong>
            {place.yearEstablished}
          </p>

        </div>

        <a
          href={`/placemark/${place._id}`}
          class="button is-link is-light mt-3"
        >
          View
        </a>

      {/if}

    </div>

    {#if loggedInUser._id && place.userid === loggedInUser._id}

      <div class="card-content pt-0">

        <div class="buttons mt-3">

          <button
            class="button is-warning is-light"
            onclick={() => startEdit(place)}
          >
            Edit
          </button>

          <button
            class="button is-danger is-light"
            onclick={() => deletePlacemark(place._id)}
          >
            Delete
          </button>

        </div>

      </div>

    {/if}

  </div>

</div>