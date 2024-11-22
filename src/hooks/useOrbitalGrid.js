import { useMemo } from 'react';

export const useOrbitalGrid = (scale = 1) => {
  const config = useMemo(() => ({
    orbits: {
      planet: {
        baseRadius: 250,
        increment: 150,
        maxPlanets: 8
      },
      moon: {
        baseRadius: 100,
        increment: 80,
        maxMoonsPerPlanet: 4
      }
    }
  }), []);

  const calculateGridPosition = (node, allNodes, center) => {
    // If node already has a position, maintain it
    if (node.position) {
      return {
        x: node.position.x,
        y: node.position.y
      };
    }

    if (node.type === 'sun') return center;

    if (node.type === 'planet') {
      const planets = allNodes.filter(n => n.type === 'planet');
      const planetIndex = planets.findIndex(p => p.id === node.id);
      const totalPlanets = planets.length;
      const angle = (2 * Math.PI * planetIndex) / Math.max(totalPlanets, config.orbits.planet.maxPlanets);
      const radius = config.orbits.planet.baseRadius * scale;

      return {
        x: center.x + (Math.cos(angle) * radius),
        y: center.y + (Math.sin(angle) * radius)
      };
    }

    if (node.type === 'moon' && node.parentId) {
      const parent = allNodes.find(n => n.id === node.parentId);
      if (!parent?.position) return center;

      const moons = allNodes.filter(n => n.type === 'moon' && n.parentId === parent.id);
      const moonIndex = moons.findIndex(m => m.id === node.id);
      const totalMoons = moons.length;
      const angle = (2 * Math.PI * moonIndex) / Math.max(totalMoons, config.orbits.moon.maxMoonsPerPlanet);
      const radius = config.orbits.moon.baseRadius * scale;

      return {
        x: parent.position.x + (Math.cos(angle) * radius),
        y: parent.position.y + (Math.sin(angle) * radius)
      };
    }

    return center;
  };

  return {
    calculateGridPosition,
    config
  };
};

export default useOrbitalGrid;