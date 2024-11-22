import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './ui/context-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Link, 
  Unlink, 
  ArrowUpCircle, 
  ArrowDownCircle,
  RotateCcw,
  Settings
} from 'lucide-react';

export function OrbitalContextMenu({ 
  children, 
  node, 
  nodes,
  onSelect,
  onAddNode,
  onEditNode,
  onDeleteNode,
  onMakeChild,
  onMakeIndependent,
  onPromote,
  onDemote,
  onResetPosition
}) {
  const canPromote = node?.type === 'moon';
  const canDemote = node?.type === 'planet';
  const canUnlink = node?.type !== 'sun' && node?.parentId;
  const isLinked = node?.parentId;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {node ? (
          <>
            <ContextMenuItem
              onClick={() => onSelect?.(node)}
              className="flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Open Details</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => onEditNode?.(node)}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Node</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            {canPromote && (
              <ContextMenuItem
                onClick={() => onPromote?.(node)}
                className="flex items-center"
              >
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                <span>Promote to Planet</span>
              </ContextMenuItem>
            )}
            {canDemote && (
              <ContextMenuItem
                onClick={() => onDemote?.(node)}
                className="flex items-center"
              >
                <ArrowDownCircle className="mr-2 h-4 w-4" />
                <span>Demote to Moon</span>
              </ContextMenuItem>
            )}
            {isLinked ? (
              <ContextMenuItem
                onClick={() => onMakeIndependent?.(node)}
                className="flex items-center"
              >
                <Unlink className="mr-2 h-4 w-4" />
                <span>Make Independent</span>
              </ContextMenuItem>
            ) : (
              <ContextMenuItem
                onClick={() => onMakeChild?.(node)}
                className="flex items-center"
              >
                <Link className="mr-2 h-4 w-4" />
                <span>Make Child</span>
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => onResetPosition?.(node)}
              className="flex items-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Reset Position</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => onDeleteNode?.(node)}
              className="flex items-center text-red-500 focus:text-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Node</span>
            </ContextMenuItem>
          </>
        ) : (
          <ContextMenuItem
            onClick={() => onAddNode?.()}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add New Node</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}