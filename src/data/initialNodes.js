export const initialNodes = [
  { 
    id: 'center',
    name: 'Main Organization',
    type: 'sun',
    category: 'strategy',
    status: 'active',
    description: 'Central organization hub',
    budget: 5000000,
    spent: 2100000,
    team: ['John D. (CEO)', 'Sarah M. (COO)', 'Mike R. (CTO)'],
    kpis: [
      { name: 'Revenue Growth', target: '25%', current: '18%' },
      { name: 'Digital Adoption', target: '80%', current: '65%' },
      { name: 'Customer Satisfaction', target: '95%', current: '92%' }
    ],
    risks: [
      { severity: 'high', description: 'Market volatility impact' },
      { severity: 'medium', description: 'Resource constraints' }
    ],
    timeline: {
      start: '2024-01-01',
      end: '2024-12-31',
      milestones: [
        { date: '2024-03-31', description: 'Q1 Digital Strategy Review' },
        { date: '2024-06-30', description: 'Mid-year Transformation Assessment' }
      ]
    },
    progress: 65,
    tasks: []
  },
  { 
    id: 'digital-transform',
    name: 'Digital Transformation',
    type: 'planet',
    parentId: 'center',
    category: 'technology',
    status: 'on-track',
    description: 'Enterprise-wide digital transformation initiative',
    budget: 2000000,
    spent: 800000,
    team: ['Alex T. (Digital Director)', 'Maria S. (Change Manager)'],
    kpis: [
      { name: 'Process Automation', target: '70%', current: '45%' },
      { name: 'Employee Digital Skills', target: '90%', current: '75%' }
    ],
    risks: [
      { severity: 'medium', description: 'Technical debt accumulation' },
      { severity: 'medium', description: 'Change resistance' }
    ],
    progress: 45,
    tasks: []
  },
  {
    id: 'cloud-migration',
    name: 'Cloud Migration',
    type: 'moon',
    parentId: 'digital-transform',
    category: 'technology',
    status: 'at-risk',
    description: 'Migration of legacy systems to cloud infrastructure',
    budget: 800000,
    spent: 400000,
    team: ['David L. (Cloud Architect)', 'Nina P. (DevOps Lead)'],
    kpis: [
      { name: 'Systems Migrated', target: '100%', current: '40%' },
      { name: 'Downtime Reduction', target: '99.9%', current: '98.5%' }
    ],
    progress: 40,
    tasks: []
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics Platform',
    type: 'moon',
    parentId: 'digital-transform',
    category: 'technology',
    status: 'on-track',
    description: 'Implementation of enterprise data analytics',
    budget: 600000,
    spent: 250000,
    team: ['Rachel K. (Data Science)', 'Tom M. (BI Lead)'],
    kpis: [
      { name: 'Data Integration', target: '90%', current: '65%' },
      { name: 'User Adoption', target: '75%', current: '60%' }
    ],
    progress: 55,
    tasks: []
  },
  {
    id: 'digital-workplace',
    name: 'Digital Workplace',
    type: 'planet',
    parentId: 'center',
    category: 'operations',
    status: 'on-track',
    description: 'Modern workplace and collaboration tools',
    budget: 500000,
    spent: 200000,
    team: ['Patricia H. (IT)', 'James R. (Training)'],
    kpis: [
      { name: 'Tool Adoption', target: '95%', current: '82%' },
      { name: 'Productivity Gain', target: '30%', current: '25%' }
    ],
    progress: 70,
    tasks: []
  },
  {
    id: 'customer-experience',
    name: 'Customer Experience',
    type: 'planet',
    parentId: 'center',
    category: 'strategy',
    status: 'on-track',
    description: 'Digital customer experience enhancement',
    budget: 1000000,
    spent: 400000,
    team: ['Lisa M. (CX Lead)', 'Chris P. (UX Director)'],
    kpis: [
      { name: 'Customer Satisfaction', target: '90%', current: '85%' },
      { name: 'Digital Engagement', target: '75%', current: '60%' }
    ],
    progress: 65,
    tasks: []
  }
];