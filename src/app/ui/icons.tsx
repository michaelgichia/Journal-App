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

export const Plus = dynamic(() => import('react-feather').then((mod) => mod.Plus), {
  ssr: true,
});

export const Calendar = dynamic(() => import('react-feather').then((mod) => mod.Calendar), {
  ssr: true,
});

export const MoreVertical = dynamic(() => import('react-feather').then((mod) => mod.MoreVertical), {
  ssr: true,
});