import NextAuth, { type DefaultSession, type Profile } from "next-auth";
import User from "../../../models/user";
import connectToDatabase from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

interface Credentials {
  email?: string;
  password?: string;
}

interface UserProfile extends Profile {
  email_verified?: boolean;
  picture?: string;
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials?: Credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error("Preencha todos os campos");
          }
      
          await connectToDatabase();
          
          const user = await User.findOne({ email: credentials.email }) as { 
            _id: string, 
            userId: number, // Agora estamos pegando o userId sequencial
            name: string, 
            email: string, 
            password: string, 
            image: string 
          };
          
          if (!user) {
            throw new Error("Usuário não encontrado");
          }
      
          if (!user.password) {
            throw new Error("Conta registrada com outro método");
          }
      
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error("Senha incorreta");
          }
      
          return {
            id: user._id.toString(),
            userId: user.userId, // Incluindo o userId na resposta de login
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Authorization Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (account?.provider === "credentials") return true;

        if (account && profile) {
          const { provider } = account;
          const userProfile = profile as UserProfile;

          if (!userProfile.email) {
            throw new Error("Email não encontrado no perfil");
          }

          // Verificação de e-mail para provedores OAuth
          if (provider === "google" && !userProfile.email_verified) {
            throw new Error("E-mail do Google não verificado");
          }

          await connectToDatabase();

          const existingUser = await User.findOne({ email: userProfile.email });

          if (!existingUser) {
            await User.create({
              name: userProfile.name,
              email: userProfile.email,
              image: userProfile.picture,
              provider,
            });
          } else {
            // Atualiza dados se necessário
            await User.updateOne(
              { email: userProfile.email },
              { 
                $set: { 
                  name: userProfile.name,
                  image: userProfile.picture 
                } 
              }
            );
          }

          return true;
        }
        return false;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id as string,
          name: token.name ?? undefined,
          email: token.email ?? undefined,
          image: token.image as string | undefined,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in?error=",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };