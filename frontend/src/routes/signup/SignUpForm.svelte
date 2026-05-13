<script>

  import { userService } from "$lib/services/user-service";

  let firstName = $state("");

  let lastName = $state("");

  let email = $state("");

  let password = $state("");

  async function signup() {

    try {

      const success = await userService.signup({
        firstName,
        lastName,
        email,
        password
      });

      if (!success) {

        alert("Signup failed");

        return;
      }

      window.location.href = "/login";

    } catch (err) {

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
    Sign Up
  </button>

</div>