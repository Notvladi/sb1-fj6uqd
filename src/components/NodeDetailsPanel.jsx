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
  Sparkles,
  Plus,
  Briefcase
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import NodeSelector from './NodeSelector';

export default function NodeDetailsPanel({ node, onUpdate, nodes, onOpenTaskDialog }) {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  if (!node) return null;

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

  return (
    <div className="w-full bg-card text-card-foreground rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">{node.name}</h2>
          </div>
          <div className="text-sm text-muted-foreground">{node.description}</div>
        </div>
        <Badge variant={
          node.status === 'on-track' ? 'success' :
          node.status === 'at-risk' ? 'warning' : 'danger'
        }>
          <div className="flex items-center gap-1">
            {node.status === 'on-track' ? <CheckCircle2 className="h-4 w-4" /> :
             node.status === 'at-risk' ? <AlertCircle className="h-4 w-4" /> :
             <XCircle className="h-4 w-4" />}
            <span className="capitalize">{node.status}</span>
          </div>
        </Badge>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
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
            <Progress value={node.progress} className="h-2" />
          )}
          <span className="text-sm text-muted-foreground">{node.progress}% Complete</span>
        </div>

        {/* Budget Overview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Budget Overview</span>
            <button
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-xs text-primary hover:text-primary/90 ml-auto"
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
                    {status === 'on-track' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                     status === 'at-risk' ? <AlertCircle className="h-4 w-4 text-amber-500" /> :
                     <XCircle className="h-4 w-4 text-rose-500" />}
                    <span className="capitalize">{status}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tasks</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onOpenTaskDialog()}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          {node.tasks?.length > 0 ? (
            <div className="space-y-2">
              {node.tasks.map(task => (
                <div
                  key={task.id}
                  className="group bg-muted/10 p-3 rounded-lg hover:bg-muted/20 cursor-pointer"
                  onClick={() => onOpenTaskDialog(task)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{task.title}</span>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
                      Edit
                    </span>
                  </div>
                  <Progress value={task.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              No tasks yet
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
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(milestone.date), 'MMM dd, yyyy')}
                    </div>
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
              onSelect={(selectedNode) => {
                onUpdate({
                  ...node,
                  type: 'moon',
                  parentId: selectedNode.id,
                  orbit: 80
                });
              }}
              onUnlink={() => {
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
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}