import { OGImageRoute } from 'astro-og-canvas';
import { siteConfig } from '@/site.config';

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages: {
    'index': {
      title: siteConfig.name,
      description: siteConfig.description,
    },
    'projects': {
      title: 'Projects',
      description: 'Showcase of my latest works and open source contributions.',
    },
    'works': {
      title: 'Experience',
      description: 'My professional journey and work history.',
    },
  },
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/favicon.svg',
    },
    bgGradient: [[10, 10, 10]],
    border: { color: [60, 60, 60], width: 20 },
    padding: 60,
    font: {
      title: { size: 80, color: [255, 255, 255], weight: 'Bold' },
      description: { size: 40, color: [200, 200, 200] },
    },
  }),
});
