<script lang="ts">

  interface Collection {
    _id: string;
    name: string;
  }

  let {
    collections,
    deleteCollection
  } = $props<{
    collections: Collection[];
    deleteCollection: (id: string) => void;
  }>();

</script>

<div class="box">

  <h2 class="subtitle">
    Collections • Bailiúcháin
  </h2>

  <table class="table is-fullwidth is-striped">

    <thead>

      <tr>
        <th>Title</th>
        <th></th>
      </tr>

    </thead>

    <tbody>

      {#each collections as collection (collection._id)}

        <tr>

          <td>{collection.name}</td>

          <td>

            <button
              class="button is-danger is-small"
              onclick={() => deleteCollection(collection._id)}
            >
              Delete
            </button>

          </td>

        </tr>

      {/each}

    </tbody>

  </table>

</div>

