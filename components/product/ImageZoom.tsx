import Image from "next/image";
import { useRef, useState } from "react";

interface ImageZoomProps {
    src: string;
    alt: string;
  }
  
  const ImageZoom = ({ src, alt }: ImageZoomProps) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
    const imgRef = useRef<HTMLImageElement>(null);
  
    const handleMouseEnter = () => setIsZoomed(true);
    const handleMouseLeave = () => setIsZoomed(false);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (imgRef.current && isZoomed) {
        const { left, top, width, height } = imgRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setBackgroundPosition(`${x}% ${y}%`);
      }
    };
  
    // const formattedSrc = src.replace(/\\/g, '/');
  
    return (
      <>
        <div
          className={`relative ${isZoomed?"w-100 h-100":"w-96 h-96"} w-96 lg:w-[500px] h-96 max-md:hidden`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {isZoomed && (
            <div
              className={`rounded-lg top-0 left-0 w-full h-full bg-no-repeat transition-transform duration-300`}
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: backgroundPosition,
                backgroundSize: '200%', // Adjust this value to control the zoom level
              }}
            />
          )}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`absolute rounded-lg top-0 left-0 w-full h-full transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>
        
        <img src={src} alt={alt} className="w-full rounded-lg md:hidden md:h-[500px] h-[300px] object-cover" />
      </>
    );
  };

  export default ImageZoom;