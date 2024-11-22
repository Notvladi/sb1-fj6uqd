import React, { useState } from 'react';

const categories = {
  strategy: { color: '#36B37E', name: 'Strategy' },
  operations: { color: '#6554C0', name: 'Operations' },
  technology: { color: '#FF8B00', name: 'Technology' },
  hr: { color: '#FF5630', name: 'HR' }
};

const OrbitalNode = ({ node, position, onSelect, scale }) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const effectScale = isHovered ? 1.15 : 1;

  return (
    <g
      transform={`translate(${position.x},${position.y})`}
      onClick={() => onSelect(node)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Hover effect */}
      <circle
        r={getNodeSize() * 1.4}
        fill={getNodeColor()}
        opacity={isHovered ? 0.15 : 0}
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Main node circle */}
      <circle
        r={getNodeSize()}
        fill={getNodeColor()}
        stroke="white"
        strokeWidth={2 * scale}
        style={{ 
          filter: isHovered ? 'brightness(1.2)' : 'none',
          transition: 'all 0.3s ease'
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
      {node.category && (
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