<script>
    let email = $state("");
    let password = $state("");
    let error = $state("");

    async function login() {
        error = "";

        try {
            const response = await fetch("http://localhost:3000/api/users/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || !data.token) {
                error = "Login failed";
                return;
            }

            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";

        } catch {
            error = "Server error";
        }
    }
</script>

<h1>Log In</h1>

{#if error}
<p>{error}</p>
{/if}

<input placeholder="Email" bind:value={email} />
<input type="password" placeholder="Password" bind:value={password} />

<button onclick={login}>Log In</button>