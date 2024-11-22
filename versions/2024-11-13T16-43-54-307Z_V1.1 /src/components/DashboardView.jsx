import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  Target, 
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  BarChart2,
  Calendar,
  Briefcase,
  Flag,
  Gauge,
  PieChart,
  ScrollText,
  Settings,
  Sparkles
} from 'lucide-react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { format, differenceInDays } from 'date-fns';

const MetricTile = ({ title, value, trend, icon: Icon, color, data }) => (
  <div className="bg-card rounded-xl p-6 border border-border/50">
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm font-medium text-muted-foreground tracking-tight uppercase">{title}</div>
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-black tracking-tighter">{value}</span>
    </div>
    <div className="h-[32px] w-full my-3">
      <svg className="w-full h-full" viewBox="0 0 100 32">
        <path
          d={`M0 30 ${data.map((d, i) => `L${(i / (data.length - 1)) * 100} ${30 - d * 28}`).join(' ')}`}
          fill="none"
          strokeWidth="2"
          stroke={color.replace('text-', 'rgb(var(--')?.replace('500', '500))')}
          className="opacity-50"
        />
        <path
          d={`M0 30 ${data.map((d, i) => `L${(i / (data.length - 1)) * 100} ${30 - d * 28}`).join(' ')} V30 H0`}
          fill={color.replace('text-', 'rgb(var(--')?.replace('500', '500))')}
          className="opacity-10"
        />
      </svg>
    </div>
    <div className="flex items-center gap-1 mt-1">
      <TrendingUp className={`h-3 w-3 ${color}`} />
      <span className={`text-xs font-medium ${color}`}>{trend}</span>
    </div>
  </div>
);

