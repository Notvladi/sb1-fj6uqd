import React from 'react';
import { format } from 'date-fns';
import { Calendar, Users, Target, AlertTriangle, Clock } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { TaskEditor } from './TaskEditor';

export const ElementEditor = ({ type, element, node, onChange, onSave, onDelete }) => {
  const renderEditor = () => {
    switch (type) {
      case 'task':
        return <TaskEditor task={element} node={node} onChange={onChange} />;

      case 'team':
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            <input
              type="text"
              value={element.name || ''}
              onChange={(e) => onChange({ ...element, name: e.target.value })}
              placeholder="Team member name"
              className="flex-1 px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        );

      case 'kpi':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <input
                type="text"
                value={element.name || ''}
                onChange={(e) => onChange({ ...element, name: e.target.value })}
                placeholder="KPI name"
                className="flex-1 px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={element.target || ''}
                onChange={(e) => onChange({ ...element, target: e.target.value })}
                placeholder="Target value"
                className="px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                value={element.current || ''}
                onChange={(e) => onChange({ ...element, current: e.target.value })}
                placeholder="Current value"
                className="px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <select
                value={element.severity || 'medium'}
                onChange={(e) => onChange({ ...element, severity: e.target.value })}
                className="px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <input
              type="text"
              value={element.description || ''}
              onChange={(e) => onChange({ ...element, description: e.target.value })}
              placeholder="Risk description"
              className="w-full px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        );

      case 'milestone':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <Popover>
                <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50">
                  {format(new Date(element.date), 'MMM dd, yyyy')}
                  <Calendar className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={new Date(element.date)}
                    onSelect={(date) => onChange({ ...element, date: format(date, 'yyyy-MM-dd') })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <input
              type="text"
              value={element.description || ''}
              onChange={(e) => onChange({ ...element, description: e.target.value })}
              placeholder="Milestone description"
              className="w-full px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
      {renderEditor()}
      <div className="flex justify-end gap-2">
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm text-red-500 hover:bg-red-500/10 rounded"
        >
          Delete
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};