
import React from 'react';
import { Plate, PlateDimension, Unit } from '../types';
import DimensionInput from './DimensionInput';
import { WIDTH_MIN, WIDTH_MAX, HEIGHT_MIN, HEIGHT_MAX } from '../constants';

interface PlateConfiguratorProps {
  plate: Plate;
  index: number;
  unit: Unit;
  onRemove: () => void;
  onUpdate: (dimension: PlateDimension, value: number) => void;
  isOnlyPlate: boolean;
}

const DragHandleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 cursor-grab active:cursor-grabbing">
        <circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
    </svg>
);


const PlateConfigurator: React.FC<PlateConfiguratorProps> = ({ plate, index, unit, onRemove, onUpdate, isOnlyPlate }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <DragHandleIcon />
            <h3 className="font-semibold text-lg text-gray-800">Plate {index + 1}</h3>
        </div>
        <button
          onClick={onRemove}
          disabled={isOnlyPlate}
          className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Remove
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DimensionInput
          label="Width"
          unit={unit}
          value={plate.width}
          minCm={WIDTH_MIN}
          maxCm={WIDTH_MAX}
          onChange={(value) => onUpdate('width', value)}
        />
        <DimensionInput
          label="Height"
          unit={unit}
          value={plate.height}
          minCm={HEIGHT_MIN}
          maxCm={HEIGHT_MAX}
          onChange={(value) => onUpdate('height', value)}
        />
      </div>
    </div>
  );
};

export default PlateConfigurator;
