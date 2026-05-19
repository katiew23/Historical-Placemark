import { redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { userService } from "$lib/services/user-service";

interface LoginResponse {
    token: string;
    role: string;
    email?: string;
    name?: string;
    _id: string;
}

export const actions = {
    
    login: async ({ request, cookies }) => {
        
        const form = await request.formData();
        
        const email =
        form.get("email") as string;
        
        const password =
        form.get("password") as string;
        
        const data: LoginResponse | null =
        await userService.login(email, password);
        
        if (!data) {
            
            throw redirect(303, "/login");
        }
        
        const session = {
            
            email: data.email || email,
            
            name: data.name || email,
            
            role: data.role || "",
            
            token: data.token || "",
            
            _id: data._id || ""
        };
        
        cookies.set(
            "placemark-user",
            JSON.stringify(session),//saves the login session in a cookie so the user stays logged in when they navigate around the site
            {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: !dev,
                maxAge: 60 * 60 * 24 * 7
            }
        );
        
        throw redirect(303, "/dashboard");
    }
};