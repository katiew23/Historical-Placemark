<script>
  let { newCollectionName = $bindable(), addCollection } = $props();
</script>

<div class="box mt-5">

  <h2 class="subtitle">Create New Collection</h2>

  <div class="field">
    <input
      class="input"
      placeholder="Collection Name"
      bind:value={newCollectionName}
    />
  </div>

  <button
    class="button is-primary"
    onclick={addCollection}
  >
    Add Collection
  </button>

</div>