const getStatusIcon = (status) => {
  switch (status) {
    case 'on-track': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case 'at-risk': return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'delayed': return <XCircle className="h-4 w-4 text-rose-500" />;
    default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const DashboardView = ({ nodes }) => {
  // Calculate top metrics
  const totalBudget = nodes.reduce((sum, node) => sum + (node.budget || 0), 0);
  const totalSpent = nodes.reduce((sum, node) => sum + (node.spent || 0), 0);
  const avgProgress = nodes.reduce((sum, node) => sum + (node.progress || 0), 0) / nodes.length;
  const riskCount = nodes.reduce((count, node) => count + (node.risks?.length || 0), 0);
  const teamSize = new Set(nodes.flatMap(node => node.team || [])).size;

  // Sample data for line graphs
  const mockData = [0.2, 0.4, 0.3, 0.8, 0.6, 0.9, 0.7];

  const calculateOverallTimeProgress = () => {
    const nodesWithTimeline = nodes.filter(node => node.timeline?.start && node.timeline?.end);
    if (nodesWithTimeline.length === 0) return 0;

    return nodesWithTimeline.reduce((sum, node) => {
      const start = new Date(node.timeline.start);
      const end = new Date(node.timeline.end);
      const today = new Date();
      const totalDays = differenceInDays(end, start);
      const elapsedDays = differenceInDays(today, start);
      return sum + Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
    }, 0) / nodesWithTimeline.length;
  };

  return (
    <div className="p-8 text-card-foreground h-screen overflow-auto">
      {/* Top metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricTile
          title="Total Budget"
          value={`$${(totalBudget / 1000000).toFixed(1)}M`}
          trend={`${(totalSpent / totalBudget * 100).toFixed(1)}% utilized`}
          icon={DollarSign}
          color="text-emerald-500"
          data={mockData}
        />
        <MetricTile
          title="Team Members"
          value={teamSize}
          trend="+3 this month"
          icon={Users}
          color="text-blue-500"
          data={mockData}
        />
        <MetricTile
          title="Active Projects"
          value={nodes.length}
          trend="2 launching soon"
          icon={Target}
          color="text-violet-500"
          data={mockData}
        />
        <MetricTile
          title="Active Risks"
          value={riskCount}
          trend="4 need attention"
          icon={AlertTriangle}
          color="text-amber-500"
          data={mockData}
        />
      </div>

      {/* Overall Progress */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Overall Progress</h2>
          </div>
          <span className="text-sm text-muted-foreground">{avgProgress.toFixed(1)}% Complete</span>
        </div>
        <Progress value={avgProgress} className="h-2" />
      </Card>

      {/* Overall Timeline */}
      <Card className="mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Overall Timeline</h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {calculateOverallTimeProgress().toFixed(1)}% Time Elapsed
          </span>
        </div>
        <Progress value={calculateOverallTimeProgress()} className="h-2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {nodes.map(node => node.timeline?.start && node.timeline?.end && (
            <div key={node.id} className="bg-muted/10 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{node.name}</span>
                <Badge variant={
                  calculateTimeProgress(node) <= 50 ? 'success' :
                  calculateTimeProgress(node) <= 75 ? 'warning' : 'danger'
                }>
                  {calculateTimeProgress(node).toFixed(0)}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(node.timeline.start), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(node.timeline.end), 'MMM dd, yyyy')}
                </div>
              </div>
              <Progress 
                value={calculateTimeProgress(node)} 
                className="h-1.5" 
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Projects grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nodes.map(node => (
          <Card key={node.id} className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">{node.name}</h3>
                </div>
                <div className="text-sm text-muted-foreground">{node.description}</div>
              </div>
              <Badge variant={
                node.status === 'on-track' ? 'success' :
                node.status === 'at-risk' ? 'warning' :
                'danger'
              }>
                <div className="flex items-center gap-1">
                  {getStatusIcon(node.status)}
                  <span>{node.status}</span>
                </div>
              </Badge>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span>{node.progress}%</span>
              </div>
              <Progress value={node.progress} className="h-2" />
            </div>

            {/* Budget Overview */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Budget Overview</span>
              </div>
              <div className="bg-muted/10 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      Budget
                    </div>
                    <div className="text-lg font-semibold">${(node.budget / 1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <BarChart2 className="h-4 w-4 text-amber-500" />
                      Spent
                    </div>
                    <div className="text-lg font-semibold">${(node.spent / 1000).toFixed(0)}k</div>
                  </div>
                </div>
                <Progress value={(node.spent / node.budget) * 100} className="h-1.5" />
                <div className="text-xs text-right text-muted-foreground mt-1">
                  {Math.round((node.spent / node.budget) * 100)}% utilized
                </div>
              </div>
            </div>

            {/* Team Members */}
            {node.team && node.team.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Team Members</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {node.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted/10 p-2 rounded">
                      <Briefcase className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KPIs */}
            {node.kpis && node.kpis.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Key Performance Indicators</span>
                </div>
                <div className="space-y-3">
                  {node.kpis.map((kpi, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-400" />
                          <span className="text-sm">{kpi.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium">{kpi.target}</span>
                        </div>
                      </div>
                      <Progress
                        value={(parseFloat(kpi.current) / parseFloat(kpi.target.replace('%', ''))) * 100}
                        className="h-1.5"
                      />
                      <div className="text-right text-xs text-muted-foreground">
                        Current: {kpi.current}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {node.risks && node.risks.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Risk Assessment</span>
                </div>
                <div className="space-y-2">
                  {node.risks.map((risk, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted/10 p-2 rounded">
                      <AlertTriangle 
                        className={`h-4 w-4 ${
                          risk.severity === 'high' ? 'text-rose-500' : 
                          risk.severity === 'medium' ? 'text-amber-500' : 
                          'text-blue-500'
                        }`}
                      />
                      <span className="text-sm">{risk.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {node.timeline?.milestones && node.timeline.milestones.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Timeline</span>
                </div>
                <div className="space-y-2">
                  {node.timeline.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 bg-muted/10 p-2 rounded">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <div className="flex-1">
                        <div className="text-sm">{milestone.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(milestone.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to calculate time progress for a single node
const calculateTimeProgress = (node) => {
  if (!node.timeline?.start || !node.timeline?.end) return 0;
  const start = new Date(node.timeline.start);
  const end = new Date(node.timeline.end);
  const today = new Date();
  const totalDays = differenceInDays(end, start);
  const elapsedDays = differenceInDays(today, start);
  return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
};

export default DashboardView;