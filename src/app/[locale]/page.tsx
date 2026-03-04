import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { ThemeLanguageToggle } from '@/components/ThemeLanguageToggle';
import { auth } from "@/auth";
import { SignIn, SignOut } from "@/components/AuthButtons";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const tCommon = await getTranslations('Common');
  const tIndex = await getTranslations('Index');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-300">
      <ThemeLanguageToggle />

      <main className="flex flex-col items-center gap-8 px-8 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 px-4 py-1 rounded-full text-primary text-sm font-bold uppercase tracking-wider">
            {tCommon('title')}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            {session?.user ? `Hi, ${session.user.name}` : tIndex('title')}
          </h1>
          <p className="max-w-xl text-lg text-foreground/70 sm:text-xl">
            {session?.user
              ? "You are successfully logged in to your companion."
              : tIndex('description')}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {session?.user ? (
            <>
              <button className="h-14 px-8 rounded-2xl bg-primary text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                {tCommon('dashboard')}
              </button>
              <SignOut className="h-14 px-8 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary font-bold text-lg hover:bg-primary/10 transition-all flex items-center justify-center p-4" />
            </>
          ) : (
            <>
              <SignIn provider="google" className="h-14 px-8 rounded-2xl bg-primary text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20" />
              <button className="h-14 px-8 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary font-bold text-lg hover:bg-primary/10 transition-all">
                {tCommon('login')}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
