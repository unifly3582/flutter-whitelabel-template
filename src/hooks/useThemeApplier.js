import { useEffect } from 'react';
import { themeConfig } from '../config/theme.js';

export const applyTheme = (config) => {
  const root = document.documentElement;

  if (config.colors) {
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-background', config.colors.background);
    root.style.setProperty('--color-text-primary', config.colors.textPrimary);
    root.style.setProperty('--color-text-secondary', config.colors.textSecondary);
  }

  if (config.fontFamily) {
    root.style.setProperty('--font-primary', config.fontFamily.primary);
    if (config.fontFamily.secondary) {
      root.style.setProperty('--font-secondary', config.fontFamily.secondary);
    }
  }

  if (config.borderRadius) {
    root.style.setProperty('--border-radius-sm', config.borderRadius.small);
    root.style.setProperty('--border-radius-md', config.borderRadius.medium);
    root.style.setProperty('--border-radius-lg', config.borderRadius.large);
    root.style.setProperty('--border-radius-full', config.borderRadius.full);
  }
};

const useThemeApplier = () => {
  useEffect(() => {
    applyTheme(themeConfig);
  }, []);
};

export default useThemeApplier; 