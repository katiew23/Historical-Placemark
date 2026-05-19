<script lang="ts">
  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let password = $state("");
</script>

<form method="POST" action="?/signup">

  <div class="field">
    <input
      class="input"
      placeholder="First Name"
      bind:value={firstName}
      name="firstName"
    />
  </div>

  <div class="field">
    <input
      class="input"
      placeholder="Last Name"
      bind:value={lastName}
      name="lastName"
    />
  </div>

  <div class="field">
    <input
      class="input"
      placeholder="Email"
      bind:value={email}
      name="email"
    />
  </div>

  <div class="field">
    <input
      class="input"
      type="password"
      placeholder="Password"
      bind:value={password}
      name="password"
    />
  </div>

  <button class="button is-primary">
    Sign Up • Cláraigh
  </button>

</form>
//actual form inputs and submit button for the signup page. The form uses the POST method to send data to the server when the user submits the form. Each input field is bound to a state variable using Svelte's bind:value directive, allowing the component to keep track of the user's input. The name attribute on each input field ensures that the data is properly sent to the server when the form is submitted.