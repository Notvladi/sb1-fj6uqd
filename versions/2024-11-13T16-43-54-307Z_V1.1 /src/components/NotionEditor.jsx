import React, { useState } from 'react';
import { Plus, Calendar, Users, DollarSign, Target, AlertTriangle, X } from 'lucide-react';

const BlockMenu = ({ onSelect, onClose, position }) => {
  const blocks = [
    { id: 'text', label: 'Text block', icon: 'T' },
    { id: 'kpi', label: 'KPI', icon: <Target size={14} /> },
    { id: 'milestone', label: 'Milestone', icon: <Calendar size={14} /> },
    { id: 'team', label: 'Team member', icon: <Users size={14} /> },
    { id: 'risk', label: 'Risk', icon: <AlertTriangle size={14} /> },
    { id: 'budget', label: 'Budget item', icon: <DollarSign size={14} /> }
  ];

  return (
    <div 
      className="fixed bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 py-1 z-[60]"
      style={{ 
        top: Math.min(position.y, window.innerHeight - 300),
        left: Math.min(position.x, window.innerWidth - 200)
      }}
    >
      {blocks.map(block => (
        <button
          key={block.id}
          className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-700/80 text-left"
          onClick={() => {
            onSelect(block.id);
            onClose();
          }}
        >
          <span className="w-5 h-5 flex items-center justify-center text-gray-400">
            {typeof block.icon === 'string' ? block.icon : block.icon}
          </span>
          <span className="text-sm text-gray-200">{block.label}</span>
        </button>
      ))}
    </div>
  );
};

