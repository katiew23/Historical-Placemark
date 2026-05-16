<script lang="ts">

  import CollectionCard from "$lib/ui/CollectionCard.svelte";
  import AddCollectionForm from "$lib/ui/AddCollectionForm.svelte";
  import { currentCollections } from "$lib/runes.svelte";
  import { collectionService } from "$lib/services/collection-service";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let collections = data.collections;

  const token = data.session.token;

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

      const irishName =
        irishTranslations[newCollectionName] || "";

      const finalName = irishName
        ? `${newCollectionName} • ${irishName}`
        : newCollectionName;

      await collectionService.addCollection(
        {
          name: finalName
        },
        token
      );

      window.location.reload();

    } catch (err) {

      console.log(err);

      error = "Server error";
    }
  }

  async function deleteCollection(id) {

    try {

      await collectionService.deleteCollection(
        id,
        token
      );

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

      await collectionService.updateCollection(
        id,
        {
          name: editedName
        },
        token
      );

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