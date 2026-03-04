import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeLanguageToggle } from '@/components/ThemeLanguageToggle';
import { auth } from "@/auth";
import HomeClient from './HomeClient';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const tIndex = await getTranslations('Index');
  const tCommon = await getTranslations('Common');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-300">
      <ThemeLanguageToggle />
      <HomeClient
        session={session}
        translations={{
          index: {
            title: tIndex('title'),
            description: tIndex('description'),
            greeting: tIndex('greeting', { name: session?.user?.name ?? 'User' }),
            loggedInMessage: tIndex('loggedInMessage'),
            emailLabel: tIndex('emailLabel'),
            emailPlaceholder: tIndex('emailPlaceholder'),
            passwordLabel: tIndex('passwordLabel'),
            passwordPlaceholder: tIndex('passwordPlaceholder'),
            sendMagicLink: tIndex('sendMagicLink'),
            loginWithPassword: tIndex('loginWithPassword'),
            useMagicLink: tIndex('useMagicLink'),
            dontHaveAccount: tIndex('dontHaveAccount'),
            signUpLink: tIndex('signUpLink'),
            alreadyHaveAccount: tIndex('alreadyHaveAccount'),
            signInLink: tIndex('signInLink'),
            orContinueWith: tIndex('orContinueWith'),
            loginWith: tIndex('loginWith', { provider: 'Google' }),
            createAccount: tIndex('createAccount'),
            nameLabel: tIndex('nameLabel'),
            namePlaceholder: tIndex('namePlaceholder'),
            signup: tIndex('signup')
          },
          common: {
            title: tCommon('title'),
            dashboard: tCommon('dashboard'),
            logout: tCommon('logout')
          }
        }}
      />
    </div>
  );
}
