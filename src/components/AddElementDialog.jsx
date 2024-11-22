import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { NodeElementEditor } from './NodeElementEditor';

export function AddElementDialog({ isOpen, type, onClose, onSave }) {
  const titles = {
    team: 'Add Team Member',
    kpi: 'Add KPI',
    risk: 'Add Risk',
    milestone: 'Add Milestone'
  };

  const handleSave = (element) => {
    // For team members, we just need the name string
    if (type === 'team') {
      onSave(element.name);
    } else {
      onSave(element);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{titles[type]}</DialogTitle>
        </DialogHeader>
        <NodeElementEditor
          type={type}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}