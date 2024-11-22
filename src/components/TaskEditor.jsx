import React from 'react';
import { format } from 'date-fns';
import { Calendar, Users, Target, Clock } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

export function TaskEditor({ task = {}, node = {}, onChange, onCancel }) {
  const handleChange = (updates) => {
    onChange({
      ...task,
      ...updates
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={task.title || ''}
        onChange={(e) => handleChange({ title: e.target.value })}
        placeholder="Task title"
        className="w-full px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex items-center gap-2">
        <select
          value={task.status || 'pending'}
          onChange={(e) => handleChange({ status: e.target.value })}
          className="px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <Popover>
          <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50">
            {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'Select date'}
            <Calendar className="h-4 w-4" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={task.dueDate ? new Date(task.dueDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  handleChange({ dueDate: format(date, 'yyyy-MM-dd') });
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Progress</label>
          <span className="text-sm">{task.progress || 0}%</span>
        </div>
        <Slider
          value={[task.progress || 0]}
          max={100}
          step={1}
          onValueChange={(value) => handleChange({ progress: value[0] })}
          className="w-full"
        />
        <Progress value={task.progress || 0} className="h-1.5" />
      </div>

      <textarea
        value={task.description || ''}
        onChange={(e) => handleChange({ description: e.target.value })}
        placeholder="Task description"
        className="w-full h-24 px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onChange(task)}>
          {task.id ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </div>
  );
}