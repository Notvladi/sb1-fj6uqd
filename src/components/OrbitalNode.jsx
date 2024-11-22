import React, { useState } from 'react';
import { useDrag } from '../hooks/useDrag';

const categories = {
  strategy: { color: '#36B37E', name: 'Strategy' },
  operations: { color: '#6554C0', name: 'Operations' },
  technology: { color: '#FF8B00', name: 'Technology' },
  hr: { color: '#FF5630', name: 'HR' }
};

const OrbitalNode = ({ node, position, onSelect, onDrag, scale }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { dragStart } = useDrag({
    onDragStart: () => {
      setIsDragging(true);
      onSelect(node);
    },
    onDrag: (coords) => {
      onDrag?.(node, coords);
    },
    onDragEnd: (coords) => {
      setIsDragging(false);
      onDrag?.(node, coords, true);
    }
  });

  const getNodeColor = () => {
    if (node.type === 'sun') return '#FFB900';
    return categories[node.category]?.color || '#36B37E';
  };

  const getNodeSize = () => {
    const baseSize = (() => {
      switch (node.type) {
        case 'sun': return 30;
        case 'planet': return 20;
        case 'moon': return 12;
        default: return 15;
      }
    })();
    return baseSize * scale;
  };

  return (
    <g
      transform={`translate(${position.x},${position.y})`}
      onClick={() => !isDragging && onSelect(node)}
      onMouseDown={dragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Hover effect */}
      <circle
        r={getNodeSize() * 1.4}
        fill={getNodeColor()}
        opacity={isHovered ? 0.15 : 0}
        style={{ transition: 'all 200ms ease' }}
      />
      
      {/* Main node circle */}
      <circle
        r={getNodeSize()}
        fill={getNodeColor()}
        stroke="white"
        strokeWidth={2 * scale}
        style={{ 
          filter: isHovered ? 'brightness(1.2)' : 'none',
          transition: 'all 200ms ease'
        }}
      />

      {/* Progress ring */}
      <circle
        r={getNodeSize()}
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth={3 * scale}
        strokeDasharray={`${2 * Math.PI * getNodeSize() * (node.progress / 100)} ${2 * Math.PI * getNodeSize()}`}
        transform={`rotate(-90)`}
      />

      {/* Node label */}
      <text
        y={getNodeSize() + 15 * scale}
        textAnchor="middle"
        fill="white"
        fontSize={12 * scale}
        style={{ 
          fontWeight: isHovered ? 'bold' : 'normal',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {node.name}
      </text>

      {/* Category label */}
      {node.category && !isHovered && (
        <text
          y={getNodeSize() + 30 * scale}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize={10 * scale}
          style={{ 
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {categories[node.category]?.name}
        </text>
      )}

      {/* Description (shown on hover) */}
      {isHovered && node.description && (
        <text
          y={getNodeSize() + 30 * scale}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize={9 * scale}
          style={{ 
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {node.description.length > 40 
            ? node.description.substring(0, 37) + '...'
            : node.description}
        </text>
      )}

      {/* Status indicator */}
      <circle
        cx={getNodeSize() * 0.7}
        cy={-getNodeSize() * 0.7}
        r={4 * scale}
        fill={node.status === 'on-track' ? '#10B981' : node.status === 'at-risk' ? '#F59E0B' : '#EF4444'}
        style={{ filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))' }}
      />
    </g>
  );
};

export default OrbitalNode;