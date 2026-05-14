<script lang="ts">
  import { onMount } from "svelte";
  import { adminService } from "$lib/services/admin-service";

  import UserTable from "$lib/ui/UserTable.svelte";
  import CollectionTable from "$lib/ui/CollectionTable.svelte";
  import PlacemarkTable from "$lib/ui/PlacemarkTable.svelte";
  import AdminCharts from "$lib/ui/AdminCharts.svelte";

  interface User {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  }

  interface Collection {
    _id: string;
    name?: string;
    userid?: string;
  }

  interface Placemark {
    _id: string;
    name?: string;
    category?: string;
    county?: string;
    latitude?: number;
    longitude?: number;
  }

  let users = $state<User[]>([]);
  let collections = $state<Collection[]>([]);
  let placemarks = $state<Placemark[]>([]);

  let userCount = $state<number>(0);
  let collectionCount = $state<number>(0);
  let placemarkCount = $state<number>(0);

  let categoryLabels = $state<string[]>([]);
  let categoryCounts = $state<number[]>([]);

  let roleLabels = $state<string[]>([]);
  let roleCounts = $state<number[]>([]);

  let countyLabels = $state<string[]>([]);
  let countyCounts = $state<number[]>([]);

  let map: any;

  // COLLAPSIBLE TABLES
  let showUsers = $state(false);
  let showCollections = $state(false);
  let showPlacemarks = $state(false);
  let showMap = $state(false);

  onMount(async () => {

    // ADMIN PROTECTION
    if (localStorage.getItem("role") !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    try {

      // USERS
      users = await adminService.getUsers();
      userCount = users.length;

      // COLLECTIONS
      collections = await adminService.getCollections();
      collectionCount = collections.length;

      // PLACEMARKS
      placemarks = await adminService.getPlacemarks();
      placemarkCount = placemarks.length;

      // CATEGORY ANALYTICS
      const categoryMap: Record<string, number> = {};

      placemarks.forEach((placemark) => {

        const category = placemark.category || "Unknown";

        if (categoryMap[category]) {
          categoryMap[category]++;
        } else {
          categoryMap[category] = 1;
        }
      });

      categoryLabels = Object.keys(categoryMap);
      categoryCounts = Object.values(categoryMap);

      // ROLE ANALYTICS
      const roleMap: Record<string, number> = {};

      users.forEach((user) => {

        const role = user.role || "Unknown";

        if (roleMap[role]) {
          roleMap[role]++;
        } else {
          roleMap[role] = 1;
        }
      });

      roleLabels = Object.keys(roleMap);
      roleCounts = Object.values(roleMap);

      // COUNTY ANALYTICS
      const countyMap: Record<string, number> = {};

      placemarks.forEach((placemark) => {

        const county = placemark.county || "Unknown";

        if (countyMap[county]) {
          countyMap[county]++;
        } else {
          countyMap[county] = 1;
        }
      });

      countyLabels = Object.keys(countyMap);
      countyCounts = Object.values(countyMap);

    } catch (error) {
      console.error("Admin dashboard error:", error);
    }
  });

  async function deleteUser(id: string): Promise<void> {

    try {

      const response = await adminService.deleteUser(id);

      if (response.status === 200 || response.status === 204) {

        users = users.filter((u) => u._id !== id);
        userCount = users.length;
      }

    } catch (error) {
      console.error("Delete user failed:", error);
    }
  }

  async function deleteCollection(id: string): Promise<void> {

    try {

      const response = await adminService.deleteCollection(id);

      if (response.status === 200 || response.status === 204) {

        collections = collections.filter((c) => c._id !== id);
        collectionCount = collections.length;
      }

    } catch (error) {
      console.error("Delete collection failed:", error);
    }
  }

  async function deletePlacemark(id: string): Promise<void> {

    try {

      const response = await adminService.deletePlacemark(id);

      if (response.status === 200 || response.status === 204) {

        placemarks = placemarks.filter((p) => p._id !== id);
        placemarkCount = placemarks.length;
      }

    } catch (error) {
      console.error("Delete placemark failed:", error);
    }
  }



 function toggleMap(): void {

  showMap = !showMap;

  if (showMap) {

    setTimeout(() => {

      if (!map) {

        map = L.map("adminMap").setView(
          [53.4, -7.7],
          7
        );

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "&copy; OpenStreetMap contributors"
          }
        ).addTo(map);

        placemarks.forEach((placemark) => {

          if (
            placemark.latitude &&
            placemark.longitude
          ) {

            L.marker([
              placemark.latitude,
              placemark.longitude
            ])
            .addTo(map)
            .bindPopup(`
              <b>${placemark.name}</b><br>
              ${placemark.category}<br>
              ${placemark.county}
            `);
          }
        });
      }

      map.invalidateSize();

    }, 200);
  }
}
</script>

<svelte:head>
  <script src="https://unpkg.com/frappe-charts@1.6.2/dist/frappe-charts.min.umd.js"></script>

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</svelte:head>

<section class="section">

  <div class="container">

    <h1 class="title">Admin Dashboard</h1>

    <!-- KPI CARDS -->

    <div class="columns">

      <div class="column">
        <div class="box has-text-centered">
          <p class="heading">Users</p>
          <p class="title">{userCount}</p>
        </div>
      </div>

      <div class="column">
        <div class="box has-text-centered">
          <p class="heading">Collections</p>
          <p class="title">{collectionCount}</p>
        </div>
      </div>

      <div class="column">
        <div class="box has-text-centered">
          <p class="heading">Placemarks</p>
          <p class="title">{placemarkCount}</p>
        </div>
      </div>

    </div>

    <!-- CHARTS -->

    <AdminCharts
      {userCount}
      {collectionCount}
      {placemarkCount}

      {categoryLabels}
      {categoryCounts}

      {roleLabels}
      {roleCounts}

      {countyLabels}
      {countyCounts}
    />

    <!-- MAP -->

    <div class="box">

      <button
        class="button is-fullwidth is-success"
        onclick={toggleMap}
      >
        Toggle Placemark Map
      </button>

      {#if showMap}

        <div
          id="adminMap"
          class="mt-4"
          style="height: 500px;"
        ></div>

      {/if}

    </div>

    <!-- USERS -->

    <div class="box">

      <button
        class="button is-fullwidth is-link"
        onclick={() => showUsers = !showUsers}
      >
        Toggle Users
      </button>

      {#if showUsers}

        <div class="mt-4">

          <UserTable
            {users}
            {deleteUser}
          />

        </div>

      {/if}

    </div>

    <!-- COLLECTIONS -->

    <div class="box">

      <button
        class="button is-fullwidth is-info"
        onclick={() => showCollections = !showCollections}
      >
        Toggle Collections
      </button>

      {#if showCollections}

        <div class="mt-4">

          <CollectionTable
            {collections}
            {deleteCollection}
          />

        </div>

      {/if}

    </div>

    <!-- PLACEMARKS -->

    <div class="box">

      <button
        class="button is-fullwidth is-warning"
        onclick={() => showPlacemarks = !showPlacemarks}
      >
        Toggle Placemarks
      </button>

      {#if showPlacemarks}

        <div class="mt-4">

          <PlacemarkTable
            {placemarks}
            {deletePlacemark}
          />

        </div>

      {/if}

    </div>

  </div>

</section>