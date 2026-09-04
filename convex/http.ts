import { httpRouter } from "convex/server";

// Auth v2 serves HTTP under the component's httpPrefix (/auth).
// Keep this router for any app-owned HTTP routes.
const http = httpRouter();

export default http;
