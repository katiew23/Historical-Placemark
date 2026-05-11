<script>
    let email = $state("");
    let password = $state("");
    let error = $state("");

    async function login() {

        error = "";

        try {

            const response = await fetch(
                "http://localhost:3000/api/users/authenticate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                error = "Login failed";
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

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