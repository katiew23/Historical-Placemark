<script>
  import { onMount } from "svelte";
  
  import CollectionCard from "$lib/ui/CollectionCard.svelte";
  import AddCollectionForm from "$lib/ui/AddCollectionForm.svelte";
  import { currentCollections } from "$lib/runes.svelte";
  import { collectionService } from "$lib/services/collection-service";
  
  //let collections = $state([]);
  let error = $state("");
  
  let newCollectionName = $state("");
  
  let editingId = $state(null);
  let editedName = $state("");
  
  onMount(() => {
    loadCollections();
  });
  
  async function loadCollections() {
    
    try {
      
      const data =
      await collectionService.getCollections();
      
      currentCollections.collections = data;
      
    } catch (err) {
      
      console.log(err);
      
      error = "Server error";
    }
  }
  
  async function addCollection() {
    
    try {
      
      await collectionService.addCollection({
        name: newCollectionName
      });      
      
      newCollectionName = "";
      
      await loadCollections();
      
    } catch (err) {
      
      console.log(err);
      
      error = "Server error";
    }
  }
  
  async function deleteCollection(id) {
    
    try {
      
      await collectionService.deleteCollection(id);
      
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
      
      await collectionService.updateCollection(
      id,
      {
        name: editedName
      }
      );
      
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