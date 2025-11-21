import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Password",
            credentials: {
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (!adminPassword) {
                    console.error("ADMIN_PASSWORD not set");
                    return null;
                }

                if (credentials?.password === adminPassword) {
                    return { id: "1", name: "Admin" };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized: async ({ auth, request }) => {
            const isAdmin = request.nextUrl.pathname.startsWith("/admin");
            const isLoginPage = request.nextUrl.pathname === "/admin/login";

            if (isLoginPage) {
                return true;
            }

            if (isAdmin) {
                return !!auth;
            }

            return true;
        },
    },
});
