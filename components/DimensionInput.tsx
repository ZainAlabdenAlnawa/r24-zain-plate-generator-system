
import React, { useState, useEffect, useMemo } from 'react';
import { Unit } from '../types';
import { INCH_TO_CM } from '../constants';

interface DimensionInputProps {
  label: string;
  unit: Unit;
  value: number; // always in cm
  minCm: number;
  maxCm: number;
  onChange: (value: number) => void;
}

const cmToIn = (cm: number) => cm / INCH_TO_CM;
const inToCm = (inch: number) => inch * INCH_TO_CM;

const DimensionInput: React.FC<DimensionInputProps> = ({ label, unit, value, minCm, maxCm, onChange }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const { min, max, step } = useMemo(() => {
    if (unit === 'in') {
      return { min: cmToIn(minCm), max: cmToIn(maxCm), step: 0.1 };
    }
    return { min: minCm, max: maxCm, step: 1 };
  }, [unit, minCm, maxCm]);

  useEffect(() => {
    const displayValue = unit === 'in' ? cmToIn(value).toFixed(2) : value.toString();
    setInputValue(displayValue);
    setError(null);
  }, [value, unit]);

  const validateAndConvert = (val: string): number | null => {
    const normalizedValue = val.trim().replace(',', '.');
    if (normalizedValue === '' || /[^0-9.]/.test(normalizedValue) || (normalizedValue.match(/\./g) || []).length > 1) {
      return null;
    }

    const num = parseFloat(normalizedValue);
    if (isNaN(num)) return null;

    if (num < min || num > max) {
      setError(`Must be between ${min.toFixed(1)} and ${max.toFixed(1)} ${unit}.`);
      return null;
    }
    
    return unit === 'in' ? inToCm(num) : num;
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    const cmValue = validateAndConvert(newInputValue);
    if (cmValue !== null) {
      onChange(cmValue);
      setError(null);
    }
  };

  const handleBlur = () => {
    const cmValue = validateAndConvert(inputValue);
    if (cmValue === null) {
      // Revert to the last valid value from parent state
      const displayValue = unit === 'in' ? cmToIn(value).toFixed(2) : value.toString();
      setInputValue(displayValue);
      setError(null);
    } else {
      // Format the valid value correctly
      const displayValue = unit === 'in' ? cmToIn(cmValue).toFixed(2) : Math.round(cmValue).toString();
      setInputValue(displayValue);
    }
  };

  const ringColor = error ? 'ring-red-500' : 'focus:ring-blue-500';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} ({unit})</label>
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColor} transition-shadow`}
      />
      {error && <p className="mt-1 text-xs text-red-500 h-4">{error}</p>}
    </div>
  );
};

export default DimensionInput;
