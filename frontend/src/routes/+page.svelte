<script>
    import LoginForm from "./login/LoginForm.svelte";
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

                    <LoginForm />

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

</style>