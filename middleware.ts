import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without auth
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // Require authentication for other admin pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
