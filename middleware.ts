import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Redirige al login si no hay sesión
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"] 
};