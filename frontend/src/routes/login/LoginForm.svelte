<script>
    
    
    import { userService } from "$lib/services/user-service";
    import { loggedInUser } from "$lib/runes.svelte";
    
    
    let email = $state("");
    
    let password = $state("");
    
    let error = $state("");
    
    async function login() {
        
        error = "";
        
        try {
            
            const data = await userService.login(
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
            
            localStorage.setItem("token", data.token);
            
            if (data.role) {
                localStorage.setItem("role", data.role);
            }
            
            localStorage.setItem("name", email);

            localStorage.setItem("_id", data._id);
            
            window.location.href = "/dashboard";
            
        } catch {
            
            error = "Server error";
        }
    }
    
</script>

<div class="box login-box">
    
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
            class="input is-medium"
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
            class="input is-medium"
            type="password"
            bind:value={password}
            placeholder="Enter password"
            />
            
        </div>
        
    </div>
    
    <button
    class="button is-link is-fullwidth is-medium mt-4"
    onclick={login}
    >
    Log In
</button>

</div>

<style>
    
    .login-box {
        border-radius: 16px;
        padding: 2rem;
    }
    
</style>