import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { dbClient } from "@/shared/lib/db";
import { compact } from "lodash-es";
import { privateConfig } from "@/shared/config/private";
import EmailProvider from "next-auth/providers/email";

export const nextAuthConfig: AuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(dbClient) as AuthOptions["adapter"],
  providers: compact([
    EmailProvider({
      server: {
        host: privateConfig.EMAIL_SERVER_HOST,
        port: 587,
        auth: {
          user: privateConfig.EMAIL_SERVER_USER,
          pass: privateConfig.EMAIL_SERVER_PASSWORD,
        },
      },
      from: privateConfig.EMAIL_FROM,
    }),

    privateConfig.GITHUB_ID &&
      privateConfig.GITHUB_SECRET &&
      GithubProvider({
        clientId: privateConfig.GITHUB_ID,
        clientSecret: privateConfig.GITHUB_SECRET,
      }),
    // ...add more providers here
  ]),
};
