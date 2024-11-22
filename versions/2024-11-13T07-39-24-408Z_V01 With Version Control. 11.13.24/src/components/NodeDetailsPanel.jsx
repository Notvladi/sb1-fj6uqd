import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Target, 
  Clock, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  Link,
  Unlink,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Settings,
  PieChart,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import NodeSelector from './NodeSelector';

const NodeDetailsPanel = ({ node, onUpdate, nodes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  if (!node) return null;

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-emerald-500';
    if (progress >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-track': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'at-risk': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'delayed': return <XCircle className="h-4 w-4 text-rose-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleProgressChange = (value) => {
    onUpdate({
      ...node,
      progress: Math.round(value[0])
    });
  };

  const handleBudgetChange = (value) => {
    onUpdate({
      ...node,
      spent: Math.round(value[0])
    });
  };

  const handleStatusChange = (newStatus) => {
    onUpdate({
      ...node,
      status: newStatus
    });
    setIsEditingStatus(false);
  };

  const handleMakeNodeMoon = (parentNode) => {
    onUpdate({
      ...node,
      type: 'moon',
      parentId: parentNode.id,
      orbit: 80
    });
  };

  const handleUnlinkNode = () => {
    const maxPlanetOrbit = Math.max(
      ...nodes.filter(n => n.type === 'planet').map(n => n.orbit || 0),
      0
    );
    
    onUpdate({
      ...node,
      type: 'planet',
      parentId: 'center',
      orbit: maxPlanetOrbit + 120
    });
  };

  return (
    <div className="w-full bg-card text-card-foreground rounded-lg shadow-xl">
      <div className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">{node.name}</h2>
        </div>
        <Badge variant={
          node.status === 'on-track' ? 'success' :
          node.status === 'at-risk' ? 'warning' : 'danger'
        }>
          <div className="flex items-center gap-1">
            {getStatusIcon(node.status)}
            <span className="capitalize">{node.status}</span>
          </div>
        </Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Progress</label>
            </div>
            <button
              onClick={() => setIsEditingProgress(!isEditingProgress)}
              className="text-xs text-primary hover:text-primary/90"
            >
              {isEditingProgress ? 'Save' : 'Edit'}
            </button>
          </div>
          {isEditingProgress ? (
            <Slider
              defaultValue={[node.progress]}
              max={100}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full"
            />
          ) : (
            <Progress value={node.progress} className={getProgressColor(node.progress)} />
          )}
          <span className="text-sm text-muted-foreground">{node.progress}% Complete</span>
        </div>

        {/* Budget Section */}
        {(node.budget || node.spent) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">Budget Overview</label>
              </div>
              <button
                onClick={() => setIsEditingBudget(!isEditingBudget)}
                className="text-xs text-primary hover:text-primary/90"
              >
                {isEditingBudget ? 'Save' : 'Edit'}
              </button>
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
              {isEditingBudget ? (
                <Slider
                  defaultValue={[node.spent]}
                  max={node.budget}
                  step={1000}
                  onValueChange={handleBudgetChange}
                  className="w-full"
                />
              ) : (
                <Progress value={(node.spent / node.budget) * 100} className="h-1.5" />
              )}
              <div className="text-xs text-right text-muted-foreground mt-1">
                {Math.round((node.spent / node.budget) * 100)}% utilized
              </div>
            </div>
          </div>
        )}

        {/* Status Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Status</label>
            </div>
            <button
              onClick={() => setIsEditingStatus(!isEditingStatus)}
              className="text-xs text-primary hover:text-primary/90"
            >
              {isEditingStatus ? 'Cancel' : 'Change'}
            </button>
          </div>
          {isEditingStatus && (
            <div className="space-y-1">
              {['on-track', 'at-risk', 'delayed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    node.status === status ? 'bg-accent' : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className="capitalize">{status}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        {node.team && node.team.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Team Members</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {node.team.map((member, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted/10 p-2 rounded">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">{member}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPIs */}
        {node.kpis && node.kpis.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Timeline</span>
            </div>
            <div className="space-y-2">
              {node.timeline.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 bg-muted/10 p-2 rounded">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <div className="flex-1">
                    <div className="text-sm">{milestone.description}</div>
                    <div className="text-xs text-muted-foreground">{milestone.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Node Type Section */}
        {node.type !== 'sun' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Orbital Configuration</label>
            </div>
            <NodeSelector
              nodes={nodes}
              currentNode={node}
              onSelect={handleMakeNodeMoon}
              onUnlink={handleUnlinkNode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeDetailsPanel;