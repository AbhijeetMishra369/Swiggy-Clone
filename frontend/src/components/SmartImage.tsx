import { useState } from 'react';

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
};

export default function SmartImage({ src, alt, className = '', eager = false, sizes }: Props) {
  const [error, setError] = useState(false);
  const actualSrc = !error && src ? src : '/placeholder.svg';
  return (
    <img
      src={actualSrc}
      alt={alt}
      className={`${className} w-full h-full object-cover`}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}

