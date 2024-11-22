import React, { useState, useEffect } from 'react';
import { Map, Layout, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import NodeDetailsPanel from './NodeDetailsPanel';
import DashboardView from './DashboardView';
import OrbitalNode from './OrbitalNode';
import { initialNodes } from '../data/initialNodes';
import { useOrbitalAnimation } from '../hooks/useOrbitalAnimation';

const EnhancedOrbitalMap = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDashboardView, setIsDashboardView] = useState(false);
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

  const handleNodeUpdate = (updatedNode) => {
    setNodes(nodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    setSelectedNode(updatedNode);
  };

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
              const nodePos = calculateNodePosition(node, nodes, center);
              const radius = Math.sqrt(
                Math.pow(nodePos.x - parentPos.x, 2) + 
                Math.pow(nodePos.y - parentPos.y, 2)
              );

              return (
                <circle
                  key={`orbit-${node.id}`}
                  cx={parentPos.x}
                  cy={parentPos.y}
                  r={radius || 0}
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
                position={calculateNodePosition(node, nodes, center)}
                onSelect={setSelectedNode}
                scale={scale}
              />
            ))}
          </svg>

          {/* Node Details Panel */}
          {selectedNode && (
            <div className="absolute left-4 top-4 w-96 bg-card/90 backdrop-blur-sm p-6 text-card-foreground rounded-lg shadow-xl">
              <NodeDetailsPanel 
                node={selectedNode}
                nodes={nodes}
                onUpdate={handleNodeUpdate}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedOrbitalMap;