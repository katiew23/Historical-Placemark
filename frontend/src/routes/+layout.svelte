<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { loggedInUser } from "$lib/runes.svelte";

  let { data, children } = $props<{
    data: any;
    children: () => unknown;
  }>();

  $effect(() => {
    if (data.session) {
      loggedInUser.email = data.session.email;
      loggedInUser.name = data.session.name;
      loggedInUser.role = data.session.role;
      loggedInUser.token = data.session.token;
      loggedInUser._id = data.session._id;
    } else {
      loggedInUser.email = "";
      loggedInUser.name = "";
      loggedInUser.role = "";
      loggedInUser.token = "";
      loggedInUser._id = "";
    }
  });

  async function logout(): Promise<void> {
    console.log("Logging out user:", loggedInUser.email);

    loggedInUser.email = "";
    loggedInUser.name = "";
    loggedInUser.role = "";
    loggedInUser.token = "";
    loggedInUser._id = "";

    window.location.href = "/logout";
  }
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon}
  />

  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"
  />

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
</svelte:head>

<nav class="navbar is-light">
  <div class="navbar-brand">
    <a
      class="navbar-item"
      href="/dashboard"
    >
      Historical Placemark • Éire
    </a>
  </div>

  <div class="navbar-end">
    {#if loggedInUser.token}
      <div class="navbar-item">
        <strong>
          {loggedInUser.name}
        </strong>
      </div>

      <div class="navbar-item">
        <a
          href="/dashboard"
          class="button is-light"
        >
          Dashboard
        </a>
      </div>

      {#if loggedInUser.role === "admin"}
        <div class="navbar-item">
          <a
            href="/admin"
            class="button is-light"
          >
            Admin
          </a>
        </div>
      {/if}

      <div class="navbar-item">
        <a
          href="/about"
          class="button is-light"
        >
          About
        </a>
      </div>

      <div class="navbar-item">
        <button
          class="button is-light"
          onclick={logout}
        >
          Logout
        </button>
      </div>
    {/if}
  </div>
</nav>

{@render children()}
