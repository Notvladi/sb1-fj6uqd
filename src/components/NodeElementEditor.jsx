import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export function NodeElementEditor({ type, element: initialElement = {}, onSave, onCancel }) {
  const [element, setElement] = useState(initialElement);
  
  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(element);
  };

  const renderEditor = () => {
    switch (type) {
      case 'team':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={element.name || ''}
              onChange={(e) => setElement({ ...element, name: e.target.value })}
              placeholder="Team member name"
              required
            />
          </form>
        );

      case 'kpi':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={element.name || ''}
              onChange={(e) => setElement({ ...element, name: e.target.value })}
              placeholder="KPI name"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={element.target || ''}
                onChange={(e) => setElement({ ...element, target: e.target.value })}
                placeholder="Target value"
                required
              />
              <Input
                value={element.current || ''}
                onChange={(e) => setElement({ ...element, current: e.target.value })}
                placeholder="Current value"
                required
              />
            </div>
          </form>
        );

      case 'risk':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={element.severity || 'medium'}
              onChange={(e) => setElement({ ...element, severity: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-muted/10 rounded-md border border-border/50"
              required
            >
              <option value="">Select severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Input
              value={element.description || ''}
              onChange={(e) => setElement({ ...element, description: e.target.value })}
              placeholder="Risk description"
              required
            />
          </form>
        );

      case 'milestone':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {element.date && isValidDate(element.date) 
                    ? format(new Date(element.date), 'PPP') 
                    : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={element.date && isValidDate(element.date) 
                    ? new Date(element.date) 
                    : undefined}
                  onSelect={(date) => setElement({ 
                    ...element, 
                    date: format(date, 'yyyy-MM-dd') 
                  })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              value={element.description || ''}
              onChange={(e) => setElement({ ...element, description: e.target.value })}
              placeholder="Milestone description"
              required
            />
          </form>
        );

      default:
        return null;
    }
  };

  const isValid = () => {
    switch (type) {
      case 'team':
        return element.name?.trim();
      case 'kpi':
        return element.name?.trim() && element.target?.trim() && element.current?.trim();
      case 'risk':
        return element.severity && element.description?.trim();
      case 'milestone':
        return element.date && isValidDate(element.date) && element.description?.trim();
      default:
        return false;
    }
  };

  return (
    <div className="space-y-4">
      {renderEditor()}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          onClick={handleSubmit}
          disabled={!isValid()}
        >
          Add {type}
        </Button>
      </div>
    </div>
  );
}