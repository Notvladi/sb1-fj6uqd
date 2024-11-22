import { useState, useEffect, useRef } from 'react';

export const useOrbitalAnimation = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);
  const [time, setTime] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 0.0003); // Slower animation speed (was 0.001)
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const calculateNodePosition = (node, allNodes, center) => {
    if (node.type === 'sun') {
      return center;
    }

    // Increased base distances and increments
    const orbitDistances = {
      planet: {
        base: 180, // Was 120
        increment: 100 // Was 60
      },
      moon: {
        base: 60, // Was 30
        increment: 30 // Was 20
      }
    };

    // For planets, orbit around the sun
    if (node.type === 'planet') {
      const planetIndex = allNodes
        .filter(n => n.type === 'planet')
        .findIndex(n => n.id === node.id);
      
      const orbitRadius = orbitDistances.planet.base + (planetIndex * orbitDistances.planet.increment);
      // Add offset to initial position based on index for better distribution
      const angleOffset = (planetIndex * (Math.PI * 2 / allNodes.filter(n => n.type === 'planet').length));
      const angle = time + angleOffset;

      return {
        x: center.x + (Math.cos(angle) * orbitRadius * scale),
        y: center.y + (Math.sin(angle) * orbitRadius * scale)
      };
    }

    // For moons, orbit around their parent planet in opposite direction
    if (node.type === 'moon' && node.parentId) {
      const parent = allNodes.find(n => n.id === node.parentId);
      if (!parent) return center;

      const parentPos = calculateNodePosition(parent, allNodes, center);
      const moonIndex = allNodes
        .filter(n => n.type === 'moon' && n.parentId === parent.id)
        .findIndex(n => n.id === node.id);

      const orbitRadius = orbitDistances.moon.base + (moonIndex * orbitDistances.moon.increment);
      // Add offset to initial position for moons
      const angleOffset = (moonIndex * (Math.PI * 2 / allNodes.filter(n => n.type === 'moon' && n.parentId === parent.id).length));
      const angle = -time * 1.5 + angleOffset; // Slightly slower moon rotation (was 2)

      return {
        x: parentPos.x + (Math.cos(angle) * orbitRadius * scale),
        y: parentPos.y + (Math.sin(angle) * orbitRadius * scale)
      };
    }

    return center;
  };

  return {
    scale,
    setScale,
    calculateNodePosition,
    time
  };
};