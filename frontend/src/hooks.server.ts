import { dbConnect } from "$lib/models/db";
import type { Handle } from "@sveltejs/kit";

console.log("hooks.server.ts is running");

await dbConnect();

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  return response;
};