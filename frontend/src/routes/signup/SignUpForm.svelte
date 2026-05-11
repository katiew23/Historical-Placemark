<script>
  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let password = $state("");

  async function signup() {

    try {

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      const text = await response.text();

      console.log("STATUS:", response.status);
      console.log("RAW:", text);

      if (!response.ok) {
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