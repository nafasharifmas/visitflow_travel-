import { useState } from 'react';

/** Image with a drawn placeholder: a broken/missing image never blocks textual content. */
export default function PlaceImage({ src, alt, className = '' }: { src: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div role="img" aria-label={`${alt} — image unavailable`} className={`flex items-center justify-center border border-hair bg-ground2 ${className}`}>
        <span className="label">Image unavailable</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`border border-hair object-cover ${className}`} />;
}
