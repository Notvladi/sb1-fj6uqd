import React, { useState } from 'react';
import { Check, ChevronsUpDown, Link, Unlink } from 'lucide-react';
import { cn } from '../lib/utils';

const NodeSelector = ({ nodes, currentNode, onSelect, onUnlink }) => {
  const [open, setOpen] = useState(false);

  // Filter out nodes that can become moons of the current node (if it's a planet)
  const availableMoons = nodes.filter(node => 
    // Only planets can be converted to moons
    node.type === 'planet' && 
    // Can't select self
    node.id !== currentNode.id &&
    // Can't select ancestors to prevent cycles
    !isAncestorOf(nodes, node.id, currentNode.id)
  );

  // Helper function to check if nodeA is an ancestor of nodeB
  function isAncestorOf(nodes, nodeAId, nodeBId) {
    let current = nodes.find(n => n.id === nodeBId);
    while (current && current.parentId) {
      if (current.parentId === nodeAId) return true;
      current = nodes.find(n => n.id === current.parentId);
    }
    return false;
  }

  const handleMakeMoon = (selectedNode) => {
    // Convert the selected node into a moon of the current node
    onSelect({
      ...selectedNode,
      type: 'moon',
      parentId: currentNode.id
    });
  };

  return (
    <div className="space-y-2">
      {currentNode.type === 'moon' ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link className="h-4 w-4 text-muted-foreground" />
            <span>Orbiting: {nodes.find(n => n.id === currentNode.parentId)?.name}</span>
          </div>
          <button
            onClick={onUnlink}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/90"
          >
            <Unlink className="h-3 w-3" />
            <span>Make Planet</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm",
              "bg-muted/10 hover:bg-muted/20 rounded-md transition-colors",
              "border border-border/50"
            )}
          >
            <span>Add Moon...</span>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {open && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
              <div className="p-1">
                {availableMoons.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No available nodes to make moons
                  </div>
                ) : (
                  availableMoons.map((node) => (
                    <button
                      key={node.id}
                      className={cn(
                        "w-full flex items-center px-2 py-1.5 text-sm rounded-sm",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground outline-none"
                      )}
                      onClick={() => {
                        handleMakeMoon(node);
                        setOpen(false);
                      }}
                    >
                      {node.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NodeSelector;