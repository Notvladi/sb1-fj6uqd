import React, { useState, useEffect, useCallback } from 'react';
import { Map, Layout, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import NodeDetailsPanel from './NodeDetailsPanel';
import DashboardView from './DashboardView';
import OrbitalNode from './OrbitalNode';
import { TaskDialog } from './TaskDialog';
import { initialNodes } from '../data/initialNodes';
import { useOrbitalAnimation } from '../hooks/useOrbitalAnimation';

const ORBIT_SNAP_THRESHOLD = 100;

const isDescendantOf = (nodes, nodeAId, nodeBId) => {
  let current = nodes.find(n => n.id === nodeBId);
  while (current && current.parentId) {
    if (current.parentId === nodeAId) return true;
    current = nodes.find(n => n.id === current.parentId);
  }
  return false;
};

export default function EnhancedOrbitalMap() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDashboardView, setIsDashboardView] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const { scale, setScale, calculateNodePosition } = useOrbitalAnimation(0.8);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleNodeUpdate = useCallback((updatedNode) => {
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    setSelectedNode(updatedNode);
  }, []);

  const findClosestOrbit = useCallback((node, coords, center) => {
    if (node.type === 'sun') return null;

    // For planets, check if it should become a moon
    if (node.type === 'planet') {
      const potentialParents = nodes.filter(n => 
        n.type === 'planet' && 
        n.id !== node.id &&
        !isDescendantOf(nodes, node.id, n.id)
      );

      // Find the closest potential parent
      let closestParent = null;
      let minDistance = Infinity;

      for (const parent of potentialParents) {
        const parentPos = calculateNodePosition(parent, nodes, center);
        const distanceFromParent = Math.sqrt(
          Math.pow(coords.x - parentPos.x, 2) + 
          Math.pow(coords.y - parentPos.y, 2)
        );

        if (distanceFromParent < ORBIT_SNAP_THRESHOLD && distanceFromParent < minDistance) {
          minDistance = distanceFromParent;
          closestParent = parent;
        }
      }

      if (closestParent) {
        // Calculate orbit radius based on existing moons
        const existingMoons = nodes.filter(n => n.type === 'moon' && n.parentId === closestParent.id);
        const orbitRadius = 60 + (existingMoons.length * 30); // Base radius + increment per moon

        return { 
          type: 'moon', 
          parentId: closestParent.id,
          orbit: orbitRadius
        };
      }
    }

    // For moons, check if they should become planets
    if (node.type === 'moon') {
      const parent = nodes.find(n => n.id === node.parentId);
      if (parent) {
        const parentPos = calculateNodePosition(parent, nodes, center);
        const distanceFromParent = Math.sqrt(
          Math.pow(coords.x - parentPos.x, 2) + 
          Math.pow(coords.y - parentPos.y, 2)
        );

        if (distanceFromParent > ORBIT_SNAP_THRESHOLD * 2) {
          // Calculate new planet orbit based on existing planets
          const existingPlanets = nodes.filter(n => n.type === 'planet');
          const orbitRadius = 180 + (existingPlanets.length * 100); // Base radius + increment per planet

          return { 
            type: 'planet', 
            parentId: 'center',
            orbit: orbitRadius
          };
        }
      }
    }

    return null;
  }, [nodes, calculateNodePosition]);

  const handleNodeDrag = useCallback((node, coords, isDragEnd = false) => {
    if (isDragEnd) {
      const center = {
        x: dimensions.width / 2,
        y: dimensions.height / 2
      };

      const newOrbit = findClosestOrbit(node, coords, center);
      if (newOrbit) {
        handleNodeUpdate({
          ...node,
          ...newOrbit
        });
      }

      setDraggedNode(null);
    } else {
      setDraggedNode({
        ...node,
        position: coords
      });
    }
  }, [dimensions, findClosestOrbit, handleNodeUpdate]);

  const handleTaskSave = useCallback((taskData) => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        tasks: selectedNode.tasks || []
      };

      if (taskToEdit) {
        // Update existing task
        updatedNode.tasks = updatedNode.tasks.map(task =>
          task.id === taskToEdit.id ? { ...taskData, id: task.id } : task
        );
      } else {
        // Add new task
        updatedNode.tasks = [
          ...updatedNode.tasks,
          { ...taskData, id: Date.now().toString() }
        ];
      }

      // Update progress based on tasks
      const totalProgress = updatedNode.tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
      updatedNode.progress = Math.round(totalProgress / updatedNode.tasks.length);

      handleNodeUpdate(updatedNode);
      setShowTaskDialog(false);
      setTaskToEdit(null);
    }
  }, [selectedNode, taskToEdit, handleNodeUpdate]);

  const handleOpenTaskDialog = useCallback((task = null) => {
    setTaskToEdit(task);
    setShowTaskDialog(true);
  }, []);

  const center = {
    x: dimensions.width / 2,
    y: dimensions.height / 2
  };

  return (
    <div className={`w-full h-screen bg-background relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-10">
        <button 
          className="p-2 bg-card rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground shadow-lg"
          onClick={() => setIsDashboardView(!isDashboardView)}
          title={isDashboardView ? "Switch to Map View" : "Switch to Dashboard View"}
        >
          {isDashboardView ? <Map size={20} /> : <Layout size={20} />}
        </button>
        <button 
          className="p-2 bg-card rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground shadow-lg"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
        {!isDashboardView && (
          <>
            <button 
              className="p-2 bg-card rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground shadow-lg"
              onClick={() => setScale(prev => Math.min(prev * 1.2, 2))}
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              className="p-2 bg-card rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground shadow-lg"
              onClick={() => setScale(prev => Math.max(prev / 1.2, 0.5))}
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
          </>
        )}
      </div>

      {isDashboardView ? (
        <DashboardView nodes={nodes} onUpdate={handleNodeUpdate} />
      ) : (
        <div className="relative w-full h-full">
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0"
          >
            {/* Orbit paths */}
            {nodes.map(node => {
              if (node.type === 'sun') return null;
              const parent = nodes.find(n => n.id === node.parentId);
              const parentPos = parent ? calculateNodePosition(parent, nodes, center) : center;
              const nodePos = draggedNode?.id === node.id ? draggedNode.position : calculateNodePosition(node, nodes, center);
              const radius = Math.sqrt(
                Math.pow(nodePos.x - parentPos.x, 2) + 
                Math.pow(nodePos.y - parentPos.y, 2)
              );

              return (
                <circle
                  key={`orbit-${node.id}`}
                  cx={parentPos.x}
                  cy={parentPos.y}
                  r={radius}
                  fill="none"
                  stroke="#4B5563"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                  opacity={0.3}
                />
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <OrbitalNode
                key={node.id}
                node={node}
                position={draggedNode?.id === node.id ? draggedNode.position : calculateNodePosition(node, nodes, center)}
                onSelect={setSelectedNode}
                onDrag={handleNodeDrag}
                scale={scale}
              />
            ))}
          </svg>

          {/* Node Details Panel */}
          {selectedNode && (
            <div className="absolute left-4 top-4 w-96 bg-card/90 backdrop-blur-sm rounded-lg shadow-xl">
              <NodeDetailsPanel 
                node={selectedNode}
                nodes={nodes}
                onUpdate={handleNodeUpdate}
                onOpenTaskDialog={handleOpenTaskDialog}
              />
            </div>
          )}

          {/* Task Dialog */}
          <TaskDialog
            open={showTaskDialog}
            onOpenChange={setShowTaskDialog}
            onSave={handleTaskSave}
            task={taskToEdit}
            node={selectedNode}
          />
        </div>
      )}
    </div>
  );
}