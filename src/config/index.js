export const CONFIG = {
  // Core settings
  MAX_ZOOM: 2,
  MIN_ZOOM: 0.5,
  DEFAULT_SCALE: 0.8,
  ZOOM_STEP: 1.2,

  // Node settings
  NODES: {
    CATEGORIES: {
      STRATEGY: { name: 'Strategy', color: '#36B37E' },
      OPERATIONS: { name: 'Operations', color: '#6554C0' },
      TECHNOLOGY: { name: 'Technology', color: '#FF8B00' },
      HR: { name: 'HR', color: '#FF5630' }
    },
    STATUS: {
      'ON-TRACK': { color: '#10B981' },
      'AT-RISK': { color: '#F59E0B' },
      'DELAYED': { color: '#EF4444' }
    },
    SIZES: {
      SUN: 30,
      PLANET: 20,
      MOON: 12
    }
  },

  // Layout settings
  LAYOUT: {
    ORBITS: {
      PLANET: { BASE_RADIUS: 180, INCREMENT: 100 },
      MOON: { BASE_RADIUS: 60, INCREMENT: 30 }
    }
  }
};