<script lang="ts">

  import CollectionCard from "$lib/ui/CollectionCard.svelte";
  import AddCollectionForm from "$lib/ui/AddCollectionForm.svelte";
  import { currentCollections } from "$lib/runes.svelte";
  

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // svelte-ignore state_referenced_locally
  let collections = data.collections;

  //const token = data.session.token;

  currentCollections.collections =
    collections;

  let error = $state("");

  let newCollectionName = $state("");

  let editingId = $state(null);

  let editedName = $state("");

  
  async function addCollection() {
  try {
    const cleanedName = newCollectionName.trim();

    const irishTranslations: Record<string, string> = {
      waterford: "Port Láirge",
      cork: "Corcaigh",
      dublin: "Baile Átha Cliath",
      galway: "Gaillimh",
      kilkenny: "Cill Chainnigh",
      kerry: "Ciarraí",
      limerick: "Luimneach",
      clare: "An Clár",
      mayo: "Maigh Eo",
      sligo: "Sligeach",
      donegal: "Dún na nGall",
      wexford: "Loch Garman",
      wicklow: "Cill Mhantáin",
      meath: "An Mhí",
      louth: "Lú",
      carlow: "Ceatharlach",
      laois: "Laois",
      offaly: "Uíbh Fhailí",
      westmeath: "An Iarmhí",
      longford: "An Longfort",
      roscommon: "Ros Comáin",
      leitrim: "Liatroim",
      cavan: "An Cabhán",
      monaghan: "Muineachán",
      tipperary: "Tiobraid Árann",
      armagh: "Ard Mhacha",
      antrim: "Aontroim",
      down: "An Dún",
      derry: "Doire",
      tyrone: "Tír Eoghain",
      fermanagh: "Fear Manach"
    };

    const irishName = irishTranslations[cleanedName.toLowerCase()] || "";

    const finalName = irishName
      ? `${cleanedName} • ${irishName}`
      : cleanedName;

    const formData = new FormData();
    formData.append("name", finalName);

    await fetch("?/addCollection", {
      method: "POST",
      body: formData
    });

    window.location.reload();
  } catch (err) {
    console.log(err);
    error = "Server error";
  }
}

  async function deleteCollection(id) {
  try {
    const formData = new FormData();
    formData.append("id", id);

    await fetch("?/deleteCollection", {
      method: "POST",
      body: formData
    });

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
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", editedName);

    await fetch("?/updateCollection", {
      method: "POST",
      body: formData
    });

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

