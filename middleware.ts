import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (!token?.id) {
        return false;
      }

      if (pathname.startsWith("/admin")) {
        return token.role === "SUPER_ADMIN";
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
