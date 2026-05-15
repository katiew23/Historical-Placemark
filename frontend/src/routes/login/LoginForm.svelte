<script lang="ts">

  import { userService } from "$lib/services/user-service";
  import { loggedInUser } from "$lib/runes.svelte";
  import "../../app.css";

  interface LoginResponse {
    token: string;
    role: string;
    email?: string;
    name?: string;
    _id: string;
  }

  let email = $state<string>("");

  let password = $state<string>("");

  let error = $state<string>("");

  async function login(): Promise<void> {

    error = "";

    try {

      const data: LoginResponse =
        await userService.login(
          email,
          password
        );

      console.log(data);

      if (!data) {

        error = "Login failed";

        return;
      }

      loggedInUser.email = email;

      loggedInUser.name =
        data.name || data.email || "";

      loggedInUser.role =
        data.role || "";

      loggedInUser.token =
        data.token || "";

      loggedInUser._id =
        data._id || "";

      localStorage.setItem(
        "token",
        data.token
      );

      if (data.role) {

        localStorage.setItem(
          "role",
          data.role
        );
      }

      localStorage.setItem(
        "name",
        email
      );

      localStorage.setItem(
        "_id",
        data._id
      );

      window.location.href = "/dashboard";

    } catch (err: unknown) {

      console.error(err);

      error = "Server error";
    }
  }

</script>
<div class="login-box">

  <h2 class="title is-3 has-text-centered mb-5">
    Log In
  </h2>

  {#if error}

    <div class="notification is-danger">
      {error}
    </div>

  {/if}

  <div class="field">

    <label class="label">
      Email
    </label>

    <div class="control">

      <input
        class="input login-input"
        type="email"
        bind:value={email}
        placeholder="Enter email"
      />

    </div>

  </div>

  <div class="field">

    <label class="label">
      Password
    </label>

    <div class="control">

      <input
        class="input login-input"
        type="password"
        bind:value={password}
        placeholder="Enter password"
      />

    </div>

  </div>

  <button
    class="button login-button is-fullwidth mt-5"
    onclick={login}
  >
    Log In
  </button>

</div>

