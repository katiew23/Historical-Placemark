<script lang="ts">

  import { userService } from "$lib/services/user-service";

  interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  let firstName = $state<string>("");

  let lastName = $state<string>("");

  let email = $state<string>("");

  let password = $state<string>("");

  async function signup(): Promise<void> {

    try {

      const signupData: SignupData = {
        firstName,
        lastName,
        email,
        password
      };

      const success =
        await userService.signup(signupData);

      if (!success) {

        alert("Signup failed");

        return;
      }

      window.location.href = "/login";

    } catch (err: unknown) {

      console.error(err);

      alert("Server error");
    }
  }

</script>

<div class="box">

  <div class="field">

    <input
      class="input"
      placeholder="First Name"
      bind:value={firstName}
    />

  </div>

  <div class="field">

    <input
      class="input"
      placeholder="Last Name"
      bind:value={lastName}
    />

  </div>

  <div class="field">

    <input
      class="input"
      placeholder="Email"
      bind:value={email}
    />

  </div>

  <div class="field">

    <input
      class="input"
      type="password"
      placeholder="Password"
      bind:value={password}
    />

  </div>

  <button
    class="button is-primary"
    onclick={signup}
  >
    Sign Up • Cláraigh
  </button>

</div>