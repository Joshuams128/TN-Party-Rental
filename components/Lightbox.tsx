import React, { useEffect } from 'react';

interface LightboxProps {
  image: string;
  alt: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <div className="relative max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-white text-3xl font-bold bg-black bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 transition"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ×
        </button>
        <img
          src={image}
          alt={alt}
          className="w-full h-auto rounded-lg shadow-2xl object-contain max-h-[80vh] bg-black"
        />
      </div>
    </div>
  );
};

export default Lightbox;
