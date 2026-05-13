<script>
  import favicon from '$lib/assets/favicon.svg';
  import { onMount } from "svelte";

  const { children } = $props();

  let role = $state("");
  let name = $state("");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    window.location.href = "/";
  }

  onMount(async () => {

    role = localStorage.getItem("role") || "";
    name = localStorage.getItem("name") || "";

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
    <div class="navbar-item">

    <p><span>{name}</span></p>

      <a href="/dashboard" class="button is-light">
        Dashboard
      </a>

      {#if role === "admin"}
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
  </div>
</nav>

{@render children()}