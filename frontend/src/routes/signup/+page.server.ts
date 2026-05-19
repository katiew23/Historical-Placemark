import { redirect } from "@sveltejs/kit";//sends user to another page after signup is successful
import { userService } from "$lib/services/user-service";//this is where the user creation logic is handled. 

export const actions = {
  signup: async ({ request }) => {
    const form = await request.formData();

    const signupData = {
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string
    };

    const success = await userService.signup(signupData);//this file does not save the user it passes the data to the userService 

    if (success) {
      throw redirect(303, "/login");//redirect is successful it sends the user to the login page where they can log in with their new account
    }

    return {
      success: false
    };
  }
};

//the server side signup action that receives the form data from the signup page, extracts the relevant fields (first name, last name, email, and password), and calls the userService.signup method to create a new user account. If the signup is successful, it redirects the user to the login page. If the signup fails, it returns an object with a success property set to false, which can be used to display an error message on the frontend.