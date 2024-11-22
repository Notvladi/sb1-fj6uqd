// Feature flags and configurations
export const FEATURES = {
  // Core features
  ORBITAL_MAP: {
    enabled: true,
    maxNodes: 100,
    autoLayout: true,
    snapToGrid: false,
    showOrbitPaths: true,
    showNodeLabels: true,
    allowMultiSelect: false,
    animations: {
      enabled: false, // Animations disabled by default
      planetRotation: false,
      moonRotation: false,
      nodeHover: true, // Keep hover effects for better UX
      transitions: true // Keep smooth transitions
    }
  },
  // ... rest of features config
};