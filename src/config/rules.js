import { NODE_TYPES, ORBITS } from './constants';

// Node placement and relationship rules
export const nodeRules = {
  canAddChild: (parentNode, childType) => {
    const nodeConfig = NODE_TYPES[parentNode.type.toUpperCase()];
    if (!nodeConfig.canHaveChildren) return false;
    if (!nodeConfig.allowedChildren.includes(childType)) return false;
    
    const currentChildren = parentNode.children?.length || 0;
    return currentChildren < nodeConfig.maxChildren;
  },

  calculateOptimalPosition: (parentNode, siblings, type) => {
    const orbitConfig = type === 'planet' ? ORBITS.PLANET : ORBITS.MOON;
    const existingOrbits = siblings.map(n => n.orbit || 0);
    const maxOrbit = Math.max(0, ...existingOrbits);
    
    // Calculate base orbit radius
    const orbitRadius = existingOrbits.length === 0 ? 
      orbitConfig.BASE_RADIUS : 
      maxOrbit;

    // Find optimal angle in current orbit
    const nodesInOrbit = siblings.filter(n => n.orbit === orbitRadius);
    let bestAngle = 0;

    if (nodesInOrbit.length > 0) {
      const angles = nodesInOrbit
        .map(n => n.angle || 0)
        .sort((a, b) => a - b);
      
      // Find largest gap
      let maxGap = 2 * Math.PI - (angles[angles.length - 1] - angles[0]);
      let gapStart = angles[angles.length - 1];
      
      for (let i = 1; i < angles.length; i++) {
        const gap = angles[i] - angles[i - 1];
        if (gap > maxGap) {
          maxGap = gap;
          gapStart = angles[i - 1];
        }
      }

      // Check if gap is large enough
      if (maxGap < orbitConfig.MIN_SPACING) {
        // Create new orbit if current is too crowded
        orbitRadius += orbitConfig.INCREMENT;
      } else {
        bestAngle = gapStart + (maxGap / 2);
      }
    }

    return {
      orbit: orbitRadius,
      angle: bestAngle
    };
  },

  validateNodeMove: (node, newParent, siblings) => {
    // Check if move is allowed based on node types
    const parentConfig = NODE_TYPES[newParent.type.toUpperCase()];
    if (!parentConfig.allowedChildren.includes(node.type)) return false;

    // Check if new parent has space
    const currentChildren = siblings.length;
    if (currentChildren >= parentConfig.maxChildren) return false;

    return true;
  }
};

// Visual and interaction rules
export const visualRules = {
  getNodeSize: (type, scale = 1) => {
    const baseSizes = {
      sun: 30,
      planet: 20,
      moon: 12
    };
    return (baseSizes[type] || 15) * scale;
  },

  getNodeColor: (type, category) => {
    if (type === 'sun') return '#FFB900';
    
    const categories = {
      strategy: '#36B37E',
      operations: '#6554C0',
      technology: '#FF8B00',
      hr: '#FF5630'
    };
    
    return categories[category] || '#36B37E';
  },

  getStatusColor: (status) => {
    const colors = {
      'on-track': '#10B981',
      'at-risk': '#F59E0B',
      'delayed': '#EF4444',
      'active': '#10B981'
    };
    return colors[status] || '#9CA3AF';
  }
};

// Business logic rules
export const businessRules = {
  calculateProgress: (node) => {
    if (!node.tasks || node.tasks.length === 0) return node.progress || 0;
    
    const totalTasks = node.tasks.length;
    const completedTasks = node.tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / totalTasks) * 100);
  },

  calculateRisk: (node) => {
    if (!node.risks || node.risks.length === 0) return 'on-track';
    
    const hasHighRisk = node.risks.some(r => r.severity === 'high');
    const hasMediumRisk = node.risks.some(r => r.severity === 'medium');
    
    if (hasHighRisk) return 'delayed';
    if (hasMediumRisk) return 'at-risk';
    return 'on-track';
  },

  calculateBudgetStatus: (node) => {
    if (!node.budget || !node.spent) return 'on-track';
    
    const percentUsed = (node.spent / node.budget) * 100;
    if (percentUsed > 90) return 'delayed';
    if (percentUsed > 75) return 'at-risk';
    return 'on-track';
  }
};