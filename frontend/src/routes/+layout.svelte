<script>
  import favicon from '$lib/assets/favicon.svg';
  import { loggedInUser } from "$lib/runes.svelte";
  import { onMount } from "svelte";
  
  const { children } = $props();
  
  //let role = $state("");
  // let name = $state("");
  
  function logout() {
    
    loggedInUser.email = "";
    loggedInUser.name = "";
    loggedInUser.role = "";
    loggedInUser.token = "";
    
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    
    window.location.href = "/";
  }
  
  
  
  onMount(async () => {
    
    loggedInUser.token =
    localStorage.getItem("token") || "";
    
    loggedInUser.role =
    localStorage.getItem("role") || "";
    
    loggedInUser.name =
    localStorage.getItem("name") || "";
    
    loggedInUser._id =
    localStorage.getItem("_id") || "";
    
    // load Leaflet properly
    if (!window.L) {
      await import("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
    }
  });
</script>

<svelte:head>
<link rel="icon" href={favicon} />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<nav class="navbar is-light">
  <div class="navbar-brand">
    <a class="navbar-item" href="/dashboard">
      Historical Placemark
    </a>
  </div>
  
  <div class="navbar-end">
    
    {#if loggedInUser.token}
    
    <div class="navbar-item">
      
      <p><span>{loggedInUser.name}</span></p>
      
      <a href="/dashboard" class="button is-light">
        Dashboard
      </a>
      
      {#if loggedInUser.role === "admin"}
      <a href="/admin" class="button is-light">
        Admin
      </a>
      {/if}
      
      <a href="/about" class="button is-light">
        About
      </a>
      
      <button class="button is-light" onclick={logout}>
        Logout
      </button>
      
    </div>
    
    {/if}
    
  </div>
  
</nav>

{@render children()}