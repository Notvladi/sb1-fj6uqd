import { useCallback } from 'react';

export const useDrag = ({ onDragStart, onDrag, onDragEnd }) => {
  const getEventCoordinates = (e) => {
    if (e?.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const dragStart = useCallback((e) => {
    e.stopPropagation();
    const startCoords = getEventCoordinates(e);
    onDragStart?.(startCoords);

    const handleMove = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const coords = getEventCoordinates(e);
      onDrag?.(coords);
    };

    const handleEnd = (e) => {
      e.stopPropagation();
      const coords = getEventCoordinates(e);
      onDragEnd?.(coords);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return cleanup;
  }, [onDragStart, onDrag, onDragEnd]);

  return { dragStart };
};