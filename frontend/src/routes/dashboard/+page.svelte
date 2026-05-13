<script>
  import { onMount } from "svelte";

  import CollectionCard from "$lib/ui/CollectionCard.svelte";
  import AddCollectionForm from "$lib/ui/AddCollectionForm.svelte";

  let collections = $state([]);
  let error = $state("");

  let newCollectionName = $state("");

  let editingId = $state(null);
  let editedName = $state("");

  onMount(() => {
    loadCollections();
  });

  async function loadCollections() {

    try {

      const response = await fetch(
        "http://localhost:3000/api/collections",
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!response.ok) {

        error = "Failed to load collections";

        return;
      }

      const data = await response.json();

      collections = data;

    } catch (err) {

      console.log(err);

      error = "Server error";
    }
  }

  async function addCollection() {

    try {

      const response = await fetch(
        "http://localhost:3000/api/collections",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },

          body: JSON.stringify({
            name: newCollectionName
          })
        }
      );

      if (!response.ok) {
        return;
      }

      newCollectionName = "";

      await loadCollections();

    } catch (err) {

      console.log(err);

      error = "Server error";
    }
  }

  async function deleteCollection(id) {

    try {

      await fetch(
        `http://localhost:3000/api/collections/${id}`,
        {
          method: "DELETE",

          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      await loadCollections();

    } catch (err) {

      console.log(err);

      error = "Server error";
    }
  }

  function startEdit(collection) {

    editingId = collection._id;

    editedName = collection.name;
  }

  async function saveEdit(id) {

    try {

      const response = await fetch(
        `http://localhost:3000/api/collections/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },

          body: JSON.stringify({
            name: editedName
          })
        }
      );

      if (!response.ok) {

        error = "Failed to update collection";

        return;
      }

      editingId = null;

      await loadCollections();

    } catch (err) {

      console.log(err);

      error = "Server error";
    }
  }
</script>

<section class="section">

  <div class="container">

    <h1 class="title">
      Dashboard
    </h1>

    <p class="subtitle">
      Explore your historical collections
    </p>

    {#if error}

      <div class="notification is-danger">
        {error}
      </div>

    {/if}

    <div class="columns is-multiline">

      {#each collections as collection}

        <CollectionCard
          {collection}
          {editingId}
          bind:editedName
          {startEdit}
          {saveEdit}
          {deleteCollection}
        />

      {/each}

    </div>

    <AddCollectionForm
      bind:newCollectionName
      {addCollection}
    />

  </div>

</section>