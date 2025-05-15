import type { FaviconConfig } from './types';

export const setFavicon = ({ href, type = 'image/svg+xml' }: FaviconConfig): void => {
  const existingLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  const link = existingLink || document.createElement('link');

  link.type = type;
  link.rel = 'icon';
  link.href = href;

  if (!existingLink) {
    document.head.appendChild(link);
  }
};
