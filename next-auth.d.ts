import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      sub: string;
    } & DefaultSession["user"];
    idToken: string;
  }

  interface User extends DefaultUser {
    sub: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    sub: string;
    idToken: string;
  }
}