const EditableBlock = ({ block, onChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(block.content || '');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      onChange({ ...block, content: localContent });
    }
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return isEditing ? (
          <textarea
            className="w-full bg-gray-700/80 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setIsEditing(false);
              onChange({ ...block, content: localContent });
            }}
            autoFocus
          />
        ) : (
          <div 
            className="text-gray-300 cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {localContent || 'Click to add text...'}
          </div>
        );

      case 'kpi':
        return (
          <div className="flex items-center space-x-4 bg-gray-700/80 p-3 rounded">
            <Target size={16} className="text-blue-400" />
            <div className="flex-1">
              <input
                type="text"
                className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="KPI name"
                value={block.name || ''}
                onChange={(e) => onChange({ ...block, name: e.target.value })}
              />
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="text"
                  className="w-24 bg-gray-600/80 rounded px-2 py-1"
                  placeholder="Target"
                  value={block.target || ''}
                  onChange={(e) => onChange({ ...block, target: e.target.value })}
                />
                <input
                  type="text"
                  className="w-24 bg-gray-600/80 rounded px-2 py-1"
                  placeholder="Current"
                  value={block.current || ''}
                  onChange={(e) => onChange({ ...block, current: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'milestone':
        return (
          <div className="flex items-center space-x-4 bg-gray-700/80 p-3 rounded">
            <Calendar size={16} className="text-purple-400" />
            <div className="flex-1">
              <input
                type="date"
                className="bg-gray-600/80 rounded px-2 py-1"
                value={block.date || ''}
                onChange={(e) => onChange({ ...block, date: e.target.value })}
              />
              <input
                type="text"
                className="w-full bg-transparent border-b border-gray-600 mt-2 focus:outline-none focus:border-purple-500"
                placeholder="Milestone description"
                value={block.description || ''}
                onChange={(e) => onChange({ ...block, description: e.target.value })}
              />
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="flex items-center space-x-4 bg-gray-700/80 p-3 rounded">
            <Users size={16} className="text-blue-400" />
            <input
              type="text"
              className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Team member name"
              value={block.content || ''}
              onChange={(e) => onChange({ ...block, content: e.target.value })}
            />
          </div>
        );

      case 'risk':
        return (
          <div className="flex items-center space-x-4 bg-gray-700/80 p-3 rounded">
            <AlertTriangle size={16} className="text-yellow-500" />
            <div className="flex-1">
              <select
                className="bg-gray-600/80 rounded px-2 py-1 mb-2"
                value={block.severity || 'medium'}
                onChange={(e) => onChange({ ...block, severity: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="text"
                className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-yellow-500"
                placeholder="Risk description"
                value={block.description || ''}
                onChange={(e) => onChange({ ...block, description: e.target.value })}
              />
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="flex items-center space-x-4 bg-gray-700/80 p-3 rounded">
            <DollarSign size={16} className="text-green-500" />
            <div className="flex-1">
              <input
                type="text"
                className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-green-500"
                placeholder="Budget item name"
                value={block.name || ''}
                onChange={(e) => onChange({ ...block, name: e.target.value })}
              />
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="number"
                  className="w-32 bg-gray-600/80 rounded px-2 py-1"
                  placeholder="Amount"
                  value={block.amount || ''}
                  onChange={(e) => onChange({ ...block, amount: e.target.value })}
                />
                <select
                  className="bg-gray-600/80 rounded px-2 py-1"
                  value={block.type || 'budget'}
                  onChange={(e) => onChange({ ...block, type: e.target.value })}
                >
                  <option value="budget">Budget</option>
                  <option value="spent">Spent</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="group relative">
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-1 text-gray-400 hover:text-white"
          onClick={() => onDelete(block.id)}
        >
          <X size={14} />
        </button>
      </div>
      {renderBlockContent()}
    </div>
  );
};

const NotionEditor = ({ node, onSave, onClose }) => {
  const [blocks, setBlocks] = useState(node?.blocks || []);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleAddBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      name: '',
      target: '',
      current: '',
      date: '',
      description: ''
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleBlockChange = (updatedBlock) => {
    setBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };

  const handleBlockDelete = (blockId) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleSave = () => {
    // Process blocks based on their type
    const processedNode = { ...node };

    // Initialize arrays if they don't exist
    processedNode.team = processedNode.team || [];
    processedNode.kpis = processedNode.kpis || [];
    processedNode.risks = processedNode.risks || [];
    processedNode.timeline = processedNode.timeline || { milestones: [] };

    blocks.forEach(block => {
      switch (block.type) {
        case 'team':
          if (block.content) {
            processedNode.team.push(block.content);
          }
          break;
        case 'kpi':
          if (block.name && block.target && block.current) {
            processedNode.kpis.push({
              name: block.name,
              target: block.target,
              current: block.current
            });
          }
          break;
        case 'risk':
          if (block.description) {
            processedNode.risks.push({
              severity: block.severity || 'medium',
              description: block.description
            });
          }
          break;
        case 'milestone':
          if (block.date && block.description) {
            processedNode.timeline.milestones.push({
              date: block.date,
              description: block.description
            });
          }
          break;
        case 'budget':
          if (block.name && block.amount) {
            if (block.type === 'budget') {
              processedNode.budget = parseInt(block.amount, 10);
            } else {
              processedNode.spent = parseInt(block.amount, 10);
            }
          }
          break;
      }
    });

    onSave?.(processedNode);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">{node?.name || 'Untitled Node'}</h2>
          <button 
            className="p-2 hover:bg-gray-700/50 rounded text-gray-400 hover:text-white"
            onClick={() => onClose?.()}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {blocks.map(block => (
            <EditableBlock
              key={block.id}
              block={block}
              onChange={handleBlockChange}
              onDelete={handleBlockDelete}
            />
          ))}

          {/* Add block button */}
          <button
            className="flex items-center space-x-2 text-gray-400 hover:text-white"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMenuPosition({ 
                x: rect.left,
                y: rect.top + window.scrollY + 40
              });
              setShowBlockMenu(true);
            }}
          >
            <Plus size={16} />
            <span>Add a block</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Save changes
          </button>
        </div>
      </div>

      {showBlockMenu && (
        <BlockMenu
          position={menuPosition}
          onSelect={handleAddBlock}
          onClose={() => setShowBlockMenu(false)}
        />
      )}
    </div>
  );
};

export default NotionEditor;