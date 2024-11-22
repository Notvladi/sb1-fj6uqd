// Animation speeds and limits
export const ANIMATION = {
  BASE_SPEED: 0.1,
  PLANET_SPEED: 0.2,
  MOON_SPEED: 0.3,
  MIN_SPEED: 0.01,
  MAX_SPEED: 0.5,
  HOVER_SCALE: 1.15,
  TRANSITION_DURATION: 300,
  GLOW_OPACITY: 0.15
};

// Node types and their rules
export const NODE_TYPES = {
  SUN: {
    canHaveChildren: true,
    allowedChildren: ['planet'],
    maxChildren: 8
  },
  PLANET: {
    canHaveChildren: true,
    allowedChildren: ['moon'],
    maxChildren: 5
  },
  MOON: {
    canHaveChildren: false,
    allowedChildren: [],
    maxChildren: 0
  }
};

// Orbit configuration
export const ORBITS = {
  PLANET: {
    BASE_RADIUS: 180,
    INCREMENT: 100,
    MIN_SPACING: Math.PI / 4
  },
  MOON: {
    BASE_RADIUS: 60,
    INCREMENT: 30,
    MIN_SPACING: Math.PI / 6
  }
};

// Node status types
export const STATUS = {
  ON_TRACK: 'on-track',
  AT_RISK: 'at-risk',
  DELAYED: 'delayed',
  ACTIVE: 'active'
};

// Node categories
export const CATEGORIES = {
  STRATEGY: {
    id: 'strategy',
    name: 'Strategy',
    color: '#36B37E'
  },
  OPERATIONS: {
    id: 'operations',
    name: 'Operations',
    color: '#6554C0'
  },
  TECHNOLOGY: {
    id: 'technology',
    name: 'Technology',
    color: '#FF8B00'
  },
  HR: {
    id: 'hr',
    name: 'HR',
    color: '#FF5630'
  }
};

// Risk levels
export const RISK_LEVELS = {
  LOW: {
    id: 'low',
    name: 'Low',
    color: '#36B37E'
  },
  MEDIUM: {
    id: 'medium',
    name: 'Medium',
    color: '#F59E0B'
  },
  HIGH: {
    id: 'high',
    name: 'High',
    color: '#EF4444'
  }
};

// Layout constants
export const LAYOUT = {
  PANEL_WIDTH: 384,
  CONTROLS_SPACING: 16,
  ORBIT_LINE_WIDTH: 1,
  ORBIT_LINE_OPACITY: 0.3
};