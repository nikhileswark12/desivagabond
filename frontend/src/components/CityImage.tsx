import { useState } from 'react';
import fallbackSvg from '../assets/city-fallback.svg';

interface CityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function CityImage({ src, alt, className, ...props }: CityImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSvg);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc || fallbackSvg}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  );
}
