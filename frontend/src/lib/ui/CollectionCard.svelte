<script lang="ts">

  import { loggedInUser } from "$lib/runes.svelte";

  interface Collection {
    _id: string;
    name: string;
    userid: string;
  }

  let {
    collection,
    editingId,
    editedName = $bindable(),
    startEdit,
    saveEdit,
    deleteCollection
  } = $props<{
    collection: Collection;
    editingId: string | null;
    editedName: string;
    startEdit: (collection: Collection) => void;
    saveEdit: (id: string) => void;
    deleteCollection: (id: string) => void;
  }>();

</script>

<div class="column is-one-third">

  <div class="card">

    <div class="card-content">

      {#if editingId === collection._id}

        <input
          class="input"
          bind:value={editedName}
        />

        <button
          class="button is-small is-success mt-2"
          onclick={() => saveEdit(collection._id)}
        >
          Save
        </button>

      {:else}

        <p class="title is-5">
          {collection.name}
        </p>

        <p class="content">
          A collection of historical places.
        </p>

      {/if}

    </div>

    <div class="card-content pt-0">

  <div class="buttons mt-3">

    <a
      href={`/collection/${collection._id}`}
      class="button is-link is-light"
    >
      View
    </a>

    {#if loggedInUser._id && collection.userid === loggedInUser._id}

      <button
        class="button is-warning is-light"
        onclick={() => startEdit(collection)}
      >
        Edit
      </button>

      <button
        class="button is-danger is-light"
        onclick={() => deleteCollection(collection._id)}
      >
        Delete
      </button>

    {/if}

  </div>

</div>

  </div>

</div>