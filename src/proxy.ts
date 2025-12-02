import { auth } from "@/lib/auth";

export default auth((req) => {
    const isAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const isAuthenticated = !!req.auth;

    if (isAdmin && !isLoginPage && !isAuthenticated) {
        return Response.redirect(new URL("/admin/login", req.url));
    }

    if (isLoginPage && isAuthenticated) {
        return Response.redirect(new URL("/admin", req.url));
    }
});

export const config = {
    matcher: ["/admin/:path*"],
};
