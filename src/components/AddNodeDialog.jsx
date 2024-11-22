import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';

export function AddNodeDialog({ isOpen, onClose, onSave }) {
  const [currentTab, setCurrentTab] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    type: 'planet',
    category: 'strategy',
    description: '',
    
    // Timeline
    startDate: new Date(),
    endDate: new Date(Date.now() + 31536000000), // +1 year
    milestones: [],
    
    // Tasks
    tasks: [],
    
    // Team
    team: [],
    
    // KPIs
    kpis: [],
    
    // Budget
    budget: 0,
    spent: 0,
    
    // Status
    status: 'on-track',
    progress: 0,
    
    // Risks
    risks: []
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave({
      ...formData,
      timeline: {
        start: format(formData.startDate, 'yyyy-MM-dd'),
        end: format(formData.endDate, 'yyyy-MM-dd'),
        milestones: formData.milestones
      }
    });
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Node</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 gap-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="team">Team & KPIs</TabsTrigger>
            <TabsTrigger value="status">Status & Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Node Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter node name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description / Objective</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter node description"
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {format(formData.startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange('startDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {format(formData.endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleInputChange('endDate', date)}
                      disabled={(date) => date < formData.startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Milestones</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Milestone description"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      addArrayItem('milestones', {
                        date: format(new Date(), 'yyyy-MM-dd'),
                        description: e.target.value
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <div className="space-y-1">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/10 p-2 rounded">
                    <span>{milestone.description}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(milestone.date), 'MMM dd, yyyy')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('milestones', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add team member (e.g. John D. (CEO))"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      addArrayItem('team', e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <div className="space-y-1">
                {formData.team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/10 p-2 rounded">
                    <span>{member}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('team', index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>KPIs</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="KPI Name"
                  id="kpi-name"
                />
                <Input
                  placeholder="Target (e.g. 95%)"
                  id="kpi-target"
                />
                <Input
                  placeholder="Current (e.g. 85%)"
                  id="kpi-current"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const name = document.getElementById('kpi-name').value;
                  const target = document.getElementById('kpi-target').value;
                  const current = document.getElementById('kpi-current').value;
                  
                  if (name && target && current) {
                    addArrayItem('kpis', { name, target, current });
                    document.getElementById('kpi-name').value = '';
                    document.getElementById('kpi-target').value = '';
                    document.getElementById('kpi-current').value = '';
                  }
                }}
              >
                Add KPI
              </Button>
              <div className="space-y-2">
                {formData.kpis.map((kpi, index) => (
                  <div key={index} className="bg-muted/10 p-2 rounded space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{kpi.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('kpis', index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <Progress value={(parseFloat(kpi.current) / parseFloat(kpi.target)) * 100} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Current: {kpi.current}</span>
                      <span>Target: {kpi.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="space-y-2">
              <Label>Initial Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Budget</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Total Budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Current Spent"
                  value={formData.spent}
                  onChange={(e) => handleInputChange('spent', Number(e.target.value))}
                />
              </div>
              {formData.budget > 0 && (
                <div className="space-y-1">
                  <Progress value={(formData.spent / formData.budget) * 100} />
                  <div className="text-right text-sm text-muted-foreground">
                    {((formData.spent / formData.budget) * 100).toFixed(1)}% utilized
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Create Node
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}