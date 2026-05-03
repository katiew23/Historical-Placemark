<script lang="ts">
    let email = $state("");
    let password = $state("");
    let error = $state("");
    
    async function login(): Promise<void> {
        error = "";
        
        try {
            const response = await fetch("http://localhost:3000/api/users/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json() as { token?: string };
            
            if (!response.ok || !data.token) {
                error = "Login failed";
                return;
            }
            
            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";
            
            console.log("Logged in:", data);
            
        } catch (err: any) {
            error = "Server error";
        }
    }
</script>

<section class="section">
    <div class="container">
        
        <div class="columns is-vcentered is-centered">
            
            <!-- Left: Welcome -->
            <div class="column is-half has-text-centered">
                <h1 class="title">Historical Placemark</h1>
                
                <p class="subtitle">
                    Explore and organise places of historical interest.
                </p>
                
                <h1>Historical Placemark</h1>
                
                <p>Explore and organise places of historical interest.</p>
                
                <a href="/signup">
                    <button>Sign Up</button>
                </a>
                
                <a href="/login">
                    <button>Log In</button>
                </a>
                
                <p class="mb-5">
                    Sign up or log in to create collections and manage your placemarks.
                </p>

                
                
                <img 
                src="/images/reginalds.jpg" alt="Historical Placemark Image"
                style="max-width: 300px; border-radius: 10px;"
                >
            </div>
            
            <!-- Right: Login -->
            <div class="column is-half">
                <h2 class="title is-4">Log in</h2>
                
                {#if error}
                <div class="notification is-danger">
                    {error}
                </div>
                {/if}
                
                <div class="field">
                    <label class="label">Email</label>
                    <input class="input" bind:value={email} placeholder="Enter email" />
                </div>
                
                <div class="field">
                    <label class="label">Password</label>
                    <input type="password" class="input" bind:value={password} placeholder="Enter password" />
                </div>
                
                <button class="button is-link" onclick={login}>
                    Submit
                </button>
            </div>
            
        </div>
        
    </div>
</section>
