import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { format, differenceInDays } from 'date-fns';
import NodeSelector from './NodeSelector';

const NodeDetailsPanel = ({ node, onUpdate, nodes }) => {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [description, setDescription] = useState(node?.description || '');
  const [startDate, setStartDate] = useState(node?.timeline?.start ? new Date(node.timeline.start) : null);
  const [endDate, setEndDate] = useState(node?.timeline?.end ? new Date(node.timeline.end) : null);

  // Update description and dates when node changes
  useEffect(() => {
    setDescription(node?.description || '');
    setStartDate(node?.timeline?.start ? new Date(node.timeline.start) : null);
    setEndDate(node?.timeline?.end ? new Date(node.timeline.end) : null);
  }, [node?.id]);

  const handleDescriptionUpdate = () => {
    onUpdate({
      ...node,
      description
    });
    setIsEditingDescription(false);
  };

  const handleTimelineUpdate = () => {
    if (!startDate || !endDate) return;

    onUpdate({
      ...node,
      timeline: {
        ...node.timeline,
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd')
      }
    });
    setIsEditingTimeline(false);
  };

  const calculateTimeProgress = () => {
    if (!node.timeline?.start || !node.timeline?.end) return 0;
    const start = new Date(node.timeline.start);
    const end = new Date(node.timeline.end);
    const today = new Date();
    const totalDays = differenceInDays(end, start);
    const elapsedDays = differenceInDays(today, start);
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  if (!node) return null;

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
            {node.status === 'on-track' ? <CheckCircle2 className="h-4 w-4" /> :
             node.status === 'at-risk' ? <AlertCircle className="h-4 w-4" /> :
             <XCircle className="h-4 w-4" />}
            <span className="capitalize">{node.status}</span>
          </div>
        </Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* Description Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Description</label>
            </div>
            <button
              onClick={() => {
                if (isEditingDescription) {
                  handleDescriptionUpdate();
                } else {
                  setIsEditingDescription(true);
                }
              }}
              className="text-xs text-primary hover:text-primary/90"
            >
              {isEditingDescription ? 'Save' : 'Edit'}
            </button>
          </div>
          {isEditingDescription ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter description..."
            />
          ) : (
            <p className="text-sm text-muted-foreground">{description || 'No description provided.'}</p>
          )}
        </div>

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
              onValueChange={(value) => {
                onUpdate({
                  ...node,
                  progress: value[0]
                });
              }}
              className="w-full"
            />
          ) : (
            <Progress value={node.progress} className="h-2" />
          )}
          <span className="text-sm text-muted-foreground">{node.progress}% Complete</span>
        </div>

        {/* Timeline Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Timeline Progress</label>
            </div>
            <button
              onClick={() => {
                if (isEditingTimeline) {
                  handleTimelineUpdate();
                } else {
                  setIsEditingTimeline(true);
                }
              }}
              className="text-xs text-primary hover:text-primary/90"
            >
              {isEditingTimeline ? 'Save' : 'Edit'}
            </button>
          </div>

          {isEditingTimeline ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Start Date</label>
                  <Popover>
                    <PopoverTrigger className="w-full flex items-center justify-between px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50">
                      {startDate ? format(startDate, 'MMM dd, yyyy') : 'Select date'}
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">End Date</label>
                  <Popover>
                    <PopoverTrigger className="w-full flex items-center justify-between px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50">
                      {endDate ? format(endDate, 'MMM dd, yyyy') : 'Select date'}
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => startDate ? date < startDate : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {startDate && endDate && (
                <div>
                  <Progress value={calculateTimeProgress()} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {calculateTimeProgress().toFixed(1)}% Time Elapsed
                  </div>
                </div>
              )}
            </div>
          ) : (
            node.timeline?.start && node.timeline?.end ? (
              <>
                <Progress value={calculateTimeProgress()} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Start: {format(new Date(node.timeline.start), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    End: {format(new Date(node.timeline.end), 'MMM dd, yyyy')}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No timeline set</p>
            )
          )}
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
                  onValueChange={(value) => {
                    onUpdate({
                      ...node,
                      spent: value[0]
                    });
                  }}
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
                  onClick={() => {
                    onUpdate({
                      ...node,
                      status
                    });
                    setIsEditingStatus(false);
                  }}
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
};

export default NodeDetailsPanel;