// Default values and templates
export const DEFAULTS = {
  // Default node templates
  NODES: {
    PLANET: {
      type: 'planet',
      category: 'strategy',
      status: 'on-track',
      progress: 0,
      budget: 100000,
      spent: 0,
      team: [],
      kpis: [],
      risks: [],
      tasks: [],
      timeline: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 31536000000).toISOString(), // +1 year
        milestones: []
      }
    },
    MOON: {
      type: 'moon',
      category: 'operations',
      status: 'on-track',
      progress: 0,
      budget: 50000,
      spent: 0,
      team: [],
      kpis: [],
      risks: [],
      tasks: []
    }
  },

  // Default KPI templates
  KPIS: {
    PROGRESS: {
      name: 'Progress',
      target: '100%',
      current: '0%'
    },
    BUDGET: {
      name: 'Budget Utilization',
      target: '100%',
      current: '0%'
    },
    TIMELINE: {
      name: 'Timeline Adherence',
      target: '100%',
      current: '0%'
    }
  },

  // Default risk templates
  RISKS: {
    BUDGET: {
      severity: 'medium',
      description: 'Budget overrun risk'
    },
    TIMELINE: {
      severity: 'medium',
      description: 'Timeline delay risk'
    },
    RESOURCE: {
      severity: 'medium',
      description: 'Resource availability risk'
    }
  },

  // Default task templates
  TASKS: {
    PLANNING: {
      title: 'Planning Phase',
      status: 'pending',
      progress: 0,
      priority: 'high'
    },
    EXECUTION: {
      title: 'Execution Phase',
      status: 'pending',
      progress: 0,
      priority: 'high'
    },
    REVIEW: {
      title: 'Review Phase',
      status: 'pending',
      progress: 0,
      priority: 'medium'
    }
  },

  // Default milestone templates
  MILESTONES: {
    KICKOFF: {
      description: 'Project Kickoff',
      offset: 0 // days from start
    },
    MIDPOINT: {
      description: 'Midpoint Review',
      offset: 182 // ~6 months
    },
    COMPLETION: {
      description: 'Project Completion',
      offset: 365 // 1 year
    }
  }
};