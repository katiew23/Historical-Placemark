<script lang="ts">

  interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }

  let {
    users,
    deleteUser
  } = $props<{
    users: User[];
    deleteUser: (id: string) => void;
  }>();

</script>

<div class="box">
  <h2 class="subtitle">Users • Úsáideoirí</h2>

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
              onclick={() => deleteUser(user._id)}>
              Delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

