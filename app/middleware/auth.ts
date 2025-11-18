export default defineNuxtRouteMiddleware((to, _from) => {
  // Check if running on client side
  if (import.meta.client) {
    const token = localStorage.getItem("auth_token");

    // If no token found, redirect to login
    if (!token) {
      // Prevent redirect loop
      if (to.path !== "/auth/login") {
        return navigateTo("/auth/login");
      }
    }
  }
});
