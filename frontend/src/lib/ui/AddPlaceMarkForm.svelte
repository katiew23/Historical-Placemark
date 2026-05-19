<script lang="ts">
  let {
    newPlaceName = $bindable(),

    newPlaceDescription = $bindable(),

    newLatitude = $bindable(),

    newLongitude = $bindable(),

    newCategory = $bindable(),

    newYear = $bindable(),

    newCounty = $bindable(),

    handleFile,

    addPlacemark
  } = $props<{
    newPlaceName: string;
    newPlaceDescription: string;
    newLatitude: number;
    newLongitude: number;
    newCategory: string;
    newYear: number;
    newCounty: string;
    handleFile: (e: Event) => void;
    addPlacemark: () => void;
  }>();
</script>

<div class="box mt-5">

  <input
    class="input mb-3"
    placeholder="Name"
    bind:value={newPlaceName}
  />

  <input
    class="input mb-3"
    placeholder="Description"
    bind:value={newPlaceDescription}
  />

  <input
    class="input mb-3"
    type="number"
    step="any"
    placeholder="Latitude"
    bind:value={newLatitude}
  />

  <input
    class="input mb-3"
    type="number"
    step="any"
    placeholder="Longitude"
    bind:value={newLongitude}
  />

  <div class="select mb-3 is-fullwidth">
    <select bind:value={newCategory}>
      <option value="Castle">Castle</option>
      <option value="Tower">Tower</option>
      <option value="Abbey">Abbey</option>
      <option value="Monument">Monument</option>
      <option value="Historic Site">Historic Site</option>
    </select>
  </div>

  <input
    class="input mb-3"
    type="number"
    placeholder="Year"
    bind:value={newYear}
  />

  <input
    class="input mb-3"
    placeholder="County"
    bind:value={newCounty}
  />

  <input
    class="mb-4"
    type="file"
    multiple
    onchange={(e) => handleFile(e)}
  />

  <button
    class="button is-primary"
    onclick={addPlacemark}
  >
    Add Placemark
  </button>

</div>