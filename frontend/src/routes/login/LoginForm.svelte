<script lang="ts">
  
  import "../../app.css";
  
  let email = $state("");
  
  let password = $state("");
  
  let error = $state("");
  
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
  
  <form method="POST" action="/login?/login">
    
    <div class="field">
      
      <label class="label" for="email">
        Email
      </label>
      
      <div class="control">
        
        <input
        id="email"
        class="input login-input"
        type="email"
        bind:value={email}
        name="email"
        placeholder="Enter email"
        />
        
      </div>
      
    </div>
    
    <div class="field">
      
      <label class="label" for="password">
        Password
      </label>
      
      <div class="control">
        
        <input
        id="password"
        class="input login-input"
        type="password"
        bind:value={password}
        name="password"
        placeholder="Enter password"
        />
        
      </div>
      
    </div>
    
    <button
    class="button login-button is-fullwidth mt-5"
    >
    Log In
  </button>
  
</form>

</div>