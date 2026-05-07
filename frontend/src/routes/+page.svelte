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

            window.location.href = "/dashboard";

        } catch {

            error = "Server error";
        }
    }
</script>

<section class="hero is-fullheight has-background-light">

    <div class="hero-body">

        <div class="container">

            <div class="columns is-vcentered">

                <!-- LEFT SIDE -->

                <div class="column is-half has-text-centered">

                    <h1 class="title is-1 has-text-dark">
                        Historical Placemark
                    </h1>

                    <p class="subtitle is-5 mb-5">
                        Explore and organise places of historical interest.
                    </p>

                    <img
                        src="/images/reginalds.jpg"
                        alt="Historical Placemark"
                        class="landing-image"
                    />

                    <div class="mt-5">

                        <a href="/signup">
                            <button class="button is-primary is-medium mr-3">
                                Sign Up
                            </button>
                        </a>

                    </div>

                </div>

                <!-- RIGHT SIDE -->

                <div class="column is-5 is-offset-1">

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

                </div>

            </div>

        </div>

    </div>

</section>

<style>

    .landing-image {
        max-width: 340px;
        width: 100%;
        border-radius: 16px;
        box-shadow: 0 4px 18px rgba(0,0,0,0.15);
    }

    .login-box {
        border-radius: 16px;
        padding: 2rem;
    }

</style>