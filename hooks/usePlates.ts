
import { useState, useEffect, useCallback } from 'react';
import { Plate, PlateDimension, Unit } from '../types';
import { DEFAULT_PLATE, MAX_PLATES, MIN_PLATES, MOTIF_IMAGE_URL } from '../constants';

const LOCAL_STORAGE_KEY = 'plateGeneratorConfig_v2';

interface StoredConfig {
  plates: Plate[];
  unit: Unit;
  motifUrl: string;
}

export const usePlates = () => {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [unit, setUnit] = useState<Unit>('cm');
  const [motifUrl, setMotifUrl] = useState<string>(MOTIF_IMAGE_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedConfig = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedConfig) {
        const config: StoredConfig = JSON.parse(storedConfig);
        if (config.plates && config.plates.length > 0) {
          setPlates(config.plates);
          setUnit(config.unit || 'cm');
          setMotifUrl(config.motifUrl || MOTIF_IMAGE_URL);
        } else {
           setPlates([{ ...DEFAULT_PLATE, id: Date.now().toString() }]);
        }
      } else {
        setPlates([{ ...DEFAULT_PLATE, id: Date.now().toString() }]);
      }
    } catch (error) {
      console.error("Failed to load config from localStorage", error);
      setPlates([{ ...DEFAULT_PLATE, id: Date.now().toString() }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        const config: StoredConfig = { plates, unit, motifUrl };
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
      } catch (error) {
        console.error("Failed to save config to localStorage", error);
      }
    }
  }, [plates, unit, motifUrl, isLoading]);

  const addPlate = useCallback(() => {
    setPlates(prevPlates => {
      if (prevPlates.length >= MAX_PLATES) return prevPlates;
      const newPlate: Plate = {
        ...DEFAULT_PLATE,
        id: Date.now().toString(),
      };
      return [...prevPlates, newPlate];
    });
  }, []);

  const removePlate = useCallback((id: string) => {
    setPlates(prevPlates => {
      if (prevPlates.length <= MIN_PLATES) return prevPlates;
      return prevPlates.filter(plate => plate.id !== id);
    });
  }, []);

  const updatePlateDimension = useCallback((id: string, dimension: PlateDimension, value: number) => {
    setPlates(prevPlates =>
      prevPlates.map(plate =>
        plate.id === id ? { ...plate, [dimension]: value } : plate
      )
    );
  }, []);

  const reorderPlates = useCallback((startIndex: number, endIndex: number) => {
    setPlates(prevPlates => {
      const result = Array.from(prevPlates);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  return { plates, addPlate, removePlate, updatePlateDimension, reorderPlates, isLoading, unit, setUnit, motifUrl, setMotifUrl };
};
