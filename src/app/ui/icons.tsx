import dynamic from 'next/dynamic';

export const ArrowRight = dynamic(() => import('react-feather').then((mod) => mod.ArrowRight), {
  ssr: true,
});

export const Eye = dynamic(() => import('react-feather').then((mod) => mod.Eye), {
  ssr: true,
});

export const EyeOff = dynamic(() => import('react-feather').then((mod) => mod.EyeOff), {
  ssr: true,
});

export const Power = dynamic(() => import('react-feather').then((mod) => mod.Power), {
  ssr: true,
});