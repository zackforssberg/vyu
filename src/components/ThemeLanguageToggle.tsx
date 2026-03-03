'use client';

import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Moon, Sun, Languages } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeLanguageToggle() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'sv' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} className="text-secondary" /> : <Moon size={20} className="text-charcoal" />}
      </button>

      <button
        onClick={toggleLocale}
        className="flex items-center gap-1 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        aria-label="Toggle language"
      >
        <Languages size={20} className="text-primary" />
        <span className="text-sm font-bold text-primary uppercase">{locale}</span>
      </button>
    </div>
  );
}
