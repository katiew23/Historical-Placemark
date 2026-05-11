<script lang="ts">
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
      />
      {/if}
      
      {#if editingId === place._id}
      
      <input class="input" bind:value={editedName} />
      <input class="input" bind:value={editedDescription} />
      <input class="input mt-2" bind:value={editedLatitude} />
      <input class="input mt-2" bind:value={editedLongitude} />
      <input class="input mt-2" bind:value={editedCategory} />
      <input class="input mt-2" bind:value={editedYear} />
      <input class="input mt-2" bind:value={editedCounty} />
      
      <button
      class="button is-success"
      onclick={() => saveEdit(place._id)}
      >
      Save
    </button>
    
    {:else}
    
    <a href={`/placemark/${place._id}`}>
      <p class="title is-6">{place.name}</p>
    </a>
    
    <p>{place.description}</p>
    
    {/if}
    
  </div>
  
  <footer class="card-footer">
    
    <button
    class="card-footer-item"
    onclick={() => startEdit(place)}
    >
    Edit
  </button>
  
  <button
  class="card-footer-item"
  onclick={() => deletePlacemark(place._id)}
  >
  Delete
</button>

</footer>

</div>

</div>