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
      
      const text = await response.text();   // ← change this
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

<h1>Sign Up</h1>

<input placeholder="First Name" bind:value={firstName} />
<input placeholder="Last Name" bind:value={lastName} />
<input placeholder="Email" bind:value={email} />
<input type="password" placeholder="Password" bind:value={password} />

<button onclick={signup}>Sign Up</button>