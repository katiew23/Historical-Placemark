<script lang="ts">

  import SignupForm from "./SignupForm.svelte";

</script>

<section class="section">

  <div class="container">

    <h1 class="title">
      Sign Up • Cláraigh
    </h1>

    <p class="subtitle">
      Create an account to manage historical collections and placemarks
    </p>

    <SignupForm />

  </div>

</section>

//the signup page layout that displays a title, subtitle, and the SignupForm component. The SignupForm component contains the actual form inputs and submit button for the signup page. The form uses the POST method to send data to the server when the user submits the form. Each input field is bound to a state variable using Svelte's bind:value directive, allowing the component to keep track of the user's input. The name attribute on each input field ensures that the data is properly sent to the server when the form is submitted.