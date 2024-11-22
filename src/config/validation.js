// Validation rules and constraints
export const VALIDATION = {
  NODE: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\-_]+$/
    },
    description: {
      required: false,
      maxLength: 500
    },
    budget: {
      min: 0,
      max: 1000000000,
      precision: 2
    },
    progress: {
      min: 0,
      max: 100,
      step: 1
    }
  },

  TASK: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      required: false,
      maxLength: 1000
    },
    duration: {
      min: 1,
      max: 365, // days
      required: true
    }
  },

  TEAM: {
    member: {
      nameFormat: /^[a-zA-Z\s]+ \([^)]+\)$/, // e.g., "John Doe (Developer)"
      maxLength: 50
    },
    size: {
      min: 1,
      max: 20
    }
  },

  KPI: {
    name: {
      required: true,
      maxLength: 50
    },
    target: {
      required: true,
      pattern: /^[0-9]+%?$/
    },
    current: {
      required: true,
      pattern: /^[0-9]+%?$/
    }
  },

  TIMELINE: {
    startDate: {
      required: true,
      minDate: new Date().toISOString()
    },
    endDate: {
      required: true,
      validator: (startDate, endDate) => new Date(endDate) > new Date(startDate)
    },
    milestones: {
      max: 20,
      validator: (date, startDate, endDate) => {
        const d = new Date(date);
        return d >= new Date(startDate) && d <= new Date(endDate);
      }
    }
  }
};