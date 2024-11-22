import { useState, useCallback } from 'react';
import { useOrbitalGrid } from './useOrbitalGrid';

export const useOrbitalAnimation = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);
  const { calculateGridPosition } = useOrbitalGrid(scale);

  const calculateNodePosition = useCallback((node, allNodes, center, dragPosition = null) => {
    // Use grid system to determine optimal position
    return calculateGridPosition(node, allNodes, center, dragPosition) || center;
  }, [scale, calculateGridPosition]);

  return {
    scale,
    setScale,
    calculateNodePosition
  };
};