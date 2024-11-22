import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, Link2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';

export function TaskDialog({ open, onOpenChange, onSave, task, node }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    progress: task?.progress || 0,
    dueDate: task?.dueDate ? new Date(task.dueDate) : null,
    linkedKpis: task?.linkedKpis || [],
    linkedMilestones: task?.linkedMilestones || [],
    assignees: task?.assignees || []
  });

  const handleProgressChange = ([value]) => {
    setFormData(prev => ({
      ...prev,
      progress: value,
      status: value === 100 ? 'completed' : 
              value > 0 ? 'in-progress' : 
              'pending'
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave({
      ...formData,
      dueDate: formData.dueDate ? format(formData.dueDate, 'yyyy-MM-dd') : null
    });
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/30 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-4xl mx-4">
        <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-border/50">
            <h2 className="text-2xl font-semibold tracking-tight">
              {task ? 'Edit Task' : 'Create Task'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                  className="text-lg"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  className="w-full min-h-[120px] px-3 py-2 text-sm bg-background/50 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Label>Progress</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[formData.progress]}
                    max={100}
                    step={1}
                    className="flex-1"
                    onValueChange={handleProgressChange}
                  />
                  <span className="w-12 text-sm text-right">{formData.progress}%</span>
                </div>
                <Progress value={formData.progress} className="h-2" />
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label>Due Date</Label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(formData.dueDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-auto p-0" 
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      style={{ zIndex: 200 }}
                    >
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Links Section */}
              {(node?.kpis?.length > 0 || node?.team?.length > 0 || node?.timeline?.milestones?.length > 0) && (
                <div className="space-y-4 bg-muted/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    <Label>Link Task To</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* KPIs */}
                    {node.kpis?.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">KPIs</Label>
                        <div className="space-y-2">
                          {node.kpis.map(kpi => (
                            <div key={kpi.name} className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.linkedKpis.includes(kpi.name)}
                                onCheckedChange={(checked) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    linkedKpis: checked 
                                      ? [...prev.linkedKpis, kpi.name]
                                      : prev.linkedKpis.filter(k => k !== kpi.name)
                                  }));
                                }}
                              />
                              <span className="text-sm">{kpi.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Members */}
                    {node.team?.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Assignees</Label>
                        <div className="space-y-2">
                          {node.team.map(member => (
                            <div key={member} className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.assignees.includes(member)}
                                onCheckedChange={(checked) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    assignees: checked 
                                      ? [...prev.assignees, member]
                                      : prev.assignees.filter(m => m !== member)
                                  }));
                                }}
                              />
                              <span className="text-sm">{member}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    {node.timeline?.milestones?.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Milestones</Label>
                        <div className="space-y-2">
                          {node.timeline.milestones.map(milestone => (
                            <div key={milestone.date} className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.linkedMilestones.includes(milestone.date)}
                                onCheckedChange={(checked) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    linkedMilestones: checked 
                                      ? [...prev.linkedMilestones, milestone.date]
                                      : prev.linkedMilestones.filter(m => m !== milestone.date)
                                  }));
                                }}
                              />
                              <span className="text-sm">{milestone.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {task ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}