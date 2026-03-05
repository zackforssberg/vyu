"use client"

import { useState } from 'react';
import { SignIn, SignOut } from "@/components/AuthButtons";
import { SignInForm } from "@/components/SignInForm";
import { SignUpForm } from "@/components/SignUpForm";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { Session } from "next-auth";

interface HomeClientProps {
  session: Session | null;
  translations: any;
}

export default function HomeClient({ session, translations }: HomeClientProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot-password">("signin");
  const tIndex = translations.index;
  const tCommon = translations.common;


  return (
    <main className="flex flex-col items-center gap-8 px-8 py-16 text-center w-full max-w-4xl">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/10 px-4 py-1 rounded-full text-primary text-sm font-bold uppercase tracking-wider">
          {tCommon.title}
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          {session?.user ? tIndex.greeting : tIndex.title}
        </h1>
        <p className="max-w-xl text-lg text-foreground/70 sm:text-xl">
          {session?.user
            ? tIndex.loggedInMessage
            : tIndex.description}
        </p>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-sm">
        {session?.user ? (
          <div className="flex flex-col gap-4 sm:flex-row w-full justify-center">
            <button className="h-14 px-8 rounded-2xl bg-primary text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
              {tCommon.dashboard}
            </button>
            <SignOut className="h-14 px-8 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary font-bold text-lg hover:bg-primary/10 transition-all flex items-center justify-center p-4">
              {tCommon.logout}
            </SignOut>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {authMode === "signin" ? (
              <>
                <SignInForm labels={{
                  emailLabel: tIndex.emailLabel,
                  emailPlaceholder: tIndex.emailPlaceholder,
                  passwordLabel: tIndex.passwordLabel,
                  passwordPlaceholder: tIndex.passwordPlaceholder,
                  sendMagicLink: tIndex.sendMagicLink,
                  loginWithPassword: tIndex.loginWithPassword,
                  useMagicLink: tIndex.useMagicLink
                }} />

                <div className="flex flex-col gap-3 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-sm text-foreground/60">{tIndex.dontHaveAccount}</p>
                    <button
                      onClick={() => setAuthMode("signup")}
                      className="text-sm font-bold text-primary hover:underline transition-colors"
                    >
                      {tIndex.signUpLink}
                    </button>
                  </div>
                  <button
                    onClick={() => setAuthMode("forgot-password")}
                    className="text-xs font-semibold text-foreground/40 hover:text-primary transition-colors"
                  >
                    {tIndex.forgotPassword}
                  </button>
                </div>
              </>
            ) : authMode === "signup" ? (
              <>
                <SignUpForm
                  labels={{
                    createAccount: tIndex.createAccount,
                    nameLabel: tIndex.nameLabel,
                    namePlaceholder: tIndex.namePlaceholder,
                    emailLabel: tIndex.emailLabel,
                    emailPlaceholder: tIndex.emailPlaceholder,
                    passwordLabel: tIndex.passwordLabel,
                    passwordPlaceholder: tIndex.passwordPlaceholder,
                    signup: tIndex.signup
                  }}
                  onSuccess={() => setAuthMode("signin")}
                />
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-foreground/60">{tIndex.alreadyHaveAccount}</p>
                  <button
                    onClick={() => setAuthMode("signin")}
                    className="text-sm font-bold text-primary hover:underline transition-colors"
                  >
                    {tIndex.signInLink}
                  </button>
                </div>
              </>
            ) : (
              <>
                <ForgotPasswordForm
                  labels={{
                    resetPassword: tIndex.resetPassword,
                    emailLabel: tIndex.emailLabel,
                    emailPlaceholder: tIndex.emailPlaceholder,
                    sendResetLink: tIndex.sendResetLink,
                    checkResetEmail: tIndex.checkResetEmail
                  }}
                />
                <button
                  onClick={() => setAuthMode("signin")}
                  className="text-sm font-bold text-primary hover:underline transition-colors"
                >
                  {tIndex.backToLogin}
                </button>
              </>
            )}

            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-primary/10 flex-1" />
              <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                {tIndex.orContinueWith}
              </span>
              <div className="h-px bg-primary/10 flex-1" />
            </div>

            <SignIn provider="google" className="h-14 w-full px-8 rounded-2xl bg-secondary text-secondary-foreground font-bold text-lg hover:bg-secondary/80 transition-all shadow-md flex items-center justify-center gap-3">
              {tIndex.loginWith}
            </SignIn>
          </div>
        )}
      </div>
    </main>
  );
}
