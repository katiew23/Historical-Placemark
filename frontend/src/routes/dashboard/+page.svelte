<script>
  import CollectionCard from "$lib/ui/CollectionCard.svelte";
  import AddCollectionForm from "$lib/ui/AddCollectionForm.svelte";
  
  let collections = $state([]);
  let error = $state("");
  
  let newCollectionName = $state("");
  
  let editingId = $state(null);
  let editedName = $state("");
  
  async function loadCollections() {
    try {
      const response = await fetch("http://localhost:3000/api/collections", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        error = "Failed to load collections";
        return;
      }
      
      collections = data;
      
    } catch {
      error = "Server error";
    }
  }
  
  async function addCollection() {
    try {
      const response = await fetch("http://localhost:3000/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: newCollectionName })
      });
      
      if (!response.ok) return;
      
      newCollectionName = "";
      loadCollections();
      
    } catch {}
  }
  
  async function deleteCollection(id) {
    try {
      await fetch(`http://localhost:3000/api/collections/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      loadCollections();
      
    } catch {}
  }
  
  function startEdit(collection) {
    editingId = collection._id;
    editedName = collection.name;
  }
  
  async function saveEdit(id) {
    try {
      await fetch(`http://localhost:3000/api/collections/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: editedName })
      });
      
      editingId = null;
      loadCollections();
      
    } catch {}
  }
  
  loadCollections();
</script>

<section class="section">
  <div class="container">
    
    <h1 class="title">Dashboard</h1>
    <p class="subtitle">Explore your historical collections</p>
    
    {#if error}
    <div class="notification is-danger">{error}</div>
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