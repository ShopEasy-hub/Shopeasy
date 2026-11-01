import type { ImgHTMLAttributes } from 'react';

type BrandLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>;

export function BrandLogo({
  alt = 'ShopSpot',
  className = '',
  ...props
}: BrandLogoProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/shopspot-logo.png`}
      alt={alt}
      className={`block object-contain ${className}`}
      {...props}
    />
  );
}
