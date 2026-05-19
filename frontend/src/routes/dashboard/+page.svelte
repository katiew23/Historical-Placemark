<script lang="ts">

  import CollectionCard from "$lib/ui/CollectionCard.svelte";
  import AddCollectionForm from "$lib/ui/AddCollectionForm.svelte";
  import { currentCollections } from "$lib/runes.svelte";
  

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // svelte-ignore state_referenced_locally
  let collections = data.collections;

  //const token = data.session.token;

  currentCollections.collections =
    collections;

  let error = $state("");

  let newCollectionName = $state("");

  let editingId = $state(null);

  let editedName = $state("");

  const irishTranslations: Record<string, string> = {
    Waterford: "Port Láirge",
    Cork: "Corcaigh",
    Dublin: "Baile Átha Cliath",
    Galway: "Gaillimh",
    Kilkenny: "Cill Chainnigh"
  };

  async function addCollection() {
  try {
    const irishName = irishTranslations[newCollectionName] || "";

    const finalName = irishName
      ? `${newCollectionName} • ${irishName}`
      : newCollectionName;

    const formData = new FormData();
    formData.append("name", finalName);

    await fetch("?/addCollection", {
      method: "POST",
      body: formData
    });

    window.location.reload();
  } catch (err) {
    console.log(err);
    error = "Server error";
  }
}

  async function deleteCollection(id) {
  try {
    const formData = new FormData();
    formData.append("id", id);

    await fetch("?/deleteCollection", {
      method: "POST",
      body: formData
    });

    window.location.reload();
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
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", editedName);

    await fetch("?/updateCollection", {
      method: "POST",
      body: formData
    });

    editingId = null;
    window.location.reload();
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
      Explore your historical collections • Bailiúcháin Stairiúla
    </p>
    
    {#if error}
    
    <div class="notification is-danger">
      {error}
    </div>
    
    {/if}
    
    <div class="columns is-multiline">
      
      {#each currentCollections.collections as collection}
      
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

//dashboard receives data.collections from dashboar server, puts them in currentCollections store, displays each one using collection card and uses add collection to add a new collection
//posts to named server actions add collections, delete collection and update collection to manage collections, reloads the page after each action to show the updated list of collections