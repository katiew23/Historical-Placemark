import { redirect } from "@sveltejs/kit";
import { userService } from "$lib/services/user-service";

export const actions = {
  signup: async ({ request }) => {
    const form = await request.formData();

    const signupData = {
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string
    };

    const success = await userService.signup(signupData);

    if (success) {
      throw redirect(303, "/login");
    }

    return {
      success: false
    };
  }
};