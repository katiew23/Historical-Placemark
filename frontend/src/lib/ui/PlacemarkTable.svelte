<script lang="ts">

  interface Placemark {
    _id: string;
    name: string;
    category: string;
  }

  let {
    placemarks,
    deletePlacemark
  } = $props<{
    placemarks: Placemark[];
    deletePlacemark: (id: string) => void;
  }>();

</script>

<div class="box">

  <h2 class="subtitle">
    Placemarks • Áitmharcanna
  </h2>

  <table class="table is-fullwidth is-striped">

    <thead>

      <tr>
        <th>Name</th>
        <th>Category</th>
        <th></th>
      </tr>

    </thead>

    <tbody>

      {#each placemarks as placemark (placemark._id)}

        <tr>

          <td>{placemark.name}</td>

          <td>{placemark.category}</td>

          <td>

            <button
              class="button is-danger is-small"
              onclick={() => deletePlacemark(placemark._id)}
            >
              Delete
            </button>

          </td>

        </tr>

      {/each}

    </tbody>

  </table>

</div>