<script lang="ts">
    type Collection = {
        _id: string;
        name: string;
        img?: string;
    };

    let collections = $state([] as Collection[]);
    let error = $state("");

    let newCollectionName = $state("");

    let editingId = $state<string | null>(null);
    let editedName = $state("");

    async function loadCollections(): Promise<void> {
        try {
            const response = await fetch("http://localhost:3000/api/collections", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                error = "Failed to load collections";
                return;
            }

            collections = data as Collection[];

        } catch {
            error = "Server error";
        }
    }

    async function addCollection(): Promise<void> {
        try {
            const response = await fetch("http://localhost:3000/api/collections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
                },
                body: JSON.stringify({ name: newCollectionName })
            });

            if (!response.ok) return;

            newCollectionName = "";
            loadCollections();

        } catch {}
    }

    async function deleteCollection(id: string): Promise<void> {
        try {
            await fetch(`http://localhost:3000/api/collections/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
                }
            });

            loadCollections();

        } catch {}
    }

    function startEdit(collection: Collection): void {
        editingId = collection._id;
        editedName = collection.name;
    }

    async function saveEdit(id: string): Promise<void> {
        try {
            await fetch(`http://localhost:3000/api/collections/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
                },
                body: JSON.stringify({ name: editedName })
            });

            editingId = null;
            loadCollections();

        } catch {}
    }

    loadCollections();
</script>

<section class="section">
  <div class="container">

    <h1 class="title">Dashboard</h1>
    <p class="subtitle">Explore your historical collections</p>

    {#if error}
      <div class="notification is-danger">{error}</div>
    {/if}

    <div class="columns is-multiline">
      {#each collections as collection}
        <div class="column is-one-third">
          <div class="card">
            <div class="card-content">

              {#if editingId === collection._id}
                <input class="input" bind:value={editedName} />
                <button class="button is-small is-success mt-2"
                        onclick={() => saveEdit(collection._id)}>
                  Save
                </button>
              {:else}
                <p class="title is-5">{collection.name}</p>
                <p class="content">A collection of historical places.</p>
              {/if}

            </div>

            <footer class="card-footer">
              <a href={`/collection/${collection._id}`} class="card-footer-item">
                View
              </a>

              <button class="card-footer-item"
                      onclick={() => startEdit(collection)}>
                Edit
              </button>

              <button class="card-footer-item"
                      onclick={() => deleteCollection(collection._id)}>
                Delete
              </button>
            </footer>

          </div>
        </div>
      {/each}
    </div>

    <div class="box mt-5">
      <h2 class="subtitle">Create New Collection</h2>

      <div class="field">
        <input
          class="input"
          placeholder="Collection Name"
          bind:value={newCollectionName}
        />
      </div>

      <button class="button is-primary" onclick={addCollection}>
        Add Collection
      </button>
    </div>

  </div>
</section>