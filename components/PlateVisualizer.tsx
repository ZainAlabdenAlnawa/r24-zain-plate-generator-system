
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Plate } from '../types';
import { MOTIF_BASE_WIDTH } from '../constants';

interface PlateVisualizerProps {
  plates: Plate[];
  motifUrl: string;
}

const ImageMotif: React.FC<{ totalWidth: number, maxHeight: number, motifUrl: string, leftOffset: number }> = React.memo(({ totalWidth, maxHeight, motifUrl, leftOffset }) => {
  const numTiles = Math.ceil(totalWidth / MOTIF_BASE_WIDTH);

  const tiles = useMemo(() => {
    return Array.from({ length: numTiles }).map((_, i) => (
      <div
        key={i}
        className="flex-shrink-0 bg-cover bg-center"
        style={{
          width: `${MOTIF_BASE_WIDTH}px`,
          height: '100%',
          backgroundImage: `url(${motifUrl})`,
          transform: i % 2 !== 0 ? 'scaleX(-1)' : 'none',
        }}
      />
    ));
  }, [numTiles, motifUrl]);

  return (
    <div
      className="absolute top-0 left-0 h-full transition-transform duration-500 ease-in-out"
      style={{
        width: `${MOTIF_BASE_WIDTH * numTiles}px`,
        height: `${maxHeight}px`,
        transform: `translateX(-${leftOffset}px)`,
        
      }}
    >
      <div className="flex h-full w-full">{tiles}</div>
    </div>
  );
});

const PlateVisualizer: React.FC<PlateVisualizerProps> = ({ plates, motifUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  const totalWidth = useMemo(() => plates.reduce((sum, p) => sum + p.width, 0), [plates]);
  const maxHeight = useMemo(() => Math.max(...plates.map(p => p.height), 0), [plates]);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || totalWidth === 0) {
        return;
      }
      const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
      const availableWidth = containerWidth - 32; // padding
      const availableHeight = containerHeight - 32; // padding
      
      const scaleX = totalWidth > availableWidth ? availableWidth / totalWidth : 1;
      const scaleY = maxHeight > availableHeight ? availableHeight / maxHeight : 1;
      setScale(Math.min(scaleX, scaleY));
    };

    calculateScale();
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [totalWidth, maxHeight]);

  let accumulatedWidth = 0;

  return (
    <div ref={containerRef} className="flex-grow bg-gray-200 rounded-lg flex items-center justify-center p-4 overflow-hidden w-full h-full relative">
      <div 
        className="flex transition-all duration-500 ease-in-out" 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'center',
          height: `${maxHeight}px`,
          width: `${totalWidth}px`
        }}
      >
        {plates.map(plate => {
          const leftOffset = accumulatedWidth;
          accumulatedWidth += plate.width;
          return (
            <div
              key={plate.id}
              className="relative overflow-hidden flex-shrink-0 bg-white/30 backdrop-blur-sm shadow-md transition-all duration-500 ease-in-out border-2 border-gray-500"
              style={{
                width: `${plate.width}px`,
                height: `${plate.height}px`,
                margin: 'auto 0'
              }}
            >
              <ImageMotif totalWidth={totalWidth} maxHeight={maxHeight} motifUrl={motifUrl} leftOffset={leftOffset} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlateVisualizer;
