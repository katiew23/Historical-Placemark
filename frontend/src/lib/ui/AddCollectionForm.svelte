<script lang="ts">

  let {
    newCollectionName = $bindable(),
    addCollection
  } = $props<{
    newCollectionName: string;
    addCollection: () => void;
  }>();

</script>

<div class="box mt-5">

  <h2 class="subtitle">
    Create Collection • Bailiúchán Nua
  </h2>

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