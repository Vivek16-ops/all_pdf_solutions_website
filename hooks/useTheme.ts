import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export function useTheme() {
  const theme = useAppSelector((state: any) => state.theme.theme);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      setIsDark(
        theme === 'dark' || 
        (theme === 'system' && darkModeMediaQuery.matches)
      );
    };

    updateTheme();
    darkModeMediaQuery.addEventListener('change', updateTheme);
    return () => darkModeMediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  return {
    isDark,
    mounted
  };
}
