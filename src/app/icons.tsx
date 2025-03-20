import dynamic from 'next/dynamic';

export const ArrowRight = dynamic(() => import('react-feather').then((mod) => mod.ArrowRight), {
  ssr: true,
});