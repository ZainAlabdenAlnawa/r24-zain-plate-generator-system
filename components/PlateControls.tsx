import React, { useState } from 'react';
import { Plate, PlateDimension, Unit } from '../types';
import PlateConfigurator from './PlateConfigurator';
import { MAX_PLATES, MIN_PLATES } from '../constants';

interface PlateControlsProps {
  plates: Plate[];
  unit: Unit;
  onAddPlate: () => void;
  onRemovePlate: (id: string) => void;
  onUpdatePlateDimension: (id: string, dimension: PlateDimension, value: number) => void;
  onReorderPlates: (startIndex: number, endIndex: number) => void;
  onUnitChange: (unit: Unit) => void;
  onTriggerUpload: () => void;
  onResetMotif: () => void;
  onExport: () => void;
}

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
        {children}
    </div>
);


const PlateControls: React.FC<PlateControlsProps> = (props) => {
  const { plates, unit, onAddPlate, onRemovePlate, onUpdatePlateDimension, onReorderPlates, onUnitChange, onTriggerUpload, onResetMotif, onExport } = props;
  const [isDragging, setIsDragging] = useState(false);
  const dragItem = React.useRef<number | null>(null);
  const dragOverItem = React.useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    setIsDragging(true);
    // Necessary for Firefox to enable dragging
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        onReorderPlates(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Configuration</h2>
      
      <Section title="Global Settings">
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <label className="font-medium">Units</label>
                <div className="relative flex items-center bg-gray-200 rounded-full p-1">
                    <button onClick={() => onUnitChange('cm')} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${unit === 'cm' ? 'bg-white shadow' : 'text-gray-600'}`}>cm</button>
                    <button onClick={() => onUnitChange('in')} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${unit === 'in' ? 'bg-white shadow' : 'text-gray-600'}`}>in</button>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-2">
                <button onClick={onTriggerUpload} className="w-full text-sm bg-white border border-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">Upload Motif</button>
                <button onClick={onResetMotif} className="w-full text-sm bg-white border border-gray-300 font-semibold py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">Reset Motif</button>
            </div>
            <button onClick={onExport} className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors">Export as PNG</button>
          </div>
      </Section>
      
      <div className="flex justify-between items-baseline mb-3">
         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Plates ({plates.length}/{MAX_PLATES})</h3>
      </div>

      <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-4 py-1">
        {plates.map((plate, index) => (
          <div
            key={plate.id}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            draggable
            className={isDragging && dragItem.current === index ? 'drag-ghost' : 'transition-shadow'}
          >
            <PlateConfigurator
              plate={plate}
              index={index}
              unit={unit}
              onRemove={() => onRemovePlate(plate.id)}
              onUpdate={(dimension, value) => onUpdatePlateDimension(plate.id, dimension, value)}
              isOnlyPlate={plates.length <= MIN_PLATES}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex-shrink-0">
        <button
          onClick={onAddPlate}
          disabled={plates.length >= MAX_PLATES}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Add Plate
        </button>
      </div>
    </div>
  );
};

export default PlateControls;