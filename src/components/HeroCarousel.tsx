import React, { useState, useEffect } from 'react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    alt: 'Office workspace'
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80',
    alt: 'Plumber working'
  },
  {
    url: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80',
    alt: 'Yoga instructor'
  },
  {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
    alt: 'Home renovation'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image.url}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? 0.6 : 0,
            backgroundImage: `url('${image.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: index === currentIndex ? 1 : 0
          }}
        />
      ))}
    </div>
  );
}