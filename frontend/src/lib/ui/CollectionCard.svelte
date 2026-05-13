<script>
  import { loggedInUser } from "$lib/runes.svelte";
  
  let {
    collection,
    editingId,
    editedName = $bindable(),
    startEdit,
    saveEdit,
    deleteCollection
  } = $props();
</script>

<div class="column is-one-third">
  
  <div class="card">
    
    <div class="card-content">
      
      {#if editingId === collection._id}
      
      <input class="input" bind:value={editedName} />
      
      <button
      class="button is-small is-success mt-2"
      onclick={() => saveEdit(collection._id)}
      >
      Save
    </button>
    
    {:else}
    
  
    <p class="title is-5">{collection.name}</p>
    
    <p class="content">
      A collection of historical places.
    </p>
    
    {/if}
    
  </div>
  
  <footer class="card-footer">
    
    <a
    href={`/collection/${collection._id}`}
    class="card-footer-item"
    >
    View
  </a>
  
  {#if collection.userid === loggedInUser._id}
  
  <button
  class="card-footer-item"
  onclick={() => startEdit(collection)}
  >
  Edit
</button>

<button
class="card-footer-item"
onclick={() => deleteCollection(collection._id)}
>
Delete
</button>

{/if}

</footer>

</div>

</div>