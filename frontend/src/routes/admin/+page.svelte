<script lang="ts">
  import { onMount } from "svelte";

  type User = {
    _id: string;
  };

  type Collection = {
    _id: string;
  };

  type Placemark = {
    _id: string;
  };

  let users = $state([] as User[]);
  let userCount = $state(0);
  let collectionCount = $state(0);
  let placemarkCount = $state(0);
  let collections = $state([] as Collection[]);
  let placemarks = $state([] as Placemark[]);

  onMount(async (): Promise<void> => {
    const token = localStorage.getItem("token") ?? "";

    // USERS
    const res = await fetch("http://localhost:3000/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usersData = await res.json();
    users = usersData as User[];
    userCount = users.length;

    // COLLECTIONS
    const colRes = await fetch("http://localhost:3000/api/collections", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const collectionsData = await colRes.json();
    collections = collectionsData as Collection[];
    collectionCount = collections.length;

    // PLACEMARKS
    const placeRes = await fetch("http://localhost:3000/api/placemarks", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const placemarksData = await placeRes.json();
    placemarks = placemarksData as Placemark[];
    placemarkCount = placemarks.length;

    loadChart();
  });

  function deleteUser(id: string): void {
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`
      }
    }).then(() => {
      users = users.filter(u => u._id !== id);
      userCount = users.length;
    });
  }

  function deleteCollection(id: string): void {
    fetch(`http://localhost:3000/api/collections/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`
      }
    }).then(() => {
      collections = collections.filter(c => c._id !== id);
      collectionCount = collections.length;
    });
  }

  function deletePlacemark(id: string): void {
    fetch(`http://localhost:3000/api/placemarks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`
      }
    }).then(() => {
      placemarks = placemarks.filter(p => p._id !== id);
      placemarkCount = placemarks.length;
    });
  }

  function loadChart(): void {
    new (window as any).frappe.Chart("#adminChart", {
      title: "Platform Overview",
      type: "bar",
      height: 300,
      data: {
        labels: ["Users", "Collections", "Placemarks"],
        datasets: [
          {
            values: [userCount, collectionCount, placemarkCount]
          }
        ]
      }
    });
  }
</script>

<svelte:head>
  <script src="https://unpkg.com/frappe-charts@1.6.2/dist/frappe-charts.min.umd.js"></script>
</svelte:head>

<section class="section">
  <div class="container">

    <h1 class="title">Admin Dashboard</h1>

    <!-- CHART -->
    <div class="box">
      <h2 class="subtitle">System Analytics</h2>
      <div id="adminChart" style="height:300px;"></div>
    </div>

    <!-- USERS -->
    <div class="box">
      <h2 class="subtitle">Users</h2>

      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {#each users as user (user._id)}
            <tr>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  class="button is-danger is-small"
                  on:click={() => deleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- COLLECTIONS -->
    <div class="box">
      <h2 class="subtitle">Collections</h2>

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
                  on:click={() => deleteCollection(collection._id)}>
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- PLACEMARKS -->
    <div class="box">
      <h2 class="subtitle">Placemarks</h2>

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
                  on:click={() => deletePlacemark(placemark._id)}>
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

  </div>
</section>